package com.parcial2.consul.service.mapper;

import com.parcial2.consul.domain.Especialidad;
import com.parcial2.consul.domain.Medico;
import com.parcial2.consul.domain.User;
import com.parcial2.consul.service.dto.EspecialidadDTO;
import com.parcial2.consul.service.dto.MedicoDTO;
import com.parcial2.consul.service.dto.UserDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Medico} and its DTO {@link MedicoDTO}.
 */
@Mapper(componentModel = "spring")
public interface MedicoMapper extends EntityMapper<MedicoDTO, Medico> {
    @Mapping(target = "user", source = "user", qualifiedByName = "userLogin")
    @Mapping(target = "especialidades", source = "especialidades", qualifiedByName = "especialidadIdSet")
    MedicoDTO toDto(Medico s);

    @Mapping(target = "removeEspecialidades", ignore = true)
    Medico toEntity(MedicoDTO medicoDTO);

    @Named("userLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    UserDTO toDtoUserLogin(User user);

    @Named("especialidadId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    EspecialidadDTO toDtoEspecialidadId(Especialidad especialidad);

    @Named("especialidadIdSet")
    default Set<EspecialidadDTO> toDtoEspecialidadIdSet(Set<Especialidad> especialidad) {
        return especialidad.stream().map(this::toDtoEspecialidadId).collect(Collectors.toSet());
    }
}
