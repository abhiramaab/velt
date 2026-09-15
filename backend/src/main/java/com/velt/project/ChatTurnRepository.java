package com.velt.project;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChatTurnRepository extends JpaRepository<ChatTurn, UUID> {
    List<ChatTurn> findByProjectOrderByCreatedAtAsc(Project project);
}
