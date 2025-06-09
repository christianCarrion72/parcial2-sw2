package com.parcial2.consul.web.graphql;

import com.parcial2.consul.domain.Medico;
import com.parcial2.consul.repository.MedicoRepository;
import com.parcial2.consul.repository.UserRepository;
import com.parcial2.consul.service.EspecialidadService;
import com.parcial2.consul.service.MedicoService;
import com.parcial2.consul.service.UserService;
import com.parcial2.consul.service.dto.EspecialidadDTO;
import com.parcial2.consul.service.dto.MedicoDTO;
import com.parcial2.consul.service.dto.UserDTO;
import com.parcial2.consul.web.rest.errors.BadRequestAlertException;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
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
public class MedicoGraphQLController {

    private final Logger log = LoggerFactory.getLogger(MedicoGraphQLController.class);

    private final MedicoService medicoService;
    private final MedicoRepository medicoRepository;
    private final UserService userService;
    private final EspecialidadService especialidadService;
    private final UserRepository userRepository;

    public MedicoGraphQLController(
        MedicoService medicoService,
        MedicoRepository medicoRepository,
        UserService userService,
        UserRepository userRepository,
        EspecialidadService especialidadService
    ) {
        this.medicoService = medicoService;
        this.medicoRepository = medicoRepository;
        this.userService = userService;
        this.userRepository = userRepository;
        this.especialidadService = especialidadService;
    }

    @QueryMapping
    public MedicoDTO getMedicoById(@Argument Long id) {
        log.debug("GraphQL query to get Medico : {}", id);
        return medicoService.findOne(id).orElse(null);
    }

    @QueryMapping
    public List<MedicoDTO> getAllMedicos(
        @Argument Integer page,
        @Argument Integer size,
        @Argument String sort,
        @Argument Boolean eagerload
    ) {
        log.debug("GraphQL query to get all Medicos with sort: {}", sort);

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

        Page<MedicoDTO> medicoPage;
        if (eager) {
            medicoPage = medicoService.findAllWithEagerRelationships(pageRequest);
        } else {
            medicoPage = medicoService.findAll(pageRequest);
        }

        return medicoPage.getContent();
    }

    @MutationMapping
    public MedicoDTO createMedico(@Argument("medicoInput") Map<String, Object> medicoInput) {
        log.debug("GraphQL mutation to create Medico : {}", medicoInput);

        MedicoDTO medicoDTO = new MedicoDTO();
        medicoDTO.setMatricula((String) medicoInput.get("matricula"));

        // Procesar userId
        if (medicoInput.containsKey("userId")) {
            Long userId = Long.valueOf(medicoInput.get("userId").toString());
            UserDTO userDTO = userRepository
                .findById(userId)
                .map(user -> new UserDTO(user))
                .orElseThrow(() -> new BadRequestAlertException("Usuario no encontrado", "medico", "userNotFound"));
            medicoDTO.setUser(userDTO);
        }

        // Procesar especialidadesIds
        if (medicoInput.containsKey("especialidadesIds")) {
            Object espIds = medicoInput.get("especialidadesIds");
            Set<EspecialidadDTO> especialidades = new HashSet<>();

            if (espIds instanceof List) {
                for (Object espId : (List<?>) espIds) {
                    Long especialidadId = Long.valueOf(espId.toString());
                    EspecialidadDTO especialidadDTO = especialidadService
                        .findOne(especialidadId)
                        .orElseThrow(() ->
                            new BadRequestAlertException("Especialidad no encontrada: " + especialidadId, "medico", "especialidadNotFound")
                        );
                    especialidades.add(especialidadDTO);
                }
            }

            medicoDTO.setEspecialidades(especialidades);
        }

        return medicoService.save(medicoDTO);
    }

    @MutationMapping
    public MedicoDTO updateMedico(@Argument Long id, @Argument("medicoInput") Map<String, Object> medicoInput) {
        log.debug("GraphQL mutation to update Medico : {}, {}", id, medicoInput);

        // Crear el DTO a partir del input
        MedicoDTO medicoDTO = new MedicoDTO();
        medicoDTO.setId(id);
        medicoDTO.setMatricula((String) medicoInput.get("matricula"));

        // Procesar userId y obtener datos completos del usuario
        if (medicoInput.containsKey("userId")) {
            Long userId = Long.valueOf(medicoInput.get("userId").toString());
            UserDTO userDTO = userRepository
                .findById(userId)
                .map(user -> new UserDTO(user))
                .orElseThrow(() -> new BadRequestAlertException("Usuario no encontrado", "medico", "userNotFound"));
            medicoDTO.setUser(userDTO);
        }

        // Procesar especialidadesIds y obtener datos completos de especialidades
        if (medicoInput.containsKey("especialidadesIds")) {
            Object espIds = medicoInput.get("especialidadesIds");
            Set<EspecialidadDTO> especialidades = new HashSet<>();

            if (espIds instanceof List) {
                for (Object espId : (List<?>) espIds) {
                    Long especialidadId = Long.valueOf(espId.toString());
                    EspecialidadDTO especialidadDTO = especialidadService
                        .findOne(especialidadId)
                        .orElseThrow(() ->
                            new BadRequestAlertException("Especialidad no encontrada: " + especialidadId, "medico", "especialidadNotFound")
                        );
                    especialidades.add(especialidadDTO);
                }
            } else if (espIds != null) {
                Long especialidadId = Long.valueOf(espIds.toString());
                EspecialidadDTO especialidadDTO = especialidadService
                    .findOne(especialidadId)
                    .orElseThrow(() ->
                        new BadRequestAlertException("Especialidad no encontrada: " + especialidadId, "medico", "especialidadNotFound")
                    );
                especialidades.add(especialidadDTO);
            }

            medicoDTO.setEspecialidades(especialidades);
        }

        log.debug(
            "Medico DTO procesado - ID: {}, Matricula: {}, User: {}, Especialidades: {}",
            medicoDTO.getId(),
            medicoDTO.getMatricula(),
            medicoDTO.getUser(),
            medicoDTO.getEspecialidades()
        );

        return medicoService.update(medicoDTO);
    }

    @MutationMapping
    public Boolean deleteMedico(@Argument Long id) {
        log.debug("GraphQL mutation to delete Medico : {}", id);
        medicoService.delete(id);
        return true;
    }
}
