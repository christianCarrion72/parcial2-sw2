package com.parcial2.consul.domain;

import static com.parcial2.consul.domain.EspecialidadTestSamples.*;
import static com.parcial2.consul.domain.MedicoTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.parcial2.consul.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class MedicoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Medico.class);
        Medico medico1 = getMedicoSample1();
        Medico medico2 = new Medico();
        assertThat(medico1).isNotEqualTo(medico2);

        medico2.setId(medico1.getId());
        assertThat(medico1).isEqualTo(medico2);

        medico2 = getMedicoSample2();
        assertThat(medico1).isNotEqualTo(medico2);
    }

    @Test
    void especialidadesTest() {
        Medico medico = getMedicoRandomSampleGenerator();
        Especialidad especialidadBack = getEspecialidadRandomSampleGenerator();

        medico.addEspecialidades(especialidadBack);
        assertThat(medico.getEspecialidades()).containsOnly(especialidadBack);

        medico.removeEspecialidades(especialidadBack);
        assertThat(medico.getEspecialidades()).doesNotContain(especialidadBack);

        medico.especialidades(new HashSet<>(Set.of(especialidadBack)));
        assertThat(medico.getEspecialidades()).containsOnly(especialidadBack);

        medico.setEspecialidades(new HashSet<>());
        assertThat(medico.getEspecialidades()).doesNotContain(especialidadBack);
    }
}
