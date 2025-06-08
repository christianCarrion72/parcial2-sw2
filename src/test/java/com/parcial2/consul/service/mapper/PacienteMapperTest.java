package com.parcial2.consul.service.mapper;

import static com.parcial2.consul.domain.PacienteAsserts.*;
import static com.parcial2.consul.domain.PacienteTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PacienteMapperTest {

    private PacienteMapper pacienteMapper;

    @BeforeEach
    void setUp() {
        pacienteMapper = new PacienteMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getPacienteSample1();
        var actual = pacienteMapper.toEntity(pacienteMapper.toDto(expected));
        assertPacienteAllPropertiesEquals(expected, actual);
    }
}
