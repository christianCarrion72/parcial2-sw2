package com.parcial2.consul.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.parcial2.consul.domain.enumeration.EstadoCita;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.ZonedDateTime;

/**
 * A Cita.
 */
@Entity
@Table(name = "cita")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Cita implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "fecha_hora", nullable = false)
    private ZonedDateTime fechaHora;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoCita estado;

    @Column(name = "confirmada")
    private Boolean confirmada;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "user" }, allowSetters = true)
    private Paciente paciente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "user", "especialidades" }, allowSetters = true)
    private Medico medico;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "medico" }, allowSetters = true)
    private HorarioAtencion horario;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Cita id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getFechaHora() {
        return this.fechaHora;
    }

    public Cita fechaHora(ZonedDateTime fechaHora) {
        this.setFechaHora(fechaHora);
        return this;
    }

    public void setFechaHora(ZonedDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }

    public EstadoCita getEstado() {
        return this.estado;
    }

    public Cita estado(EstadoCita estado) {
        this.setEstado(estado);
        return this;
    }

    public void setEstado(EstadoCita estado) {
        this.estado = estado;
    }

    public Boolean getConfirmada() {
        return this.confirmada;
    }

    public Cita confirmada(Boolean confirmada) {
        this.setConfirmada(confirmada);
        return this;
    }

    public void setConfirmada(Boolean confirmada) {
        this.confirmada = confirmada;
    }

    public Paciente getPaciente() {
        return this.paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }

    public Cita paciente(Paciente paciente) {
        this.setPaciente(paciente);
        return this;
    }

    public Medico getMedico() {
        return this.medico;
    }

    public void setMedico(Medico medico) {
        this.medico = medico;
    }

    public Cita medico(Medico medico) {
        this.setMedico(medico);
        return this;
    }

    public HorarioAtencion getHorario() {
        return this.horario;
    }

    public void setHorario(HorarioAtencion horarioAtencion) {
        this.horario = horarioAtencion;
    }

    public Cita horario(HorarioAtencion horarioAtencion) {
        this.setHorario(horarioAtencion);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Cita)) {
            return false;
        }
        return getId() != null && getId().equals(((Cita) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Cita{" +
            "id=" + getId() +
            ", fechaHora='" + getFechaHora() + "'" +
            ", estado='" + getEstado() + "'" +
            ", confirmada='" + getConfirmada() + "'" +
            "}";
    }
}
