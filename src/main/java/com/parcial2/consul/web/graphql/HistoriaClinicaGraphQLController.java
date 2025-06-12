package com.parcial2.consul.web.graphql;

import com.parcial2.consul.repository.HistoriaClinicaRepository;
import com.parcial2.consul.repository.PacienteRepository;
import com.parcial2.consul.service.HistoriaClinicaService;
import com.parcial2.consul.service.PacienteService;
import com.parcial2.consul.service.dto.HistoriaClinicaDTO;
import com.parcial2.consul.service.dto.PacienteDTO;
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
public class HistoriaClinicaGraphQLController {

    private final Logger log = LoggerFactory.getLogger(HistoriaClinicaGraphQLController.class);

    private final HistoriaClinicaService historiaClinicaService;
    private final HistoriaClinicaRepository historiaClinicaRepository;
    private final PacienteService pacienteService;
    private final PacienteRepository pacienteRepository;

    public HistoriaClinicaGraphQLController(
        HistoriaClinicaService historiaClinicaService,
        HistoriaClinicaRepository historiaClinicaRepository,
        PacienteService pacienteService,
        PacienteRepository pacienteRepository
    ) {
        this.historiaClinicaService = historiaClinicaService;
        this.historiaClinicaRepository = historiaClinicaRepository;
        this.pacienteService = pacienteService;
        this.pacienteRepository = pacienteRepository;
    }

    @QueryMapping
    public HistoriaClinicaDTO getHistoriaClinicaById(@Argument Long id) {
        log.debug("GraphQL query to get HistoriaClinica : {}", id);
        return historiaClinicaService.findOne(id).orElse(null);
    }

    @QueryMapping
    public List<HistoriaClinicaDTO> getAllHistoriasClinicas(
        @Argument Integer page,
        @Argument Integer size,
        @Argument String sort,
        @Argument Boolean eagerload
    ) {
        log.debug("GraphQL query to get all HistoriasClinicas with sort: {}", sort);

        int pageNumber = (page != null) ? page : 0;
        int pageSize = (size != null) ? size : 20;
        boolean eager = (eagerload != null) ? eagerload : true;

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

        Page<HistoriaClinicaDTO> historiaPage;
        if (eager) {
            historiaPage = historiaClinicaService.findAllWithEagerRelationships(pageRequest);
        } else {
            historiaPage = historiaClinicaService.findAll(pageRequest);
        }

        return historiaPage.getContent();
    }

    @MutationMapping
    public HistoriaClinicaDTO createHistoriaClinica(@Argument("historiaInput") Map<String, Object> historiaInput) {
        log.debug("GraphQL mutation to create HistoriaClinica : {}", historiaInput);

        HistoriaClinicaDTO historiaClinicaDTO = new HistoriaClinicaDTO();

        if (historiaInput.containsKey("fecha")) {
            historiaClinicaDTO.setFecha(ZonedDateTime.parse((String) historiaInput.get("fecha")));
        }

        historiaClinicaDTO.setSintomas((String) historiaInput.get("sintomas"));
        historiaClinicaDTO.setDiagnostico((String) historiaInput.get("diagnostico"));
        historiaClinicaDTO.setTratamiento((String) historiaInput.get("tratamiento"));
        historiaClinicaDTO.setHashBlockchain((String) historiaInput.get("hashBlockchain"));

        // Procesar pacienteId
        if (historiaInput.containsKey("pacienteId")) {
            Long pacienteId = Long.valueOf(historiaInput.get("pacienteId").toString());
            PacienteDTO pacienteDTO = pacienteService
                .findOne(pacienteId)
                .orElseThrow(() -> new BadRequestAlertException("Paciente no encontrado", "historiaClinica", "pacienteNotFound"));
            historiaClinicaDTO.setPaciente(pacienteDTO);
        }

        return historiaClinicaService.save(historiaClinicaDTO);
    }

    @MutationMapping
    public HistoriaClinicaDTO updateHistoriaClinica(@Argument Long id, @Argument("historiaInput") Map<String, Object> historiaInput) {
        log.debug("GraphQL mutation to update HistoriaClinica : {}, {}", id, historiaInput);

        HistoriaClinicaDTO historiaClinicaDTO = new HistoriaClinicaDTO();
        historiaClinicaDTO.setId(id);

        if (historiaInput.containsKey("fecha")) {
            historiaClinicaDTO.setFecha(ZonedDateTime.parse((String) historiaInput.get("fecha")));
        }

        historiaClinicaDTO.setSintomas((String) historiaInput.get("sintomas"));
        historiaClinicaDTO.setDiagnostico((String) historiaInput.get("diagnostico"));
        historiaClinicaDTO.setTratamiento((String) historiaInput.get("tratamiento"));
        historiaClinicaDTO.setHashBlockchain((String) historiaInput.get("hashBlockchain"));

        // Procesar pacienteId
        if (historiaInput.containsKey("pacienteId")) {
            Long pacienteId = Long.valueOf(historiaInput.get("pacienteId").toString());
            PacienteDTO pacienteDTO = pacienteService
                .findOne(pacienteId)
                .orElseThrow(() -> new BadRequestAlertException("Paciente no encontrado", "historiaClinica", "pacienteNotFound"));
            historiaClinicaDTO.setPaciente(pacienteDTO);
        }

        log.debug(
            "HistoriaClinica DTO procesada - ID: {}, Fecha: {}, Sintomas: {}, Diagnostico: {}, Tratamiento: {}, Paciente: {}",
            historiaClinicaDTO.getId(),
            historiaClinicaDTO.getFecha(),
            historiaClinicaDTO.getSintomas(),
            historiaClinicaDTO.getDiagnostico(),
            historiaClinicaDTO.getTratamiento(),
            historiaClinicaDTO.getPaciente()
        );

        return historiaClinicaService.update(historiaClinicaDTO);
    }

    @MutationMapping
    public Boolean deleteHistoriaClinica(@Argument Long id) {
        log.debug("GraphQL mutation to delete HistoriaClinica : {}", id);
        historiaClinicaService.delete(id);
        return true;
    }
}
