package com.parcial2.consul.domain;

import static com.parcial2.consul.domain.EspecialidadTestSamples.*;
import static com.parcial2.consul.domain.MedicoTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.parcial2.consul.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class EspecialidadTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Especialidad.class);
        Especialidad especialidad1 = getEspecialidadSample1();
        Especialidad especialidad2 = new Especialidad();
        assertThat(especialidad1).isNotEqualTo(especialidad2);

        especialidad2.setId(especialidad1.getId());
        assertThat(especialidad1).isEqualTo(especialidad2);

        especialidad2 = getEspecialidadSample2();
        assertThat(especialidad1).isNotEqualTo(especialidad2);
    }

    @Test
    void medicosTest() {
        Especialidad especialidad = getEspecialidadRandomSampleGenerator();
        Medico medicoBack = getMedicoRandomSampleGenerator();

        especialidad.addMedicos(medicoBack);
        assertThat(especialidad.getMedicos()).containsOnly(medicoBack);
        assertThat(medicoBack.getEspecialidades()).containsOnly(especialidad);

        especialidad.removeMedicos(medicoBack);
        assertThat(especialidad.getMedicos()).doesNotContain(medicoBack);
        assertThat(medicoBack.getEspecialidades()).doesNotContain(especialidad);

        especialidad.medicos(new HashSet<>(Set.of(medicoBack)));
        assertThat(especialidad.getMedicos()).containsOnly(medicoBack);
        assertThat(medicoBack.getEspecialidades()).containsOnly(especialidad);

        especialidad.setMedicos(new HashSet<>());
        assertThat(especialidad.getMedicos()).doesNotContain(medicoBack);
        assertThat(medicoBack.getEspecialidades()).doesNotContain(especialidad);
    }
}
