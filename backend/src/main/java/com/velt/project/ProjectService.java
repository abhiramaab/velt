package com.velt.project;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.velt.auth.AuthDtos;
import com.velt.auth.User;
import com.velt.auth.UserRepository;
import com.velt.common.ApiException;
import com.velt.generate.LayoutService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class ProjectService {
    private final ProjectRepository projects;
    private final DesignRepository designs;
    private final ChatTurnRepository turns;
    private final UserRepository users;
    private final LayoutService layouts;
    private final ObjectMapper mapper;

    public ProjectService(
            ProjectRepository projects,
            DesignRepository designs,
            ChatTurnRepository turns,
            UserRepository users,
            LayoutService layouts,
            ObjectMapper mapper
    ) {
        this.projects = projects;
        this.designs = designs;
        this.turns = turns;
        this.users = users;
        this.layouts = layouts;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<ProjectDtos.ProjectSummary> list(UUID userId) {
        User user = requireUser(userId);
        return projects.findByOwnerOrderByUpdatedAtDesc(user).stream()
                .map(this::toSummary)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProjectDtos.ProjectSummary> showcase() {
        return projects.findByShowcaseTrueOrderByUpdatedAtDesc().stream()
                .map(this::toSummary)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectDtos.ProjectDetail get(UUID userId, UUID projectId) {
        Project project = requireOwned(userId, projectId);
        return toDetail(project, users.findById(userId).orElseThrow());
    }

    @Transactional
    public ProjectDtos.GenerateResponse create(UUID userId, ProjectDtos.CreateProjectRequest request) {
        User user = requireUser(userId);
        spend(user, 2);
        String format = LayoutService.normalizeFormat(request.format());
        String prompt = request.prompt().trim();
        JsonNode document = layouts.generate(prompt, format);
        String title = request.title() != null && !request.title().isBlank()
                ? request.title().trim()
                : document.path("name").asText("Untitled draft");

        Project project = new Project();
        project.setOwner(user);
        project.setTitle(title);
        project.setFormat(format);
        project.setPrompt(prompt);
        project.setStatus("ready");
        project.setUpdatedAt(Instant.now());
        projects.save(project);

        Design design = new Design();
        design.setProject(project);
        design.setVersion(1);
        design.setPrompt(prompt);
        design.setDocumentJson(document.toString());
        designs.save(design);

        saveTurn(project, "user", prompt);
        saveTurn(project, "assistant", "Here's a first composition for " + title + ". Ask for a darker palette, a shorter headline, or a new section.");

        return new ProjectDtos.GenerateResponse(toDetail(project, user), user.getCredits());
    }

    @Transactional
    public ProjectDtos.GenerateResponse refine(UUID userId, UUID projectId, ProjectDtos.RefineRequest request) {
        User user = requireUser(userId);
        Project project = requireOwned(userId, projectId);
        spend(user, 1);
        Design current = designs.findFirstByProjectOrderByVersionDesc(project)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "No design on this project yet."));
        JsonNode next = layouts.refine(parse(current.getDocumentJson()), request.message());

        Design design = new Design();
        design.setProject(project);
        design.setVersion(current.getVersion() + 1);
        design.setPrompt(request.message());
        design.setDocumentJson(next.toString());
        designs.save(design);

        project.setUpdatedAt(Instant.now());
        if (next.has("name")) {
            project.setTitle(next.path("name").asText(project.getTitle()));
        }
        projects.save(project);

        saveTurn(project, "user", request.message());
        saveTurn(project, "assistant", layouts.describeChange(request.message()));

        return new ProjectDtos.GenerateResponse(toDetail(project, user), user.getCredits());
    }

    @Transactional
    public Project createShowcase(User owner, String prompt, String format, boolean showcase) {
        String fmt = LayoutService.normalizeFormat(format);
        JsonNode document = layouts.generate(prompt, fmt);
        Project project = new Project();
        project.setOwner(owner);
        project.setTitle(document.path("name").asText("Draft"));
        project.setFormat(fmt);
        project.setPrompt(prompt);
        project.setShowcase(showcase);
        project.setUpdatedAt(Instant.now());
        projects.save(project);
        Design design = new Design();
        design.setProject(project);
        design.setVersion(1);
        design.setPrompt(prompt);
        design.setDocumentJson(document.toString());
        designs.save(design);
        return project;
    }

    private ProjectDtos.ProjectSummary toSummary(Project project) {
        JsonNode preview = designs.findFirstByProjectOrderByVersionDesc(project)
                .map(d -> parse(d.getDocumentJson()))
                .orElse(mapper.createObjectNode());
        return new ProjectDtos.ProjectSummary(
                project.getId(),
                project.getTitle(),
                project.getFormat(),
                project.getPrompt(),
                project.getStatus(),
                project.getCreatedAt(),
                project.getUpdatedAt(),
                preview
        );
    }

    private ProjectDtos.ProjectDetail toDetail(Project project, User owner) {
        Design design = designs.findFirstByProjectOrderByVersionDesc(project)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Design missing."));
        List<ProjectDtos.MessageResponse> messages = turns.findByProjectOrderByCreatedAtAsc(project).stream()
                .map(t -> new ProjectDtos.MessageResponse(t.getId(), t.getRole(), t.getContent(), t.getCreatedAt()))
                .toList();
        return new ProjectDtos.ProjectDetail(
                project.getId(),
                project.getTitle(),
                project.getFormat(),
                project.getPrompt(),
                project.getStatus(),
                project.getCreatedAt(),
                project.getUpdatedAt(),
                new ProjectDtos.DesignResponse(
                        design.getId(),
                        design.getVersion(),
                        design.getPrompt(),
                        parse(design.getDocumentJson()),
                        design.getCreatedAt()
                ),
                messages,
                AuthDtos.UserResponse.from(owner)
        );
    }

    private void saveTurn(Project project, String role, String content) {
        ChatTurn turn = new ChatTurn();
        turn.setProject(project);
        turn.setRole(role);
        turn.setContent(content);
        turns.save(turn);
    }

    private void spend(User user, int cost) {
        if (user.getCredits() < cost) {
            throw new ApiException(HttpStatus.PAYMENT_REQUIRED, "Not enough credits. Upgrade a plan to keep composing.");
        }
        user.setCredits(user.getCredits() - cost);
        users.save(user);
    }

    private User requireUser(UUID userId) {
        return users.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Session expired."));
    }

    private Project requireOwned(UUID userId, UUID projectId) {
        Project project = projects.findById(projectId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Project not found."));
        if (!project.getOwner().getId().equals(userId) && !project.isShowcase()) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You don't have this project.");
        }
        return project;
    }

    private JsonNode parse(String json) {
        try {
            return mapper.readTree(json);
        } catch (Exception e) {
            return mapper.createObjectNode();
        }
    }
}
