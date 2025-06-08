package com.parcial2.consul.domain;

import static com.parcial2.consul.domain.HistoriaClinicaTestSamples.*;
import static com.parcial2.consul.domain.PacienteTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.parcial2.consul.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class HistoriaClinicaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(HistoriaClinica.class);
        HistoriaClinica historiaClinica1 = getHistoriaClinicaSample1();
        HistoriaClinica historiaClinica2 = new HistoriaClinica();
        assertThat(historiaClinica1).isNotEqualTo(historiaClinica2);

        historiaClinica2.setId(historiaClinica1.getId());
        assertThat(historiaClinica1).isEqualTo(historiaClinica2);

        historiaClinica2 = getHistoriaClinicaSample2();
        assertThat(historiaClinica1).isNotEqualTo(historiaClinica2);
    }

    @Test
    void pacienteTest() {
        HistoriaClinica historiaClinica = getHistoriaClinicaRandomSampleGenerator();
        Paciente pacienteBack = getPacienteRandomSampleGenerator();

        historiaClinica.setPaciente(pacienteBack);
        assertThat(historiaClinica.getPaciente()).isEqualTo(pacienteBack);

        historiaClinica.paciente(null);
        assertThat(historiaClinica.getPaciente()).isNull();
    }
}
