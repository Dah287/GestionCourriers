package com.example.GestionCourrier.Service;

import com.example.GestionCourrier.Entite.User;
import com.example.GestionCourrier.Repository.UserRepository;
import com.example.GestionCourrier.Service.CustomUserDetails; // Import de ta classe CustomUserDetails
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    // Injection via constructeur
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String matricule) throws UsernameNotFoundException {
        User user = userRepository.findByMatricule(matricule)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec matricule : " + matricule));
        // Retourne ton CustomUserDetails qui encapsule l’entité User
        return new CustomUserDetails(user);
    }
}
