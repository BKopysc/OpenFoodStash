package com.bkopysc.foodstash.service.users;

import com.bkopysc.foodstash.domain.ERole;
import com.bkopysc.foodstash.domain.Role;
import com.bkopysc.foodstash.domain.User;
import com.bkopysc.foodstash.repository.RoleRepository;
import com.bkopysc.foodstash.repository.UserRepository;
import com.bkopysc.foodstash.utils.exceptions.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class UserServiceImpl implements UserService, UserDetailsService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    private final String USER_NOT_EXIST = "user.auth.error.userNotExists";

    @Override
    public UserDetails loadUserByUsername(String username){
        Optional<User> user = userRepository.findByUsername(username);
        if(!user.isPresent()){
            log.error("User not found in database");
            throw new UsernameNotFoundException("User not found in the database");
        } else {
            log.error("User found in database: {}", username);
        }
        User user1 = user.get();
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        user1.getRoles().forEach(role -> {
            authorities.add(new SimpleGrantedAuthority(role.getName().toString()));
        });

        return new org.springframework.security.core.userdetails.User(user1.getUsername(), user1.getPassword(), authorities);
    }

    @Override
    public User saveUser(User user) {
        log.info("Saving new user to the database");
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public Role saveRole(Role role) {
        log.info("Saving new role to the database");
        return roleRepository.save(role);
    }

    @Override
    public void addRoleToUser(String username, String roleName) {
        log.info("Adding role {} to user {}", roleName, username);

    }

    @Override
    public User getUser(String username) {
        log.info("Fetching user {}", username);
        Optional<User> user = userRepository.findByUsername(username);
        return user.orElse(null);
    }

    @Override
    public User getCurrentUser(Authentication authentication) {
        String name = authentication.getName();

        Optional<com.bkopysc.foodstash.domain.User> _user = userRepository.findByUsername(name);
        if(_user.isEmpty()){
            throw new BadRequestException(USER_NOT_EXIST);
        }

        return _user.get();
    }

    @Override
    public String getUsernameById(Long id) {

        Optional<com.bkopysc.foodstash.domain.User> _user = userRepository.findById(id);
        String username = "";
        if(_user.isPresent()){
            username = _user.get().getUsername();
        }
        return username;
    }

    @Override
    public List<User> getUsers() {
        log.info("Fetching all users");
        return userRepository.findAll();
    }

}
