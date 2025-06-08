package com.parcial2.consul.service.mapper;

import static com.parcial2.consul.domain.HistoriaClinicaAsserts.*;
import static com.parcial2.consul.domain.HistoriaClinicaTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class HistoriaClinicaMapperTest {

    private HistoriaClinicaMapper historiaClinicaMapper;

    @BeforeEach
    void setUp() {
        historiaClinicaMapper = new HistoriaClinicaMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getHistoriaClinicaSample1();
        var actual = historiaClinicaMapper.toEntity(historiaClinicaMapper.toDto(expected));
        assertHistoriaClinicaAllPropertiesEquals(expected, actual);
    }
}
