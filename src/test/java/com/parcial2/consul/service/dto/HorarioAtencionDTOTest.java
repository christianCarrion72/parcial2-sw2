package com.parcial2.consul.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.parcial2.consul.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class HorarioAtencionDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(HorarioAtencionDTO.class);
        HorarioAtencionDTO horarioAtencionDTO1 = new HorarioAtencionDTO();
        horarioAtencionDTO1.setId(1L);
        HorarioAtencionDTO horarioAtencionDTO2 = new HorarioAtencionDTO();
        assertThat(horarioAtencionDTO1).isNotEqualTo(horarioAtencionDTO2);
        horarioAtencionDTO2.setId(horarioAtencionDTO1.getId());
        assertThat(horarioAtencionDTO1).isEqualTo(horarioAtencionDTO2);
        horarioAtencionDTO2.setId(2L);
        assertThat(horarioAtencionDTO1).isNotEqualTo(horarioAtencionDTO2);
        horarioAtencionDTO1.setId(null);
        assertThat(horarioAtencionDTO1).isNotEqualTo(horarioAtencionDTO2);
    }
}
