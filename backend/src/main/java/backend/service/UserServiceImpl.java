package backend.service;

import backend.dto.UserRegisterDTO;
import backend.dto.UserLoginDTO;
import backend.model.User;
import backend.repository.UserRepository;
import backend.security.JwtUtil;
import backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void registerUser(UserRegisterDTO request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        User user = new User(request.getEmail(), request.getUsername(), hashedPassword);
        userRepository.save(user);
    }

    @Override
    public String loginUser(UserLoginDTO request) {
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmailOrUsername());
        if (optionalUser.isEmpty()) {
            optionalUser = userRepository.findByUsername(request.getEmailOrUsername());
        }
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("Invalid credentials");
        }
        User user = optionalUser.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }
        return jwtUtil.generateToken(user.getUsername());
    }

    @Override
    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}

