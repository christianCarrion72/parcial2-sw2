package com.parcial2.consul.web.graphql;

import com.parcial2.consul.repository.ReporteRepository;
import com.parcial2.consul.service.ReporteService;
import com.parcial2.consul.service.dto.ReporteDTO;
import com.parcial2.consul.web.rest.errors.BadRequestAlertException;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

@Controller
public class ReporteGraphQLController {

    private final Logger log = LoggerFactory.getLogger(ReporteGraphQLController.class);

    private final ReporteService reporteService;
    private final ReporteRepository reporteRepository;

    public ReporteGraphQLController(ReporteService reporteService, ReporteRepository reporteRepository) {
        this.reporteService = reporteService;
        this.reporteRepository = reporteRepository;
    }

    @QueryMapping
    public ReporteDTO getReporteById(@Argument Long id) {
        log.debug("GraphQL query to get Reporte : {}", id);
        return reporteService.findOne(id).orElse(null);
    }

    @QueryMapping
    public List<ReporteDTO> getAllReportes(@Argument Integer page, @Argument Integer size, @Argument String sort) {
        log.debug("GraphQL query to get all Reportes with sort: {}", sort);

        int pageNumber = (page != null) ? page : 0;
        int pageSize = (size != null) ? size : 20;

        // Crear el PageRequest con ordenamiento
        PageRequest pageRequest;
        if (sort != null && !sort.isEmpty()) {
            String[] sortParts = sort.split(",");
            String property = sortParts[0];
            Sort.Direction direction = sortParts.length > 1 && sortParts[1].equalsIgnoreCase("desc")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
            pageRequest = PageRequest.of(pageNumber, pageSize, Sort.by(direction, property));
        } else {
            // Ordenamiento por defecto por ID ascendente
            pageRequest = PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.ASC, "id"));
        }

        Page<ReporteDTO> reportePage = reporteService.findAll(pageRequest);
        return reportePage.getContent();
    }

    @MutationMapping
    public ReporteDTO createReporte(@Argument("reporteInput") Map<String, Object> reporteInput) {
        log.debug("GraphQL mutation to create Reporte : {}", reporteInput);

        ReporteDTO reporteDTO = new ReporteDTO();
        reporteDTO.setTipo((String) reporteInput.get("tipo"));

        if (reporteInput.containsKey("fechaGeneracion")) {
            reporteDTO.setFechaGeneracion(ZonedDateTime.parse((String) reporteInput.get("fechaGeneracion")));
        }

        reporteDTO.setRutaArchivo((String) reporteInput.get("rutaArchivo"));

        return reporteService.save(reporteDTO);
    }

    @MutationMapping
    public ReporteDTO updateReporte(@Argument Long id, @Argument("reporteInput") Map<String, Object> reporteInput) {
        log.debug("GraphQL mutation to update Reporte : {}, {}", id, reporteInput);

        ReporteDTO reporteDTO = new ReporteDTO();
        reporteDTO.setId(id);
        reporteDTO.setTipo((String) reporteInput.get("tipo"));

        if (reporteInput.containsKey("fechaGeneracion")) {
            reporteDTO.setFechaGeneracion(ZonedDateTime.parse((String) reporteInput.get("fechaGeneracion")));
        }

        reporteDTO.setRutaArchivo((String) reporteInput.get("rutaArchivo"));

        log.debug(
            "Reporte DTO procesado - ID: {}, Tipo: {}, FechaGeneracion: {}, RutaArchivo: {}",
            reporteDTO.getId(),
            reporteDTO.getTipo(),
            reporteDTO.getFechaGeneracion(),
            reporteDTO.getRutaArchivo()
        );

        return reporteService.update(reporteDTO);
    }

    @MutationMapping
    public Boolean deleteReporte(@Argument Long id) {
        log.debug("GraphQL mutation to delete Reporte : {}", id);
        reporteService.delete(id);
        return true;
    }
}
