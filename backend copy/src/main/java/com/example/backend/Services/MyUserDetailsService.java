package com.example.backend.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.backend.Models.UserPrincipal;
import com.example.backend.Models.Users;
import com.example.backend.Repositories.UserRepo;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepo repo;

    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user1 = repo.findbyUsername(username);

        if (user1 == null) {
            throw new UsernameNotFoundException("User not found");
        }

        return new UserPrincipal(user1);
    }
}
