package backend.dto;

import jakarta.validation.constraints.NotBlank;

//public class UserLoginDTO {
//    @NotBlank
//    private String emailOrUsername;
//    public String getEmailOrUsername() { return emailOrUsername; }
//    public String getPassword() { return password; }
//
//
//    @NotBlank
//    private String password;
//
//    //setters
//    public void setEmailOrUsername(String emailOrUsername) {
//        this.emailOrUsername = emailOrUsername;
//    }
//
//    public void setPassword(String password) {
//        this.password = password;
//    }
//}


public class UserLoginDTO {
    @NotBlank
    private String emailOrUsername;

    @NotBlank
    private String password;

    // Getter
    public String getEmailOrUsername() {
        return emailOrUsername;
    }

    public String getPassword() {
        return password;
    }

    // ✅ Add these setters 🔥
    public void setEmailOrUsername(String emailOrUsername) {
        this.emailOrUsername = emailOrUsername;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
