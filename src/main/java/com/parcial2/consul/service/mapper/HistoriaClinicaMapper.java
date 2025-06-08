package com.parcial2.consul.service.mapper;

import com.parcial2.consul.domain.HistoriaClinica;
import com.parcial2.consul.domain.Paciente;
import com.parcial2.consul.service.dto.HistoriaClinicaDTO;
import com.parcial2.consul.service.dto.PacienteDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link HistoriaClinica} and its DTO {@link HistoriaClinicaDTO}.
 */
@Mapper(componentModel = "spring")
public interface HistoriaClinicaMapper extends EntityMapper<HistoriaClinicaDTO, HistoriaClinica> {
    @Mapping(target = "paciente", source = "paciente", qualifiedByName = "pacienteNroHistoriaClinica")
    HistoriaClinicaDTO toDto(HistoriaClinica s);

    @Named("pacienteNroHistoriaClinica")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "nroHistoriaClinica", source = "nroHistoriaClinica")
    PacienteDTO toDtoPacienteNroHistoriaClinica(Paciente paciente);
}
