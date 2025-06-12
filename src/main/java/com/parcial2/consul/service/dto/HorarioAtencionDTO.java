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
    private String horaInicio;

    @NotNull
    private String horaFin;

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

    public void setDiaSemana(String diaSemana) {
        // Convertir el string a enum DiaSemana
        try {
            this.diaSemana = DiaSemana.valueOf(diaSemana);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Día de semana inválido: " + diaSemana);
        }
    }

    public @NotNull String getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(String horaInicio) {
        this.horaInicio = horaInicio;
    }

    public @NotNull String getHoraFin() {
        return horaFin;
    }

    public void setHoraFin(String horaFin) {
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
