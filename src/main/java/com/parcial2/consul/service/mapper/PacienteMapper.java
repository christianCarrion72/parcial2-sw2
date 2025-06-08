package com.parcial2.consul.service.mapper;

import com.parcial2.consul.domain.Paciente;
import com.parcial2.consul.domain.User;
import com.parcial2.consul.service.dto.PacienteDTO;
import com.parcial2.consul.service.dto.UserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Paciente} and its DTO {@link PacienteDTO}.
 */
@Mapper(componentModel = "spring")
public interface PacienteMapper extends EntityMapper<PacienteDTO, Paciente> {
    @Mapping(target = "user", source = "user", qualifiedByName = "userLogin")
    PacienteDTO toDto(Paciente s);

    @Named("userLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    UserDTO toDtoUserLogin(User user);
}
