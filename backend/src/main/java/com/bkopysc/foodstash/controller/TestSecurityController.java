//package com.bkopysc.foodstash.controller;
//
//import lombok.AllArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@AllArgsConstructor
//@RestController
//@RequestMapping("/api/test")
//public class TestSecurityController {
//
//    @GetMapping("/all")
//    public ResponseEntity<String> allAccess(){
//        return ResponseEntity.ok("All!");
//    }
//
//    @GetMapping("/user")
//    @PreAuthorize("hasRole('USER')")
//    public String forUsers(){
//        return "For users!";
//    }
//
//    @GetMapping("/admin")
//    @PreAuthorize("hasRole('ADMIN')")
//    public String forAdmins(){
//        return "Admins!";
//    }
//
//    @GetMapping("/test")
//    public ResponseEntity<String> test(){
//        return ResponseEntity.ok("test works");
//    }
//
//
//}
