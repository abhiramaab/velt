package com.velt.project;

import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ProjectController {
    private final ProjectService projects;

    public ProjectController(ProjectService projects) {
        this.projects = projects;
    }

    @GetMapping("/projects")
    public List<ProjectDtos.ProjectSummary> list(Authentication authentication) {
        return projects.list(UUID.fromString(authentication.getName()));
    }

    @PostMapping("/projects")
    public ProjectDtos.GenerateResponse create(
            Authentication authentication,
            @Valid @RequestBody ProjectDtos.CreateProjectRequest request
    ) {
        return projects.create(UUID.fromString(authentication.getName()), request);
    }

    @GetMapping("/projects/{id}")
    public ProjectDtos.ProjectDetail get(Authentication authentication, @PathVariable UUID id) {
        return projects.get(UUID.fromString(authentication.getName()), id);
    }

    @PostMapping("/projects/{id}/refine")
    public ProjectDtos.GenerateResponse refine(
            Authentication authentication,
            @PathVariable UUID id,
            @Valid @RequestBody ProjectDtos.RefineRequest request
    ) {
        return projects.refine(UUID.fromString(authentication.getName()), id, request);
    }

    @GetMapping("/showcase")
    public List<ProjectDtos.ProjectSummary> showcase() {
        return projects.showcase();
    }

    @GetMapping("/formats")
    public List<Map<String, String>> formats() {
        return List.of(
                Map.of("id", "website", "label", "Web Design", "blurb", "A full site with hero, sections, and a close."),
                Map.of("id", "landing", "label", "Landing Page", "blurb", "One offer, one page, composed to convert."),
                Map.of("id", "ecommerce", "label", "Shop", "blurb", "A storefront with a point of view."),
                Map.of("id", "app", "label", "App Design", "blurb", "Mobile UI you can click through before you build."),
                Map.of("id", "dashboard", "label", "Dashboard", "blurb", "An admin that already knows where the numbers go."),
                Map.of("id", "facebook", "label", "Facebook Ad", "blurb", "A feed ad with headline, visual, and a real CTA."),
                Map.of("id", "instagram", "label", "Instagram Post", "blurb", "A square built to stop the thumb."),
                Map.of("id", "story", "label", "Story", "blurb", "Full-bleed 9:16 with a sticker CTA."),
                Map.of("id", "youtube", "label", "YouTube Thumbnail", "blurb", "High-contrast 16:9 made to earn the click."),
                Map.of("id", "banner", "label", "Display Banner", "blurb", "A wide ad for web, IAB, and headers."),
                Map.of("id", "email", "label", "Email", "blurb", "A campaign letter with a hero and one ask."),
                Map.of("id", "pitch", "label", "Pitch Deck", "blurb", "A slide that holds a story, not a wall of type."),
                Map.of("id", "poster", "label", "Poster", "blurb", "Print-ready type and geometry from a single line."),
                Map.of("id", "brand", "label", "Brand Kit", "blurb", "Name, mark, palette, and a voice to start from.")
        );
    }
}
