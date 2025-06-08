package com.parcial2.consul.service.mapper;

import static com.parcial2.consul.domain.AuthorityAsserts.*;
import static com.parcial2.consul.domain.AuthorityTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class AuthorityMapperTest {

    private AuthorityMapper authorityMapper;

    @BeforeEach
    void setUp() {
        authorityMapper = new AuthorityMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getAuthoritySample1();
        var actual = authorityMapper.toEntity(authorityMapper.toDto(expected));
        assertAuthorityAllPropertiesEquals(expected, actual);
    }
}
