package com.parcial2.consul.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.ZonedDateTime;

/**
 * A Reporte.
 */
@Entity
@Table(name = "reporte")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Reporte implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "tipo", nullable = false)
    private String tipo;

    @NotNull
    @Column(name = "fecha_generacion", nullable = false)
    private ZonedDateTime fechaGeneracion;

    @NotNull
    @Column(name = "ruta_archivo", nullable = false)
    private String rutaArchivo;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Reporte id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTipo() {
        return this.tipo;
    }

    public Reporte tipo(String tipo) {
        this.setTipo(tipo);
        return this;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public ZonedDateTime getFechaGeneracion() {
        return this.fechaGeneracion;
    }

    public Reporte fechaGeneracion(ZonedDateTime fechaGeneracion) {
        this.setFechaGeneracion(fechaGeneracion);
        return this;
    }

    public void setFechaGeneracion(ZonedDateTime fechaGeneracion) {
        this.fechaGeneracion = fechaGeneracion;
    }

    public String getRutaArchivo() {
        return this.rutaArchivo;
    }

    public Reporte rutaArchivo(String rutaArchivo) {
        this.setRutaArchivo(rutaArchivo);
        return this;
    }

    public void setRutaArchivo(String rutaArchivo) {
        this.rutaArchivo = rutaArchivo;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Reporte)) {
            return false;
        }
        return getId() != null && getId().equals(((Reporte) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Reporte{" +
            "id=" + getId() +
            ", tipo='" + getTipo() + "'" +
            ", fechaGeneracion='" + getFechaGeneracion() + "'" +
            ", rutaArchivo='" + getRutaArchivo() + "'" +
            "}";
    }
}
