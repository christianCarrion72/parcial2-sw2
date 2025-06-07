package com.parcial2.consul.web.graphql;

import com.parcial2.consul.domain.User;
import com.parcial2.consul.security.AuthoritiesConstants;
import com.parcial2.consul.service.UserService;
import com.parcial2.consul.service.dto.AdminUserDTO;
import com.parcial2.consul.web.rest.errors.BadRequestAlertException;
import com.parcial2.consul.web.rest.errors.EmailAlreadyUsedException;
import com.parcial2.consul.web.rest.errors.LoginAlreadyUsedException;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;

@Controller
public class UserGraphQLController {

    private final Logger log = LoggerFactory.getLogger(UserGraphQLController.class);

    private final UserService userService;

    public UserGraphQLController(UserService userService) {
        this.userService = userService;
    }

    @QueryMapping
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public AdminUserDTO getUserByLogin(@Argument String login) {
        log.debug("GraphQL query to get User : {}", login);
        return userService.getUserWithAuthoritiesByLogin(login).map(AdminUserDTO::new).orElse(null);
    }

    @QueryMapping
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public List<AdminUserDTO> getAllUsers(@Argument Integer page, @Argument Integer size) {
        log.debug("GraphQL query to get all Users");
        int pageNumber = (page != null) ? page : 0;
        int pageSize = (size != null) ? size : 20;
        Page<AdminUserDTO> userPage = userService.getAllManagedUsers(PageRequest.of(pageNumber, pageSize));
        return userPage.getContent();
    }

    @MutationMapping
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public AdminUserDTO updateUser(@Argument("userInput") AdminUserDTO userDTO) {
        log.debug("GraphQL mutation to update User : {}", userDTO);
        Optional<AdminUserDTO> updatedUser = userService.updateUser(userDTO);
        return updatedUser.orElse(null);
    }

    @MutationMapping
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public User createUser(@Argument("userInput") AdminUserDTO userDTO) {
        log.debug("GraphQL mutation to create User : {}", userDTO);
        if (userDTO.getId() != null) {
            throw new BadRequestAlertException("A new user cannot already have an ID", "userManagement", "idexists");
        }
        User newUser = userService.createUser(userDTO);
        return newUser;
    }

    @MutationMapping
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public Boolean deleteUser(@Argument String login) {
        log.debug("GraphQL mutation to delete User : {}", login);
        userService.deleteUser(login);
        return true;
    }
}
