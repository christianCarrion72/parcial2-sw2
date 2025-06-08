package com.parcial2.consul.service.mapper;

import com.parcial2.consul.domain.Especialidad;
import com.parcial2.consul.domain.Medico;
import com.parcial2.consul.service.dto.EspecialidadDTO;
import com.parcial2.consul.service.dto.MedicoDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Especialidad} and its DTO {@link EspecialidadDTO}.
 */
@Mapper(componentModel = "spring")
public interface EspecialidadMapper extends EntityMapper<EspecialidadDTO, Especialidad> {
    @Mapping(target = "medicos", source = "medicos", qualifiedByName = "medicoIdSet")
    EspecialidadDTO toDto(Especialidad s);

    @Mapping(target = "medicos", ignore = true)
    @Mapping(target = "removeMedicos", ignore = true)
    Especialidad toEntity(EspecialidadDTO especialidadDTO);

    @Named("medicoId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    MedicoDTO toDtoMedicoId(Medico medico);

    @Named("medicoIdSet")
    default Set<MedicoDTO> toDtoMedicoIdSet(Set<Medico> medico) {
        return medico.stream().map(this::toDtoMedicoId).collect(Collectors.toSet());
    }
}
