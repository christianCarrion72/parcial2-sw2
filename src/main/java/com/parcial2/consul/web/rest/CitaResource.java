package com.parcial2.consul.web.rest;

import com.parcial2.consul.repository.CitaRepository;
import com.parcial2.consul.repository.PacienteRepository;
import com.parcial2.consul.service.CitaService;
import com.parcial2.consul.service.dto.CitaDTO;
import com.parcial2.consul.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.parcial2.consul.domain.Cita}.
 */
@RestController
@RequestMapping("/api/citas")
public class CitaResource {

    private static final Logger LOG = LoggerFactory.getLogger(CitaResource.class);

    private static final String ENTITY_NAME = "cita";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CitaService citaService;

    private final CitaRepository citaRepository;

    private final PacienteRepository pacienteRepository;

    public CitaResource(CitaService citaService, CitaRepository citaRepository, PacienteRepository pacienteRepository) {
        this.citaService = citaService;
        this.citaRepository = citaRepository;
        this.pacienteRepository = pacienteRepository;
    }

    /**
     * {@code POST  /citas} : Create a new cita.
     *
     * @param citaDTO the citaDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new citaDTO, or with status {@code 400 (Bad Request)} if the cita has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MEDICO') or hasRole('ROLE_PACIENTE')")
    public ResponseEntity<CitaDTO> createCita(@Valid @RequestBody CitaDTO citaDTO, Authentication authentication)
        throws URISyntaxException {
        LOG.debug("REST request to save Cita : {}", citaDTO);
        if (citaDTO.getId() != null) {
            throw new BadRequestAlertException("A new cita cannot already have an ID", ENTITY_NAME, "idexists");
        }

        // Si es paciente, verificar que la cita sea para él
        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_PACIENTE"))) {
            String currentUserLogin = authentication.getName();
            Long pacienteId = pacienteRepository
                .findByUserLogin(currentUserLogin)
                .map(paciente -> paciente.getId())
                .orElseThrow(() -> new BadRequestAlertException("Paciente not found for current user", ENTITY_NAME, "pacientenotfound"));

            if (!Objects.equals(citaDTO.getPaciente().getId(), pacienteId)) {
                throw new BadRequestAlertException("Patients can only create appointments for themselves", ENTITY_NAME, "unauthorized");
            }
        }

        citaDTO = citaService.save(citaDTO);
        return ResponseEntity.created(new URI("/api/citas/" + citaDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, citaDTO.getId().toString()))
            .body(citaDTO);
    }

    /**
     * {@code PUT  /citas/:id} : Updates an existing cita.
     *
     * @param id the id of the citaDTO to save.
     * @param citaDTO the citaDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated citaDTO,
     * or with status {@code 400 (Bad Request)} if the citaDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the citaDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MEDICO')")
    public ResponseEntity<CitaDTO> updateCita(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody CitaDTO citaDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Cita : {}, {}", id, citaDTO);
        if (citaDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, citaDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!citaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        citaDTO = citaService.update(citaDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, citaDTO.getId().toString()))
            .body(citaDTO);
    }

    /**
     * {@code PATCH  /citas/:id} : Partial updates given fields of an existing cita, field will ignore if it is null
     *
     * @param id the id of the citaDTO to save.
     * @param citaDTO the citaDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated citaDTO,
     * or with status {@code 400 (Bad Request)} if the citaDTO is not valid,
     * or with status {@code 404 (Not Found)} if the citaDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the citaDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MEDICO') or hasRole('ROLE_PACIENTE')")
    public ResponseEntity<CitaDTO> partialUpdateCita(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody CitaDTO citaDTO,
        Authentication authentication
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Cita partially : {}, {}", id, citaDTO);
        if (citaDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, citaDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!citaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CitaDTO> result;

        // Si es paciente, usar método restringido
        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_PACIENTE"))) {
            String currentUserLogin = authentication.getName();
            Long pacienteId = pacienteRepository
                .findByUserLogin(currentUserLogin)
                .map(paciente -> paciente.getId())
                .orElseThrow(() -> new BadRequestAlertException("Paciente not found for current user", ENTITY_NAME, "pacientenotfound"));

            result = citaService.partialUpdateForPaciente(citaDTO, pacienteId);
        } else {
            result = citaService.partialUpdate(citaDTO);
        }

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, citaDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /citas} : get all the citas.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of citas in body.
     */
    @GetMapping("")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MEDICO') or hasRole('ROLE_PACIENTE')")
    public ResponseEntity<List<CitaDTO>> getAllCitas(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload,
        Authentication authentication
    ) {
        LOG.debug("REST request to get a page of Citas");
        Page<CitaDTO> page;

        // Si es paciente, solo mostrar sus citas
        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_PACIENTE"))) {
            String currentUserLogin = authentication.getName();
            Long pacienteId = pacienteRepository
                .findByUserLogin(currentUserLogin)
                .map(paciente -> paciente.getId())
                .orElseThrow(() -> new BadRequestAlertException("Paciente not found for current user", ENTITY_NAME, "pacientenotfound"));

            page = citaService.findByPacienteId(pacienteId, pageable);
        } else {
            if (eagerload) {
                page = citaService.findAllWithEagerRelationships(pageable);
            } else {
                page = citaService.findAll(pageable);
            }
        }

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /citas/:id} : get the "id" cita.
     *
     * @param id the id of the citaDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the citaDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MEDICO') or hasRole('ROLE_PACIENTE')")
    public ResponseEntity<CitaDTO> getCita(@PathVariable("id") Long id, Authentication authentication) {
        LOG.debug("REST request to get Cita : {}", id);

        Optional<CitaDTO> citaDTO;

        // Si es paciente, verificar que la cita le pertenezca
        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_PACIENTE"))) {
            String currentUserLogin = authentication.getName();
            Long pacienteId = pacienteRepository
                .findByUserLogin(currentUserLogin)
                .map(paciente -> paciente.getId())
                .orElseThrow(() -> new BadRequestAlertException("Paciente not found for current user", ENTITY_NAME, "pacientenotfound"));

            citaDTO = citaService.findOneByPacienteId(id, pacienteId);
        } else {
            citaDTO = citaService.findOne(id);
        }

        return ResponseUtil.wrapOrNotFound(citaDTO);
    }

    /**
     * {@code DELETE  /citas/:id} : delete the "id" cita.
     *
     * @param id the id of the citaDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MEDICO')")
    public ResponseEntity<Void> deleteCita(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Cita : {}", id);
        citaService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
