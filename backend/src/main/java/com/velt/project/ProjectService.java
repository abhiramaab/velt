package com.velt.project;

import com.velt.auth.User;

import java.util.List;
import java.util.UUID;

/**
 * Service contract for workspace and design document generation workflows (ISP & DIP).
 */
public interface ProjectService {

    List<ProjectDtos.ProjectSummary> list(UUID userId);

    List<ProjectDtos.ProjectSummary> showcase();

    ProjectDtos.ProjectDetail get(UUID userId, UUID projectId);

    ProjectDtos.GenerateResponse create(UUID userId, ProjectDtos.CreateProjectRequest request);

    ProjectDtos.GenerateResponse refine(UUID userId, UUID projectId, ProjectDtos.RefineRequest request);

    Project createShowcase(User owner, String prompt, String format, boolean showcase);
}
