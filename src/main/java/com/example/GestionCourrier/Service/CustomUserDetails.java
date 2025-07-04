package com.example.GestionCourrier.Service;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Collections;

public class CustomUserDetails implements UserDetails {

    private final com.example.GestionCourrier.Entite.User user;

    public CustomUserDetails(com.example.GestionCourrier.Entite.User user) {
        this.user = user;
    }

    public Long getId() {
        return user.getId();
    }

    public String getService() {
        return user.getService();
    }

    public String getBureau() {
        return user.getBureau();
    }

    public String getEntite() {
        return user.getEntite();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(() -> "ROLE_" + user.getRole());
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getMatricule(); // ou getUsername() si différent
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
