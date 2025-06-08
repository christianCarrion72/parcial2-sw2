package com.parcial2.consul.web.rest;

import com.parcial2.consul.repository.HorarioAtencionRepository;
import com.parcial2.consul.service.HorarioAtencionService;
import com.parcial2.consul.service.dto.HorarioAtencionDTO;
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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.parcial2.consul.domain.HorarioAtencion}.
 */
@RestController
@RequestMapping("/api/horario-atencions")
public class HorarioAtencionResource {

    private static final Logger LOG = LoggerFactory.getLogger(HorarioAtencionResource.class);

    private static final String ENTITY_NAME = "horarioAtencion";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HorarioAtencionService horarioAtencionService;

    private final HorarioAtencionRepository horarioAtencionRepository;

    public HorarioAtencionResource(HorarioAtencionService horarioAtencionService, HorarioAtencionRepository horarioAtencionRepository) {
        this.horarioAtencionService = horarioAtencionService;
        this.horarioAtencionRepository = horarioAtencionRepository;
    }

    /**
     * {@code POST  /horario-atencions} : Create a new horarioAtencion.
     *
     * @param horarioAtencionDTO the horarioAtencionDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new horarioAtencionDTO, or with status {@code 400 (Bad Request)} if the horarioAtencion has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<HorarioAtencionDTO> createHorarioAtencion(@Valid @RequestBody HorarioAtencionDTO horarioAtencionDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save HorarioAtencion : {}", horarioAtencionDTO);
        if (horarioAtencionDTO.getId() != null) {
            throw new BadRequestAlertException("A new horarioAtencion cannot already have an ID", ENTITY_NAME, "idexists");
        }
        horarioAtencionDTO = horarioAtencionService.save(horarioAtencionDTO);
        return ResponseEntity.created(new URI("/api/horario-atencions/" + horarioAtencionDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, horarioAtencionDTO.getId().toString()))
            .body(horarioAtencionDTO);
    }

    /**
     * {@code PUT  /horario-atencions/:id} : Updates an existing horarioAtencion.
     *
     * @param id the id of the horarioAtencionDTO to save.
     * @param horarioAtencionDTO the horarioAtencionDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated horarioAtencionDTO,
     * or with status {@code 400 (Bad Request)} if the horarioAtencionDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the horarioAtencionDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<HorarioAtencionDTO> updateHorarioAtencion(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody HorarioAtencionDTO horarioAtencionDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update HorarioAtencion : {}, {}", id, horarioAtencionDTO);
        if (horarioAtencionDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, horarioAtencionDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!horarioAtencionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        horarioAtencionDTO = horarioAtencionService.update(horarioAtencionDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, horarioAtencionDTO.getId().toString()))
            .body(horarioAtencionDTO);
    }

    /**
     * {@code PATCH  /horario-atencions/:id} : Partial updates given fields of an existing horarioAtencion, field will ignore if it is null
     *
     * @param id the id of the horarioAtencionDTO to save.
     * @param horarioAtencionDTO the horarioAtencionDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated horarioAtencionDTO,
     * or with status {@code 400 (Bad Request)} if the horarioAtencionDTO is not valid,
     * or with status {@code 404 (Not Found)} if the horarioAtencionDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the horarioAtencionDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<HorarioAtencionDTO> partialUpdateHorarioAtencion(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody HorarioAtencionDTO horarioAtencionDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update HorarioAtencion partially : {}, {}", id, horarioAtencionDTO);
        if (horarioAtencionDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, horarioAtencionDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!horarioAtencionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<HorarioAtencionDTO> result = horarioAtencionService.partialUpdate(horarioAtencionDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, horarioAtencionDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /horario-atencions} : get all the horarioAtencions.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of horarioAtencions in body.
     */
    @GetMapping("")
    public ResponseEntity<List<HorarioAtencionDTO>> getAllHorarioAtencions(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get a page of HorarioAtencions");
        Page<HorarioAtencionDTO> page;
        if (eagerload) {
            page = horarioAtencionService.findAllWithEagerRelationships(pageable);
        } else {
            page = horarioAtencionService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /horario-atencions/:id} : get the "id" horarioAtencion.
     *
     * @param id the id of the horarioAtencionDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the horarioAtencionDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<HorarioAtencionDTO> getHorarioAtencion(@PathVariable("id") Long id) {
        LOG.debug("REST request to get HorarioAtencion : {}", id);
        Optional<HorarioAtencionDTO> horarioAtencionDTO = horarioAtencionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(horarioAtencionDTO);
    }

    /**
     * {@code DELETE  /horario-atencions/:id} : delete the "id" horarioAtencion.
     *
     * @param id the id of the horarioAtencionDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHorarioAtencion(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete HorarioAtencion : {}", id);
        horarioAtencionService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
