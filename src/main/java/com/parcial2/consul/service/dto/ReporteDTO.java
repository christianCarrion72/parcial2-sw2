package com.parcial2.consul.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A DTO for the {@link com.parcial2.consul.domain.Reporte} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ReporteDTO implements Serializable {

    private Long id;

    @NotNull
    private String tipo;

    @NotNull
    private ZonedDateTime fechaGeneracion;

    @NotNull
    private String rutaArchivo;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public ZonedDateTime getFechaGeneracion() {
        return fechaGeneracion;
    }

    public void setFechaGeneracion(ZonedDateTime fechaGeneracion) {
        this.fechaGeneracion = fechaGeneracion;
    }

    public String getRutaArchivo() {
        return rutaArchivo;
    }

    public void setRutaArchivo(String rutaArchivo) {
        this.rutaArchivo = rutaArchivo;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ReporteDTO)) {
            return false;
        }

        ReporteDTO reporteDTO = (ReporteDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, reporteDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ReporteDTO{" +
            "id=" + getId() +
            ", tipo='" + getTipo() + "'" +
            ", fechaGeneracion='" + getFechaGeneracion() + "'" +
            ", rutaArchivo='" + getRutaArchivo() + "'" +
            "}";
    }
}
