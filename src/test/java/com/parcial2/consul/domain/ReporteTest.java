package com.parcial2.consul.domain;

import static com.parcial2.consul.domain.ReporteTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.parcial2.consul.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ReporteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Reporte.class);
        Reporte reporte1 = getReporteSample1();
        Reporte reporte2 = new Reporte();
        assertThat(reporte1).isNotEqualTo(reporte2);

        reporte2.setId(reporte1.getId());
        assertThat(reporte1).isEqualTo(reporte2);

        reporte2 = getReporteSample2();
        assertThat(reporte1).isNotEqualTo(reporte2);
    }
}
