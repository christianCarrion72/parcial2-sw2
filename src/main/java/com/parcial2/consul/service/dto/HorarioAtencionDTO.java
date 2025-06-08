package com.parcial2.consul.service.dto;

import com.parcial2.consul.domain.enumeration.DiaSemana;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalTime;
import java.util.Objects;

/**
 * A DTO for the {@link com.parcial2.consul.domain.HorarioAtencion} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class HorarioAtencionDTO implements Serializable {

    private Long id;

    @NotNull
    private DiaSemana diaSemana;

    @NotNull
    private LocalTime horaInicio;

    @NotNull
    private LocalTime horaFin;

    private MedicoDTO medico;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DiaSemana getDiaSemana() {
        return diaSemana;
    }

    public void setDiaSemana(DiaSemana diaSemana) {
        this.diaSemana = diaSemana;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalTime getHoraFin() {
        return horaFin;
    }

    public void setHoraFin(LocalTime horaFin) {
        this.horaFin = horaFin;
    }

    public MedicoDTO getMedico() {
        return medico;
    }

    public void setMedico(MedicoDTO medico) {
        this.medico = medico;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof HorarioAtencionDTO)) {
            return false;
        }

        HorarioAtencionDTO horarioAtencionDTO = (HorarioAtencionDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, horarioAtencionDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "HorarioAtencionDTO{" +
            "id=" + getId() +
            ", diaSemana='" + getDiaSemana() + "'" +
            ", horaInicio='" + getHoraInicio() + "'" +
            ", horaFin='" + getHoraFin() + "'" +
            ", medico=" + getMedico() +
            "}";
    }
}
