package com.parcial2.consul.domain;

import static com.parcial2.consul.domain.HorarioAtencionTestSamples.*;
import static com.parcial2.consul.domain.MedicoTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.parcial2.consul.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class HorarioAtencionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(HorarioAtencion.class);
        HorarioAtencion horarioAtencion1 = getHorarioAtencionSample1();
        HorarioAtencion horarioAtencion2 = new HorarioAtencion();
        assertThat(horarioAtencion1).isNotEqualTo(horarioAtencion2);

        horarioAtencion2.setId(horarioAtencion1.getId());
        assertThat(horarioAtencion1).isEqualTo(horarioAtencion2);

        horarioAtencion2 = getHorarioAtencionSample2();
        assertThat(horarioAtencion1).isNotEqualTo(horarioAtencion2);
    }

    @Test
    void medicoTest() {
        HorarioAtencion horarioAtencion = getHorarioAtencionRandomSampleGenerator();
        Medico medicoBack = getMedicoRandomSampleGenerator();

        horarioAtencion.setMedico(medicoBack);
        assertThat(horarioAtencion.getMedico()).isEqualTo(medicoBack);

        horarioAtencion.medico(null);
        assertThat(horarioAtencion.getMedico()).isNull();
    }
}
