package com.parcial2.consul.service.mapper;

import com.parcial2.consul.domain.Reporte;
import com.parcial2.consul.service.dto.ReporteDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Reporte} and its DTO {@link ReporteDTO}.
 */
@Mapper(componentModel = "spring")
public interface ReporteMapper extends EntityMapper<ReporteDTO, Reporte> {}
