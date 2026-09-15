package com.velt.config;

import com.velt.auth.User;
import com.velt.auth.UserRepository;
import com.velt.project.ProjectService;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataSeeder implements ApplicationRunner {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final ProjectService projects;

    public DataSeeder(UserRepository users, PasswordEncoder encoder, ProjectService projects) {
        this.users = users;
        this.encoder = encoder;
        this.projects = projects;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        User demo = users.findByEmailIgnoreCase("studio@velt.app").orElseGet(() -> {
            User user = new User();
            user.setName("Studio");
            user.setEmail("studio@velt.app");
            user.setPasswordHash(encoder.encode("veltstudio"));
            user.setPlan("PRO");
            user.setCredits(240);
            return users.save(user);
        });

        if (projects.showcase().isEmpty()) {
            projects.createShowcase(demo, "A quiet ceramic studio in Kyoto. Wabi-sabi, lots of negative space, warm clay and paper.", "website", true);
            projects.createShowcase(demo, "SaaS landing page for a writing app used by novelists. Warm, literary, no neon.", "landing", true);
            projects.createShowcase(demo, "Neighborhood bakery mobile app. Playful but not childish. Morning light.", "app", true);
            projects.createShowcase(demo, "Swiss lecture poster for an architecture talk in Oslo. Red accent, huge type.", "poster", true);
            projects.createShowcase(demo, "Analytics dashboard for an independent fashion house. Calm numbers, serif headings.", "dashboard", true);
            projects.createShowcase(demo, "Coastal hotel in Lisbon. Salt air, tiled floors, long lunches.", "website", true);
        }
    }
}
