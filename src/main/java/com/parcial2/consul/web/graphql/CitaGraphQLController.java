package com.parcial2.consul.web.graphql;

import com.parcial2.consul.domain.enumeration.EstadoCita;
import com.parcial2.consul.repository.CitaRepository;
import com.parcial2.consul.repository.HorarioAtencionRepository;
import com.parcial2.consul.repository.MedicoRepository;
import com.parcial2.consul.repository.PacienteRepository;
import com.parcial2.consul.security.SecurityUtils;
import com.parcial2.consul.service.CitaService;
import com.parcial2.consul.service.HorarioAtencionService;
import com.parcial2.consul.service.MedicoService;
import com.parcial2.consul.service.PacienteService;
import com.parcial2.consul.service.dto.CitaDTO;
import com.parcial2.consul.service.dto.HorarioAtencionDTO;
import com.parcial2.consul.service.dto.MedicoDTO;
import com.parcial2.consul.service.dto.PacienteDTO;
import com.parcial2.consul.web.rest.errors.BadRequestAlertException;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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
public class CitaGraphQLController {

    private final Logger log = LoggerFactory.getLogger(CitaGraphQLController.class);

    private final CitaService citaService;
    private final CitaRepository citaRepository;
    private final PacienteService pacienteService;
    private final PacienteRepository pacienteRepository;
    private final MedicoService medicoService;
    private final MedicoRepository medicoRepository;
    private final HorarioAtencionService horarioAtencionService;
    private final HorarioAtencionRepository horarioAtencionRepository;

    public CitaGraphQLController(
        CitaService citaService,
        CitaRepository citaRepository,
        PacienteService pacienteService,
        PacienteRepository pacienteRepository,
        MedicoService medicoService,
        MedicoRepository medicoRepository,
        HorarioAtencionService horarioAtencionService,
        HorarioAtencionRepository horarioAtencionRepository
    ) {
        this.citaService = citaService;
        this.citaRepository = citaRepository;
        this.pacienteService = pacienteService;
        this.pacienteRepository = pacienteRepository;
        this.medicoService = medicoService;
        this.medicoRepository = medicoRepository;
        this.horarioAtencionService = horarioAtencionService;
        this.horarioAtencionRepository = horarioAtencionRepository;
    }

    @QueryMapping
    public CitaDTO getCitaById(@Argument Long id) {
        log.debug("GraphQL query to get Cita : {}", id);
        return citaService.findOne(id).orElse(null);
    }

    @QueryMapping
    public List<CitaDTO> getAllCitas(@Argument Integer page, @Argument Integer size, @Argument String sort, @Argument Boolean eagerload) {
        log.debug("GraphQL query to get all Citas with sort: {}", sort);

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

        Page<CitaDTO> citaPage;

        // Verificar si el usuario actual es un paciente
        if (SecurityUtils.hasCurrentUserThisAuthority("ROLE_PACIENTE")) {
            // Si es paciente, filtrar solo sus citas
            Optional<String> currentUserLogin = SecurityUtils.getCurrentUserLogin();
            if (currentUserLogin.isPresent()) {
                Optional<Long> pacienteIdOpt = pacienteRepository.findByUserLogin(currentUserLogin.get()).map(paciente -> paciente.getId());

                if (pacienteIdOpt.isPresent()) {
                    Long pacienteId = pacienteIdOpt.get();
                    log.debug("Filtering citas for patient ID: {}", pacienteId);

                    if (eager) {
                        citaPage = citaService.findByPacienteIdWithEagerRelationships(pacienteId, pageRequest);
                    } else {
                        citaPage = citaService.findByPacienteId(pacienteId, pageRequest);
                    }
                } else {
                    throw new BadRequestAlertException("Paciente no encontrado para el usuario actual", "cita", "pacienteNotFound");
                }
            } else {
                throw new BadRequestAlertException("Usuario no autenticado", "cita", "userNotAuthenticated");
            }
        } else {
            // Si no es paciente (admin o médico), mostrar todas las citas
            if (eager) {
                citaPage = citaService.findAllWithEagerRelationships(pageRequest);
            } else {
                citaPage = citaService.findAll(pageRequest);
            }
        }

        return citaPage.getContent();
    }

