package com.velt.project;

import com.velt.auth.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
    List<Project> findByOwnerOrderByUpdatedAtDesc(User owner);

    List<Project> findByShowcaseTrueOrderByUpdatedAtDesc();
}
