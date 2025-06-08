package com.parcial2.consul.service.mapper;

import com.parcial2.consul.domain.Cita;
import com.parcial2.consul.domain.HorarioAtencion;
import com.parcial2.consul.domain.Medico;
import com.parcial2.consul.domain.Paciente;
import com.parcial2.consul.service.dto.CitaDTO;
import com.parcial2.consul.service.dto.HorarioAtencionDTO;
import com.parcial2.consul.service.dto.MedicoDTO;
import com.parcial2.consul.service.dto.PacienteDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Cita} and its DTO {@link CitaDTO}.
 */
@Mapper(componentModel = "spring")
public interface CitaMapper extends EntityMapper<CitaDTO, Cita> {
    @Mapping(target = "paciente", source = "paciente", qualifiedByName = "pacienteNroHistoriaClinica")
    @Mapping(target = "medico", source = "medico", qualifiedByName = "medicoMatricula")
    @Mapping(target = "horario", source = "horario", qualifiedByName = "horarioAtencionId")
    CitaDTO toDto(Cita s);

    @Named("pacienteNroHistoriaClinica")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "nroHistoriaClinica", source = "nroHistoriaClinica")
    PacienteDTO toDtoPacienteNroHistoriaClinica(Paciente paciente);

    @Named("medicoMatricula")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "matricula", source = "matricula")
    MedicoDTO toDtoMedicoMatricula(Medico medico);

    @Named("horarioAtencionId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    HorarioAtencionDTO toDtoHorarioAtencionId(HorarioAtencion horarioAtencion);
}
