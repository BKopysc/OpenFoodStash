package com.bkopysc.foodstash.controller;

import com.bkopysc.foodstash.domain.Role;
import com.bkopysc.foodstash.service.users.UserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/role")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class RoleController {

    private final UserService userService;


    @PostMapping("/save")
    public ResponseEntity<Role> saveRole(@RequestBody Role role){
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/role/save").toUriString());
        return  ResponseEntity.created(uri).body(userService.saveRole(role));
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/addtouser")
    public ResponseEntity<?> addRoleToUser(@RequestBody RoleToUserForm form){
        userService.addRoleToUser(form.getUsername(), form.getRoleName());
        return ResponseEntity.ok().build();
    }
}

@Data
class RoleToUserForm {
    private String username;
    private String roleName;
}

