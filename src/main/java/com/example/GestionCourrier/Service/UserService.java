package com.example.GestionCourrier.Service;

import com.example.GestionCourrier.Entite.Role;
import com.example.GestionCourrier.Entite.User;
import com.example.GestionCourrier.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ✅ Constructeur manuel sans Lombok
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(String matricule, String username,String password, Role role ,String entite,String service,String bureau) {
        User user = new User();
        user.setMatricule(matricule);  // <- obligatoire !
        user.setUsername(username);   // si tu souhaites garder username identique au matricule, sinon adapte
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setEntite(entite);
        user.setService(service);
        user.setBureau(bureau);
        return userRepository.save(user);
    }


    //CRUD USER
    public List <User> findAll() {
        return userRepository.findAll();
    }


    public Optional <User> updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setUsername(updatedUser.getUsername());
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword())); // tu peux encoder ici si nécessaire
            user.setRole(updatedUser.getRole());
            user.setMatricule(updatedUser.getMatricule());
            user.setService(updatedUser.getService());
            user.setBureau(updatedUser.getBureau());
            user.setEntite(updatedUser.getEntite());
            return userRepository.save(user);
        });
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}