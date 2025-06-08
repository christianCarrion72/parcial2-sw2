package com.parcial2.consul.service.dto;

import jakarta.persistence.Lob;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A DTO for the {@link com.parcial2.consul.domain.HistoriaClinica} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class HistoriaClinicaDTO implements Serializable {

    private Long id;

    @NotNull
    private ZonedDateTime fecha;

    @Lob
    private String sintomas;

    private String diagnostico;

    private String tratamiento;

    private String hashBlockchain;

    private PacienteDTO paciente;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getFecha() {
        return fecha;
    }

    public void setFecha(ZonedDateTime fecha) {
        this.fecha = fecha;
    }

    public String getSintomas() {
        return sintomas;
    }

    public void setSintomas(String sintomas) {
        this.sintomas = sintomas;
    }

    public String getDiagnostico() {
        return diagnostico;
    }

    public void setDiagnostico(String diagnostico) {
        this.diagnostico = diagnostico;
    }

    public String getTratamiento() {
        return tratamiento;
    }

    public void setTratamiento(String tratamiento) {
        this.tratamiento = tratamiento;
    }

    public String getHashBlockchain() {
        return hashBlockchain;
    }

    public void setHashBlockchain(String hashBlockchain) {
        this.hashBlockchain = hashBlockchain;
    }

    public PacienteDTO getPaciente() {
        return paciente;
    }

    public void setPaciente(PacienteDTO paciente) {
        this.paciente = paciente;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof HistoriaClinicaDTO)) {
            return false;
        }

        HistoriaClinicaDTO historiaClinicaDTO = (HistoriaClinicaDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, historiaClinicaDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "HistoriaClinicaDTO{" +
            "id=" + getId() +
            ", fecha='" + getFecha() + "'" +
            ", sintomas='" + getSintomas() + "'" +
            ", diagnostico='" + getDiagnostico() + "'" +
            ", tratamiento='" + getTratamiento() + "'" +
            ", hashBlockchain='" + getHashBlockchain() + "'" +
            ", paciente=" + getPaciente() +
            "}";
    }
}
