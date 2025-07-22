package backend.controller;

import backend.dto.UserRegisterDTO;
import backend.dto.UserLoginDTO;
import backend.model.User;
import backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private final UserService userService;
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Register Endpoint
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegisterDTO request) {
        userService.registerUser(request); // Handles hashing, uniqueness, exceptions
        return ResponseEntity.ok("Registration successful!");
    }

    // Login Endpoint
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody UserLoginDTO request) {
        String jwtToken = userService.loginUser(request); // Returns JWT on valid login
        return ResponseEntity.ok(Map.of("token", jwtToken)); //safer now
    }

    // Profile Endpoint (Protected, returns user info)
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        User user = userService.getAuthenticatedUser(); // Requires JWT filter to extract principal
        return ResponseEntity.ok(user);
    }

    @ControllerAdvice
    public class GlobalExceptionHandler {

        @ExceptionHandler(Exception.class)
        public ResponseEntity<?> handleError(Exception ex) {
            ex.printStackTrace(); // Logs to console
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

}

