package com.parcial2.consul.service.mapper;

import static com.parcial2.consul.domain.HorarioAtencionAsserts.*;
import static com.parcial2.consul.domain.HorarioAtencionTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class HorarioAtencionMapperTest {

    private HorarioAtencionMapper horarioAtencionMapper;

    @BeforeEach
    void setUp() {
        horarioAtencionMapper = new HorarioAtencionMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getHorarioAtencionSample1();
        var actual = horarioAtencionMapper.toEntity(horarioAtencionMapper.toDto(expected));
        assertHorarioAtencionAllPropertiesEquals(expected, actual);
    }
}
