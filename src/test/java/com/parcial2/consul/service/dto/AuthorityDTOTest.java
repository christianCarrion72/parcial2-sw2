package com.parcial2.consul.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.parcial2.consul.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AuthorityDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(AuthorityDTO.class);
        AuthorityDTO authorityDTO1 = new AuthorityDTO();
        authorityDTO1.setName("id1");
        AuthorityDTO authorityDTO2 = new AuthorityDTO();
        assertThat(authorityDTO1).isNotEqualTo(authorityDTO2);
        authorityDTO2.setName(authorityDTO1.getName());
        assertThat(authorityDTO1).isEqualTo(authorityDTO2);
        authorityDTO2.setName("id2");
        assertThat(authorityDTO1).isNotEqualTo(authorityDTO2);
        authorityDTO1.setName(null);
        assertThat(authorityDTO1).isNotEqualTo(authorityDTO2);
    }
}
