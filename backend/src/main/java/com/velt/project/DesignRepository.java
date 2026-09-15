package com.velt.project;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DesignRepository extends JpaRepository<Design, UUID> {
    List<Design> findByProjectOrderByVersionDesc(Project project);

    Optional<Design> findFirstByProjectOrderByVersionDesc(Project project);

    int countByProject(Project project);
}
