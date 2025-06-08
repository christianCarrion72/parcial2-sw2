package com.parcial2.consul.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Especialidad.
 */
@Entity
@Table(name = "especialidad")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Especialidad implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "especialidades")
    @JsonIgnoreProperties(value = { "user", "especialidades" }, allowSetters = true)
    private Set<Medico> medicos = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Especialidad id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Especialidad nombre(String nombre) {
        this.setNombre(nombre);
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return this.descripcion;
    }

    public Especialidad descripcion(String descripcion) {
        this.setDescripcion(descripcion);
        return this;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Set<Medico> getMedicos() {
        return this.medicos;
    }

    public void setMedicos(Set<Medico> medicos) {
        if (this.medicos != null) {
            this.medicos.forEach(i -> i.removeEspecialidades(this));
        }
        if (medicos != null) {
            medicos.forEach(i -> i.addEspecialidades(this));
        }
        this.medicos = medicos;
    }

    public Especialidad medicos(Set<Medico> medicos) {
        this.setMedicos(medicos);
        return this;
    }

    public Especialidad addMedicos(Medico medico) {
        this.medicos.add(medico);
        medico.getEspecialidades().add(this);
        return this;
    }

    public Especialidad removeMedicos(Medico medico) {
        this.medicos.remove(medico);
        medico.getEspecialidades().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Especialidad)) {
            return false;
        }
        return getId() != null && getId().equals(((Especialidad) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Especialidad{" +
            "id=" + getId() +
            ", nombre='" + getNombre() + "'" +
            ", descripcion='" + getDescripcion() + "'" +
            "}";
    }
}
