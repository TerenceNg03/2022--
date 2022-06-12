package zju.se.management.service;

import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import zju.se.management.authentication.CryptoUtil;
import zju.se.management.repository.UserRepository;
import zju.se.management.entity.User;
import zju.se.management.utils.UserAlreadyExistsException;
import zju.se.management.utils.UserNotFoundException;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(int id) throws UserNotFoundException {
        return userRepository.findById(id).orElseThrow(UserNotFoundException::new);
    }

    public User getUserByName(String name) throws UserNotFoundException {
        return userRepository.findDistinctByUserName(name).orElseThrow(UserNotFoundException::new);
    }

    public List<User> getUserByRole(User.userType role) {
        return userRepository.findByRole(role);
    }

    public synchronized void deleteUserById(int id) throws UserNotFoundException {
        if(!isExist(id)) {
            throw new UserNotFoundException();
        }
        userRepository.deleteById(id);
    }

    public synchronized void deleteUserByName(String name) throws UserNotFoundException {
        if(!isExist(name)) {
            throw new UserNotFoundException();
        }
        userRepository.deleteByUserName(name);
    }

    public synchronized void addUser(@NotNull User user) throws UserAlreadyExistsException {
        if(isExist(user.getUserName())) {
            throw new UserAlreadyExistsException();
        }
        userRepository.save(user);
    }

    public String getPasswordByName(String name) throws UserNotFoundException {
        User user = getUserByName(name);
        return user.getPassword();
    }

    public synchronized void setPasswordByName(String name, String password) throws UserNotFoundException {
        User user = getUserByName(name);
        user.setPassword(password);
        userRepository.save(user);
    }

    public boolean isExist(String name) {
       return userRepository.existsByUserName(name);
    }

    public boolean isExist(int id) {
        return userRepository.existsById(id);
    }

    public int countByRole(User.userType role) {
        return userRepository.countByRole(role);
    }

    public int countAll() {
        return userRepository.countAll();
    }

}
