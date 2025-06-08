package com.parcial2.consul.domain;

import static com.parcial2.consul.domain.CitaTestSamples.*;
import static com.parcial2.consul.domain.HorarioAtencionTestSamples.*;
import static com.parcial2.consul.domain.MedicoTestSamples.*;
import static com.parcial2.consul.domain.PacienteTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.parcial2.consul.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CitaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Cita.class);
        Cita cita1 = getCitaSample1();
        Cita cita2 = new Cita();
        assertThat(cita1).isNotEqualTo(cita2);

        cita2.setId(cita1.getId());
        assertThat(cita1).isEqualTo(cita2);

        cita2 = getCitaSample2();
        assertThat(cita1).isNotEqualTo(cita2);
    }

    @Test
    void pacienteTest() {
        Cita cita = getCitaRandomSampleGenerator();
        Paciente pacienteBack = getPacienteRandomSampleGenerator();

        cita.setPaciente(pacienteBack);
        assertThat(cita.getPaciente()).isEqualTo(pacienteBack);

        cita.paciente(null);
        assertThat(cita.getPaciente()).isNull();
    }

    @Test
    void medicoTest() {
        Cita cita = getCitaRandomSampleGenerator();
        Medico medicoBack = getMedicoRandomSampleGenerator();

        cita.setMedico(medicoBack);
        assertThat(cita.getMedico()).isEqualTo(medicoBack);

        cita.medico(null);
        assertThat(cita.getMedico()).isNull();
    }

    @Test
    void horarioTest() {
        Cita cita = getCitaRandomSampleGenerator();
        HorarioAtencion horarioAtencionBack = getHorarioAtencionRandomSampleGenerator();

        cita.setHorario(horarioAtencionBack);
        assertThat(cita.getHorario()).isEqualTo(horarioAtencionBack);

        cita.horario(null);
        assertThat(cita.getHorario()).isNull();
    }
}
