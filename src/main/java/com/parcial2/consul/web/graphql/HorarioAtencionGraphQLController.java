package com.parcial2.consul.web.graphql;

import com.parcial2.consul.repository.HorarioAtencionRepository;
import com.parcial2.consul.repository.MedicoRepository;
import com.parcial2.consul.service.HorarioAtencionService;
import com.parcial2.consul.service.MedicoService;
import com.parcial2.consul.service.dto.HorarioAtencionDTO;
import com.parcial2.consul.service.dto.MedicoDTO;
import com.parcial2.consul.web.rest.errors.BadRequestAlertException;
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
public class HorarioAtencionGraphQLController {

    private final Logger log = LoggerFactory.getLogger(HorarioAtencionGraphQLController.class);

    private final HorarioAtencionService horarioAtencionService;
    private final HorarioAtencionRepository horarioAtencionRepository;
    private final MedicoService medicoService;
    private final MedicoRepository medicoRepository;

    public HorarioAtencionGraphQLController(
        HorarioAtencionService horarioAtencionService,
        HorarioAtencionRepository horarioAtencionRepository,
        MedicoService medicoService,
        MedicoRepository medicoRepository
    ) {
        this.horarioAtencionService = horarioAtencionService;
        this.horarioAtencionRepository = horarioAtencionRepository;
        this.medicoService = medicoService;
        this.medicoRepository = medicoRepository;
    }

    @QueryMapping
    public HorarioAtencionDTO getHorarioAtencionById(@Argument Long id) {
        log.debug("GraphQL query to get HorarioAtencion : {}", id);
        return horarioAtencionService.findOne(id).orElse(null);
    }

    @QueryMapping
    public List<HorarioAtencionDTO> getAllHorariosAtencion(
        @Argument Integer page,
        @Argument Integer size,
        @Argument String sort,
        @Argument Boolean eagerload
    ) {
        log.debug("GraphQL query to get all HorariosAtencion with sort: {}", sort);

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

        Page<HorarioAtencionDTO> horarioPage;
        if (eager) {
            horarioPage = horarioAtencionService.findAllWithEagerRelationships(pageRequest);
        } else {
            horarioPage = horarioAtencionService.findAll(pageRequest);
        }

        return horarioPage.getContent();
    }

    @MutationMapping
    public HorarioAtencionDTO createHorarioAtencion(@Argument("horarioInput") Map<String, Object> horarioInput) {
        log.debug("GraphQL mutation to create HorarioAtencion : {}", horarioInput);

        HorarioAtencionDTO horarioAtencionDTO = new HorarioAtencionDTO();
        horarioAtencionDTO.setDiaSemana((String) horarioInput.get("diaSemana"));
        horarioAtencionDTO.setHoraInicio((String) horarioInput.get("horaInicio"));
        horarioAtencionDTO.setHoraFin((String) horarioInput.get("horaFin"));

        // Procesar medicoId
        if (horarioInput.containsKey("medicoId")) {
            Long medicoId = Long.valueOf(horarioInput.get("medicoId").toString());
            MedicoDTO medicoDTO = medicoService
                .findOne(medicoId)
                .orElseThrow(() -> new BadRequestAlertException("Médico no encontrado", "horarioAtencion", "medicoNotFound"));
            horarioAtencionDTO.setMedico(medicoDTO);
        }

        return horarioAtencionService.save(horarioAtencionDTO);
    }

    @MutationMapping
    public HorarioAtencionDTO updateHorarioAtencion(@Argument Long id, @Argument("horarioInput") Map<String, Object> horarioInput) {
        log.debug("GraphQL mutation to update HorarioAtencion : {}, {}", id, horarioInput);

        HorarioAtencionDTO horarioAtencionDTO = new HorarioAtencionDTO();
        horarioAtencionDTO.setId(id);
        horarioAtencionDTO.setDiaSemana((String) horarioInput.get("diaSemana"));
        horarioAtencionDTO.setHoraInicio((String) horarioInput.get("horaInicio"));
        horarioAtencionDTO.setHoraFin((String) horarioInput.get("horaFin"));

        // Procesar medicoId
        if (horarioInput.containsKey("medicoId")) {
            Long medicoId = Long.valueOf(horarioInput.get("medicoId").toString());
            MedicoDTO medicoDTO = medicoService
                .findOne(medicoId)
                .orElseThrow(() -> new BadRequestAlertException("Médico no encontrado", "horarioAtencion", "medicoNotFound"));
            horarioAtencionDTO.setMedico(medicoDTO);
        }

        log.debug(
            "HorarioAtencion DTO procesado - ID: {}, DiaSemana: {}, HoraInicio: {}, HoraFin: {}, Medico: {}",
            horarioAtencionDTO.getId(),
            horarioAtencionDTO.getDiaSemana(),
            horarioAtencionDTO.getHoraInicio(),
            horarioAtencionDTO.getHoraFin(),
            horarioAtencionDTO.getMedico()
        );

        return horarioAtencionService.update(horarioAtencionDTO);
    }

    @MutationMapping
    public Boolean deleteHorarioAtencion(@Argument Long id) {
        log.debug("GraphQL mutation to delete HorarioAtencion : {}", id);
        horarioAtencionService.delete(id);
        return true;
    }
}
