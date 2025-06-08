package com.parcial2.consul.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.parcial2.consul.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class HistoriaClinicaDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(HistoriaClinicaDTO.class);
        HistoriaClinicaDTO historiaClinicaDTO1 = new HistoriaClinicaDTO();
        historiaClinicaDTO1.setId(1L);
        HistoriaClinicaDTO historiaClinicaDTO2 = new HistoriaClinicaDTO();
        assertThat(historiaClinicaDTO1).isNotEqualTo(historiaClinicaDTO2);
        historiaClinicaDTO2.setId(historiaClinicaDTO1.getId());
        assertThat(historiaClinicaDTO1).isEqualTo(historiaClinicaDTO2);
        historiaClinicaDTO2.setId(2L);
        assertThat(historiaClinicaDTO1).isNotEqualTo(historiaClinicaDTO2);
        historiaClinicaDTO1.setId(null);
        assertThat(historiaClinicaDTO1).isNotEqualTo(historiaClinicaDTO2);
    }
}
