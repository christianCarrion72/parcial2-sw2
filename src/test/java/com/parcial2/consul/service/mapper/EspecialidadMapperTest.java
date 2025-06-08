package com.parcial2.consul.service.mapper;

import static com.parcial2.consul.domain.EspecialidadAsserts.*;
import static com.parcial2.consul.domain.EspecialidadTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class EspecialidadMapperTest {

    private EspecialidadMapper especialidadMapper;

    @BeforeEach
    void setUp() {
        especialidadMapper = new EspecialidadMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getEspecialidadSample1();
        var actual = especialidadMapper.toEntity(especialidadMapper.toDto(expected));
        assertEspecialidadAllPropertiesEquals(expected, actual);
    }
}
