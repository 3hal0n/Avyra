package backend.service;

import  backend.dto.UserRegisterDTO;
import backend.dto.UserLoginDTO;
import backend.model.User;

public interface UserService {
    void registerUser(UserRegisterDTO request);
    String loginUser(UserLoginDTO request);
    User getAuthenticatedUser();
}
