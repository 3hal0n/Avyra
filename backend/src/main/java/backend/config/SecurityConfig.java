//package backend.config;
//
//import backend.security.JwtUtil;
//import backend.config.JwtAuthenticationFilter; // Adjust import if needed
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
//
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//import org.springframework.web.cors.CorsConfigurationSource;
//
//import java.util.List;
//
//@Configuration
//public class SecurityConfig {
//
//    private final JwtUtil jwtUtil;
//
//    public SecurityConfig(JwtUtil jwtUtil) {
//        this.jwtUtil = jwtUtil;
//    }
//
//    @Bean
//    public SecurityFilterChain securityFilter(HttpSecurity http) throws Exception {
//        http
//                .cors() // Enable CORS support
//                .and()
//                .csrf(AbstractHttpConfigurer::disable)
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers(
//                                "/api/auth/**",
//                                "/api/games/**",
//                                "/api/cart/**",
//                                "/api/orders/**",
//                                "/api/wishlist/**",
//                                "/api/chatbot/**",
//                                "/img/**",          //Allow static resources
//                                "/css/**",
//                                "/js/**",
//                                "/",
//                                "/index.html",
//                                "/favicon.ico"
//                        ).permitAll()
//                        .anyRequest().authenticated()
//                )
//                .addFilterBefore(
//                        new JwtAuthenticationFilter(jwtUtil),
//                        UsernamePasswordAuthenticationFilter.class
//                );
//
//        return http.build();
//    }
//
//
//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration config = new CorsConfiguration();
//        config.setAllowedOrigins(List.of("http://localhost:5173")); // Frontend origin
//        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
//        config.setAllowedHeaders(List.of("*"));
//        config.setAllowCredentials(true); // Allow cookies/auth headers
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", config);
//
//        return source;
//    }
//}


package backend.config;

import backend.config.JwtAuthenticationFilter;
import backend.security.JwtUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtUtil jwtUtil;

    public SecurityConfig(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public SecurityFilterChain securityFilter(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))  // ✅ New syntax
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/games/**",
                                "/api/cart/**",
                                "/api/orders/**",
                                "/api/chatbot/**",
                                "/api/wishlist/**",
                                "/img/**", "/css/**", "/js/**",
                                "/index.html", "/", "/favicon.ico"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(
                        new JwtAuthenticationFilter(jwtUtil),
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    // ✅ Recommended CORS bean
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
