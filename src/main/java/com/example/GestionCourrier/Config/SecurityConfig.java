package com.example.GestionCourrier.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS
                .authorizeHttpRequests(authorize -> authorize
                        .anyRequest().permitAll() // Autoriser toutes les requêtes sans authentification
                )
                .csrf(csrf -> csrf.disable()) // Désactiver la protection CSRF
                .headers(headers -> headers
                        .frameOptions(frameOptions -> frameOptions.disable()) // Nouvelle façon de désactiver frameOptions
                )
                .formLogin(formLogin -> formLogin.disable()) // Désactiver le form login
                .httpBasic(httpBasic -> httpBasic.disable()) // Désactiver l'authentification basique
                .logout(logout -> logout.disable()); // Désactiver la fonctionnalité de logout

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000","http://192.168.1.86:3000")); // Allow your React app's origin
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Allowed HTTP methods
        configuration.setAllowedHeaders(List.of("*")); // Allow all headers
        configuration.setAllowCredentials(true); // Allow credentials (if needed)

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Apply to all paths
        return source;
    }
}