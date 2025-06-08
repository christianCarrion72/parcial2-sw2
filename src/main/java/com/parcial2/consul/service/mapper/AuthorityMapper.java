package com.parcial2.consul.service.mapper;

import com.parcial2.consul.domain.Authority;
import com.parcial2.consul.service.dto.AuthorityDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Authority} and its DTO {@link AuthorityDTO}.
 */
@Mapper(componentModel = "spring")
public interface AuthorityMapper extends EntityMapper<AuthorityDTO, Authority> {}
