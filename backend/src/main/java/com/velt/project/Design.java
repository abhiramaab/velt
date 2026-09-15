package com.velt.project;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "designs")
public class Design {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Project project;

    @Column(nullable = false)
    private int version;

    @Column(nullable = false, length = 4000)
    private String prompt;

    @Lob
    @Column(nullable = false)
    private String documentJson;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public UUID getId() {
        return id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getDocumentJson() {
        return documentJson;
    }

    public void setDocumentJson(String documentJson) {
        this.documentJson = documentJson;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
