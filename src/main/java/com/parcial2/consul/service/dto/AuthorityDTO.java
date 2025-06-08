package com.parcial2.consul.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.parcial2.consul.domain.Authority} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AuthorityDTO implements Serializable {

    @NotNull
    @Size(max = 50)
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AuthorityDTO)) {
            return false;
        }

        AuthorityDTO authorityDTO = (AuthorityDTO) o;
        if (this.name == null) {
            return false;
        }
        return Objects.equals(this.name, authorityDTO.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.name);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AuthorityDTO{" +
            "name='" + getName() + "'" +
            "}";
    }
}
