package com.example.GestionCourrier.Controller;

import com.example.GestionCourrier.Entite.Role;
import com.example.GestionCourrier.Entite.User;
import com.example.GestionCourrier.Security.JwtUtil;
import com.example.GestionCourrier.Service.CustomUserDetails;
import com.example.GestionCourrier.Service.UserService;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://192.168.1.87:3000")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager, UserService userService, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.registerUser(
                user.getMatricule(),
                user.getUsername(),
                user.getPassword(),
                user.getRole(),
                user.getEntite(),
                user.getService(),
                user.getBureau()
        );
    }




    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String matricule, @RequestParam String password) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(matricule, password)
            );

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

            String role = userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
            String token = jwtUtil.generateToken(userDetails.getUsername(), role);

            Map<String, Object> response = new HashMap<>() ;
            response.put("token", token);
            response.put("role", role);
            response.put("username", userDetails.getUsername());
            response.put("id", userDetails.getId());
            response.put("service", userDetails.getService());  // OK même si null
            response.put("bureau", userDetails.getBureau());
            response.put("entite", userDetails.getEntite());

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Matricule ou mot de passe incorrect --> " + e.getMessage()));
        } catch (DisabledException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Compte désactivé. Contactez l'administrateur."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur serveur : " + e.getClass().getSimpleName() + " - " + e.getMessage()));
        }
    }

    @GetMapping("/hello")
    public String hello() {
        return "Bienvenue !";
    }

    // 🔹 Récupérer tous les utilisateurs
    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAll();
    }

    // 🔹 Mettre à jour un utilisateur existant
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        Optional <User> userOpt = userService.updateUser(id, updatedUser);
        return userOpt.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // 🔹 Supprimer un utilisateur
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

}
