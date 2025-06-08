package com.parcial2.consul.service.mapper;

import static com.parcial2.consul.domain.ReporteAsserts.*;
import static com.parcial2.consul.domain.ReporteTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ReporteMapperTest {

    private ReporteMapper reporteMapper;

    @BeforeEach
    void setUp() {
        reporteMapper = new ReporteMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getReporteSample1();
        var actual = reporteMapper.toEntity(reporteMapper.toDto(expected));
        assertReporteAllPropertiesEquals(expected, actual);
    }
}
