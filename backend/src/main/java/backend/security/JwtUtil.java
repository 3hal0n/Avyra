////package backend.security;
////
////import io.jsonwebtoken.*;
////import org.springframework.stereotype.Component;
////
////import java.util.Date;
////
////@Component
////public class JwtUtil {
////    private final String jwtSecret = "ReplaceWithASecureSecretKey1234";
////    private final long jwtExpirationMs = 86400000; // 1 day
////
////    public String generateToken(String username) {
////        return Jwts.builder()
////                .setSubject(username)
////                .setIssuedAt(new Date())
////                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
////                .signWith(SignatureAlgorithm.HS512, jwtSecret)
////                .compact();
////    }
////
////    public String getUsername(String token) {
////        return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().getSubject();
////    }
////
////    public boolean validateJwtToken(String token) {
////        try {
////            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
////            return true;
////        } catch (JwtException | IllegalArgumentException ex) {
////            return false;
////        }
////    }
////}
//
//package backend.security;
//
//import io.jsonwebtoken.*;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.stereotype.Component;
//
//import java.security.Key;
//import java.util.Date;
//
//@Component
//public class JwtUtil {
//
//    private final Key key = Keys.hmacShaKeyFor("ReplaceWithASecureSecretKey1234ReplaceWithASecureSecretKey1234".getBytes()); // 256-bit key (32+ chars)
//    private final long expirationMs = 86400000; // 1 day
//
//    public String generateToken(String username) {
//        return Jwts.builder()
//                .setSubject(username)
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
//                .signWith(key, SignatureAlgorithm.HS256)
//                .compact();
//    }
//
//    public boolean validateJwtToken(String token) {
//        try {
//            Jwts.parserBuilder().setSigningKey(key).build()
//                    .parseClaimsJws(token);
//            return true;
//        } catch (JwtException | IllegalArgumentException e) {
//            return false;
//        }
//    }
//
//    public String getUsername(String token) {
//        return Jwts.parserBuilder().setSigningKey(key).build()
//                .parseClaimsJws(token)
//                .getBody()
//                .getSubject();
//    }
//}
//

package backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final Key key;
    private final long expirationMs;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration.ms}") long expirationMs
    ) {
        if (secret.length() < 32) {
            throw new IllegalArgumentException("JWT secret key must be at least 32 characters");
        }
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.expirationMs = expirationMs;
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateJwtToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String getUsername(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}

