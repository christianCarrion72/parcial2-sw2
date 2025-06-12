package com.parcial2.consul.web.graphql;

import com.parcial2.consul.repository.EspecialidadRepository;
import com.parcial2.consul.service.EspecialidadService;
import com.parcial2.consul.service.MedicoService;
import com.parcial2.consul.service.dto.EspecialidadDTO;
import com.parcial2.consul.service.dto.MedicoDTO;
import com.parcial2.consul.web.rest.errors.BadRequestAlertException;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
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
public class EspecialidadGraphQLController {

    private final Logger log = LoggerFactory.getLogger(EspecialidadGraphQLController.class);

    private final EspecialidadService especialidadService;
    private final EspecialidadRepository especialidadRepository;
    private final MedicoService medicoService;

    public EspecialidadGraphQLController(
        EspecialidadService especialidadService,
        EspecialidadRepository especialidadRepository,
        MedicoService medicoService
    ) {
        this.especialidadService = especialidadService;
        this.especialidadRepository = especialidadRepository;
        this.medicoService = medicoService;
    }

    @QueryMapping
    public EspecialidadDTO getEspecialidadById(@Argument Long id) {
        log.debug("GraphQL query to get Especialidad : {}", id);
        return especialidadService.findOne(id).orElse(null);
    }

    @QueryMapping
    public List<EspecialidadDTO> getAllEspecialidades(@Argument Integer page, @Argument Integer size, @Argument String sort) {
        log.debug("GraphQL query to get all Especialidades with sort: {}", sort);

        int pageNumber = (page != null) ? page : 0;
        int pageSize = (size != null) ? size : 20;

        PageRequest pageRequest;
        if (sort != null && !sort.isEmpty()) {
            String[] sortParts = sort.split(",");
            String property = sortParts[0];
            Sort.Direction direction = sortParts.length > 1 && sortParts[1].equalsIgnoreCase("desc")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;
            pageRequest = PageRequest.of(pageNumber, pageSize, Sort.by(direction, property));
        } else {
            pageRequest = PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.ASC, "id"));
        }

        Page<EspecialidadDTO> especialidadPage = especialidadService.findAll(pageRequest);

        // Procesar cada especialidad para asegurar datos completos de médicos
        List<EspecialidadDTO> especialidades = especialidadPage
            .getContent()
            .stream()
            .map(especialidad -> {
                if (especialidad.getMedicos() != null) {
                    Set<MedicoDTO> medicosCompletos = especialidad
                        .getMedicos()
                        .stream()
                        .map(medico ->
                            medicoService
                                .findOne(medico.getId())
                                .map(medicoCompleto -> {
                                    if (medicoCompleto.getMatricula() == null) {
                                        medicoCompleto.setMatricula("Sin matrícula");
                                    }
                                    return medicoCompleto;
                                })
                                .orElse(null)
                        )
                        .filter(med -> med != null)
                        .collect(Collectors.toSet());
                    especialidad.setMedicos(medicosCompletos);
                }
                return especialidad;
            })
            .collect(Collectors.toList());

        return especialidades;
    }

    @MutationMapping
    public EspecialidadDTO createEspecialidad(@Argument("especialidadInput") Map<String, Object> especialidadInput) {
        log.debug("GraphQL mutation to create Especialidad : {}", especialidadInput);

        EspecialidadDTO especialidadDTO = new EspecialidadDTO();
        especialidadDTO.setNombre((String) especialidadInput.get("nombre"));
        especialidadDTO.setDescripcion((String) especialidadInput.get("descripcion"));

        // Procesar medicosIds con más logging
        if (especialidadInput.containsKey("medicosIds")) {
            Object medIds = especialidadInput.get("medicosIds");
            Set<MedicoDTO> medicos = new HashSet<>();
            log.debug("Procesando medicosIds: {}", medIds);

            if (medIds instanceof List) {
                List<?> medicosIdsList = (List<?>) medIds;
                log.debug("Lista de IDs de médicos: {}", medicosIdsList);

                for (Object medId : medicosIdsList) {
                    Long medicoId = Long.valueOf(medId.toString());
                    log.debug("Buscando médico con ID: {}", medicoId);

                    MedicoDTO medicoDTO = medicoService
                        .findOne(medicoId)
                        .orElseThrow(() ->
                            new BadRequestAlertException("Medico no encontrado: " + medicoId, "especialidad", "medicoNotFound")
                        );
                    log.debug("Médico encontrado: {}", medicoDTO);
                    medicos.add(medicoDTO);
                }
            }

            log.debug("Médicos procesados: {}", medicos);
            especialidadDTO.setMedicos(medicos);
        }

        log.debug("Guardando especialidad: {}", especialidadDTO);
        return especialidadService.save(especialidadDTO);
    }

    @MutationMapping
    public EspecialidadDTO updateEspecialidad(@Argument Long id, @Argument("especialidadInput") Map<String, Object> especialidadInput) {
        log.debug("GraphQL mutation to update Especialidad : {}, {}", id, especialidadInput);

        // Crear el DTO a partir del input
        EspecialidadDTO especialidadDTO = new EspecialidadDTO();
        especialidadDTO.setId(id);
        especialidadDTO.setNombre((String) especialidadInput.get("nombre"));
        especialidadDTO.setDescripcion((String) especialidadInput.get("descripcion"));

        // Procesar medicosIds y obtener datos completos de medicos
        if (especialidadInput.containsKey("medicosIds")) {
            Object medIds = especialidadInput.get("medicosIds");
            Set<MedicoDTO> medicos = new HashSet<>();

            if (medIds instanceof List) {
                for (Object medId : (List<?>) medIds) {
                    Long medicoId = Long.valueOf(medId.toString());
                    MedicoDTO medicoDTO = medicoService
                        .findOne(medicoId)
                        .orElseThrow(() ->
                            new BadRequestAlertException("Medico no encontrado: " + medicoId, "especialidad", "medicoNotFound")
                        );
                    medicos.add(medicoDTO);
                }
            } else if (medIds != null) {
                Long medicoId = Long.valueOf(medIds.toString());
                MedicoDTO medicoDTO = medicoService
                    .findOne(medicoId)
                    .orElseThrow(() -> new BadRequestAlertException("Medico no encontrado: " + medicoId, "especialidad", "medicoNotFound"));
                medicos.add(medicoDTO);
            }

            especialidadDTO.setMedicos(medicos);
        }

        log.debug(
            "Especialidad DTO procesado - ID: {}, Nombre: {}, Descripcion: {}, Medicos: {}",
            especialidadDTO.getId(),
            especialidadDTO.getNombre(),
            especialidadDTO.getDescripcion(),
            especialidadDTO.getMedicos()
        );

        return especialidadService.update(especialidadDTO);
    }

    @MutationMapping
    public Boolean deleteEspecialidad(@Argument Long id) {
        log.debug("GraphQL mutation to delete Especialidad : {}", id);
        especialidadService.delete(id);
        return true;
    }
}
