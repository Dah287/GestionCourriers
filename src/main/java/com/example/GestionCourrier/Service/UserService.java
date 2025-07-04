package com.example.GestionCourrier.Service;

import com.example.GestionCourrier.Entite.Role;
import com.example.GestionCourrier.Entite.User;
import com.example.GestionCourrier.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ✅ Constructeur manuel sans Lombok
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(String matricule, String username,String password, Role role) {
        User user = new User();
        user.setMatricule(matricule);  // <- obligatoire !
        user.setUsername(username);   // si tu souhaites garder username identique au matricule, sinon adapte
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        return userRepository.save(user);
    }

}