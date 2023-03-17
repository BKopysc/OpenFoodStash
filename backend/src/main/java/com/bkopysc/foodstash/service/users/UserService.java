package com.bkopysc.foodstash.service.users;

import com.bkopysc.foodstash.domain.Role;
import com.bkopysc.foodstash.domain.User;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface UserService {

    User saveUser(User user);
    Role saveRole(Role role);
    void addRoleToUser(String username, String roleName);
    User getUser(String username);

    User getCurrentUser(Authentication authentication);

    String getUsernameById(Long id);
    List<User> getUsers();
}