    @MutationMapping
    public CitaDTO createCita(@Argument("citaInput") Map<String, Object> citaInput) {
        log.debug("GraphQL mutation to create Cita : {}", citaInput);

        CitaDTO citaDTO = new CitaDTO();

        if (citaInput.containsKey("fechaHora")) {
            try {
                citaDTO.setFechaHora(ZonedDateTime.parse((String) citaInput.get("fechaHora")));
            } catch (Exception e) {
                log.error("Error al parsear la fecha: {}", e.getMessage());
                throw new BadRequestAlertException("Formato de fecha inválido", "cita", "fechaInvalida");
            }
        }

        if (citaInput.containsKey("estado")) {
            citaDTO.setEstado(EstadoCita.valueOf((String) citaInput.get("estado")));
        }

        if (citaInput.containsKey("confirmada")) {
            citaDTO.setConfirmada((Boolean) citaInput.get("confirmada"));
        }

        // Procesar pacienteId
        if (citaInput.containsKey("pacienteId")) {
            Long pacienteId = Long.valueOf(citaInput.get("pacienteId").toString());
            PacienteDTO pacienteDTO = pacienteService
                .findOne(pacienteId)
                .orElseThrow(() -> new BadRequestAlertException("Paciente no encontrado", "cita", "pacienteNotFound"));
            citaDTO.setPaciente(pacienteDTO);
        }

        // Procesar medicoId
        if (citaInput.containsKey("medicoId")) {
            Long medicoId = Long.valueOf(citaInput.get("medicoId").toString());
            MedicoDTO medicoDTO = medicoService
                .findOne(medicoId)
                .orElseThrow(() -> new BadRequestAlertException("Médico no encontrado", "cita", "medicoNotFound"));
            citaDTO.setMedico(medicoDTO);
        }

        // Procesar horarioId
        if (citaInput.containsKey("horarioId")) {
            Long horarioId = Long.valueOf(citaInput.get("horarioId").toString());
            HorarioAtencionDTO horarioDTO = horarioAtencionService
                .findOne(horarioId)
                .orElseThrow(() -> new BadRequestAlertException("Horario no encontrado", "cita", "horarioNotFound"));
            citaDTO.setHorario(horarioDTO);
        }

        return citaService.save(citaDTO);
    }

    @MutationMapping
    public CitaDTO updateCita(@Argument Long id, @Argument("citaInput") Map<String, Object> citaInput) {
        log.debug("GraphQL mutation to update Cita : {}, {}", id, citaInput);

        CitaDTO citaDTO = new CitaDTO();
        citaDTO.setId(id);

        if (citaInput.containsKey("fechaHora")) {
            try {
                citaDTO.setFechaHora(ZonedDateTime.parse((String) citaInput.get("fechaHora")));
            } catch (Exception e) {
                log.error("Error al parsear la fecha: {}", e.getMessage());
                throw new BadRequestAlertException("Formato de fecha inválido", "cita", "fechaInvalida");
            }
        }

        if (citaInput.containsKey("estado")) {
            citaDTO.setEstado(EstadoCita.valueOf((String) citaInput.get("estado")));
        }

        if (citaInput.containsKey("confirmada")) {
            citaDTO.setConfirmada((Boolean) citaInput.get("confirmada"));
        }

        // Procesar pacienteId
        if (citaInput.containsKey("pacienteId")) {
            Long pacienteId = Long.valueOf(citaInput.get("pacienteId").toString());
            PacienteDTO pacienteDTO = pacienteService
                .findOne(pacienteId)
                .orElseThrow(() -> new BadRequestAlertException("Paciente no encontrado", "cita", "pacienteNotFound"));
            citaDTO.setPaciente(pacienteDTO);
        }

        // Procesar medicoId
        if (citaInput.containsKey("medicoId")) {
            Long medicoId = Long.valueOf(citaInput.get("medicoId").toString());
            MedicoDTO medicoDTO = medicoService
                .findOne(medicoId)
                .orElseThrow(() -> new BadRequestAlertException("Médico no encontrado", "cita", "medicoNotFound"));
            citaDTO.setMedico(medicoDTO);
        }

        // Procesar horarioId
        if (citaInput.containsKey("horarioId")) {
            Long horarioId = Long.valueOf(citaInput.get("horarioId").toString());
            HorarioAtencionDTO horarioDTO = horarioAtencionService
                .findOne(horarioId)
                .orElseThrow(() -> new BadRequestAlertException("Horario no encontrado", "cita", "horarioNotFound"));
            citaDTO.setHorario(horarioDTO);
        }

        log.debug(
            "Cita DTO procesada - ID: {}, FechaHora: {}, Estado: {}, Confirmada: {}, Paciente: {}, Medico: {}, Horario: {}",
            citaDTO.getId(),
            citaDTO.getFechaHora(),
            citaDTO.getEstado(),
            citaDTO.getConfirmada(),
            citaDTO.getPaciente(),
            citaDTO.getMedico(),
            citaDTO.getHorario()
        );

        return citaService.update(citaDTO);
    }

    @MutationMapping
    public Boolean deleteCita(@Argument Long id) {
        log.debug("GraphQL mutation to delete Cita : {}", id);
        citaService.delete(id);
        return true;
    }
}
