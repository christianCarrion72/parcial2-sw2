package com.parcial2.consul.web.graphql;

import com.parcial2.consul.repository.PacienteRepository;
import com.parcial2.consul.repository.UserRepository;
import com.parcial2.consul.service.PacienteService;
import com.parcial2.consul.service.UserService;
import com.parcial2.consul.service.dto.PacienteDTO;
import com.parcial2.consul.service.dto.UserDTO;
import com.parcial2.consul.web.rest.errors.BadRequestAlertException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
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
public class PacienteGraphQLController {

    private final Logger log = LoggerFactory.getLogger(PacienteGraphQLController.class);

    private final PacienteService pacienteService;
    private final PacienteRepository pacienteRepository;
    private final UserService userService;
    private final UserRepository userRepository;

    public PacienteGraphQLController(
        PacienteService pacienteService,
        PacienteRepository pacienteRepository,
        UserService userService,
        UserRepository userRepository
    ) {
        this.pacienteService = pacienteService;
        this.pacienteRepository = pacienteRepository;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @QueryMapping
    public PacienteDTO getPacienteById(@Argument Long id) {
        log.debug("GraphQL query to get Paciente : {}", id);
        return pacienteService.findOne(id).orElse(null);
    }

    @QueryMapping
    public List<PacienteDTO> getAllPacientes(
        @Argument Integer page,
        @Argument Integer size,
        @Argument String sort,
        @Argument Boolean eagerload
    ) {
        log.debug("GraphQL query to get all Pacientes with sort: {}", sort);

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

        Page<PacienteDTO> pacientePage;
        if (eager) {
            pacientePage = pacienteService.findAllWithEagerRelationships(pageRequest);
        } else {
            pacientePage = pacienteService.findAll(pageRequest);
        }

        return pacientePage.getContent();
    }

    @MutationMapping
    public PacienteDTO createPaciente(@Argument("pacienteInput") Map<String, Object> pacienteInput) {
        log.debug("GraphQL mutation to create Paciente : {}", pacienteInput);

        PacienteDTO pacienteDTO = new PacienteDTO();
        pacienteDTO.setNroHistoriaClinica((String) pacienteInput.get("nroHistoriaClinica"));
        pacienteDTO.setDireccion((String) pacienteInput.get("direccion"));
        pacienteDTO.setTelefono((String) pacienteInput.get("telefono"));

        // Procesar fecha de nacimiento
        if (pacienteInput.containsKey("fechaNacimiento") && pacienteInput.get("fechaNacimiento") != null) {
            try {
                String fechaStr = (String) pacienteInput.get("fechaNacimiento");
                LocalDate fecha = LocalDate.parse(fechaStr);
                pacienteDTO.setFechaNacimiento(fecha);
            } catch (DateTimeParseException e) {
                throw new BadRequestAlertException("Formato de fecha inválido", "paciente", "fechaInvalida");
            }
        }

        // Procesar userId
        if (pacienteInput.containsKey("userId")) {
            Long userId = Long.valueOf(pacienteInput.get("userId").toString());
            UserDTO userDTO = userRepository
                .findById(userId)
                .map(user -> new UserDTO(user))
                .orElseThrow(() -> new BadRequestAlertException("Usuario no encontrado", "paciente", "userNotFound"));
            pacienteDTO.setUser(userDTO);
        }

        return pacienteService.save(pacienteDTO);
    }

    @MutationMapping
    public PacienteDTO updatePaciente(@Argument Long id, @Argument("pacienteInput") Map<String, Object> pacienteInput) {
        log.debug("GraphQL mutation to update Paciente : {}, {}", id, pacienteInput);

        // Crear el DTO a partir del input
        PacienteDTO pacienteDTO = new PacienteDTO();
        pacienteDTO.setId(id);
        pacienteDTO.setNroHistoriaClinica((String) pacienteInput.get("nroHistoriaClinica"));
        pacienteDTO.setDireccion((String) pacienteInput.get("direccion"));
        pacienteDTO.setTelefono((String) pacienteInput.get("telefono"));

        // Procesar fecha de nacimiento
        if (pacienteInput.containsKey("fechaNacimiento") && pacienteInput.get("fechaNacimiento") != null) {
            try {
                String fechaStr = (String) pacienteInput.get("fechaNacimiento");
                LocalDate fecha = LocalDate.parse(fechaStr);
                pacienteDTO.setFechaNacimiento(fecha);
            } catch (DateTimeParseException e) {
                throw new BadRequestAlertException("Formato de fecha inválido", "paciente", "fechaInvalida");
            }
        }

        // Procesar userId y obtener datos completos del usuario
        if (pacienteInput.containsKey("userId")) {
            Long userId = Long.valueOf(pacienteInput.get("userId").toString());
            UserDTO userDTO = userRepository
                .findById(userId)
                .map(user -> new UserDTO(user))
                .orElseThrow(() -> new BadRequestAlertException("Usuario no encontrado", "paciente", "userNotFound"));
            pacienteDTO.setUser(userDTO);
        }

        log.debug(
            "Paciente DTO procesado - ID: {}, NroHistoriaClinica: {}, FechaNacimiento: {}, Direccion: {}, Telefono: {}, User: {}",
            pacienteDTO.getId(),
            pacienteDTO.getNroHistoriaClinica(),
            pacienteDTO.getFechaNacimiento(),
            pacienteDTO.getDireccion(),
            pacienteDTO.getTelefono(),
            pacienteDTO.getUser()
        );

        return pacienteService.update(pacienteDTO);
    }

    @MutationMapping
    public Boolean deletePaciente(@Argument Long id) {
        log.debug("GraphQL mutation to delete Paciente : {}", id);
        pacienteService.delete(id);
        return true;
    }
}
