package com.parcial2.consul.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A DTO for the {@link com.parcial2.consul.domain.Medico} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class MedicoDTO implements Serializable {

    private Long id;

    @NotNull
    private String matricula;

    private UserDTO user;

    private Set<EspecialidadDTO> especialidades = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public Set<EspecialidadDTO> getEspecialidades() {
        return especialidades;
    }

    public void setEspecialidades(Set<EspecialidadDTO> especialidades) {
        this.especialidades = especialidades;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof MedicoDTO)) {
            return false;
        }

        MedicoDTO medicoDTO = (MedicoDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, medicoDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "MedicoDTO{" +
            "id=" + getId() +
            ", matricula='" + getMatricula() + "'" +
            ", user=" + getUser() +
            ", especialidades=" + getEspecialidades() +
            "}";
    }
}
