package com.example.GestionCourrier.Repository;

import com.example.GestionCourrier.Entite.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User , Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByMatricule(String matricule);

}
