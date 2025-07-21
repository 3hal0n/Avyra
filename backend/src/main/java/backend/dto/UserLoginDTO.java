package backend.dto;

import jakarta.validation.constraints.NotBlank;

public class UserLoginDTO {
    @NotBlank
    private String emailOrUsername;
    public String getEmailOrUsername() { return emailOrUsername; }
    public String getPassword() { return password; }


    @NotBlank
    private String password;
}