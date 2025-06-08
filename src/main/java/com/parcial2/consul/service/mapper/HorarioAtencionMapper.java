package com.parcial2.consul.service.mapper;

import com.parcial2.consul.domain.HorarioAtencion;
import com.parcial2.consul.domain.Medico;
import com.parcial2.consul.service.dto.HorarioAtencionDTO;
import com.parcial2.consul.service.dto.MedicoDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link HorarioAtencion} and its DTO {@link HorarioAtencionDTO}.
 */
@Mapper(componentModel = "spring")
public interface HorarioAtencionMapper extends EntityMapper<HorarioAtencionDTO, HorarioAtencion> {
    @Mapping(target = "medico", source = "medico", qualifiedByName = "medicoMatricula")
    HorarioAtencionDTO toDto(HorarioAtencion s);

    @Named("medicoMatricula")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "matricula", source = "matricula")
    MedicoDTO toDtoMedicoMatricula(Medico medico);
}
