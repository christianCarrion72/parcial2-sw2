package com.parcial2.consul.web.rest;

import com.parcial2.consul.repository.HistoriaClinicaRepository;
import com.parcial2.consul.service.HistoriaClinicaService;
import com.parcial2.consul.service.dto.HistoriaClinicaDTO;
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
 * REST controller for managing {@link com.parcial2.consul.domain.HistoriaClinica}.
 */
@RestController
@RequestMapping("/api/historia-clinicas")
public class HistoriaClinicaResource {

    private static final Logger LOG = LoggerFactory.getLogger(HistoriaClinicaResource.class);

    private static final String ENTITY_NAME = "historiaClinica";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HistoriaClinicaService historiaClinicaService;

    private final HistoriaClinicaRepository historiaClinicaRepository;

    public HistoriaClinicaResource(HistoriaClinicaService historiaClinicaService, HistoriaClinicaRepository historiaClinicaRepository) {
        this.historiaClinicaService = historiaClinicaService;
        this.historiaClinicaRepository = historiaClinicaRepository;
    }

    /**
     * {@code POST  /historia-clinicas} : Create a new historiaClinica.
     *
     * @param historiaClinicaDTO the historiaClinicaDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new historiaClinicaDTO, or with status {@code 400 (Bad Request)} if the historiaClinica has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<HistoriaClinicaDTO> createHistoriaClinica(@Valid @RequestBody HistoriaClinicaDTO historiaClinicaDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save HistoriaClinica : {}", historiaClinicaDTO);
        if (historiaClinicaDTO.getId() != null) {
            throw new BadRequestAlertException("A new historiaClinica cannot already have an ID", ENTITY_NAME, "idexists");
        }
        historiaClinicaDTO = historiaClinicaService.save(historiaClinicaDTO);
        return ResponseEntity.created(new URI("/api/historia-clinicas/" + historiaClinicaDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, historiaClinicaDTO.getId().toString()))
            .body(historiaClinicaDTO);
    }

    /**
     * {@code PUT  /historia-clinicas/:id} : Updates an existing historiaClinica.
     *
     * @param id the id of the historiaClinicaDTO to save.
     * @param historiaClinicaDTO the historiaClinicaDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated historiaClinicaDTO,
     * or with status {@code 400 (Bad Request)} if the historiaClinicaDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the historiaClinicaDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<HistoriaClinicaDTO> updateHistoriaClinica(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody HistoriaClinicaDTO historiaClinicaDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update HistoriaClinica : {}, {}", id, historiaClinicaDTO);
        if (historiaClinicaDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, historiaClinicaDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!historiaClinicaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        historiaClinicaDTO = historiaClinicaService.update(historiaClinicaDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, historiaClinicaDTO.getId().toString()))
            .body(historiaClinicaDTO);
    }

    /**
     * {@code PATCH  /historia-clinicas/:id} : Partial updates given fields of an existing historiaClinica, field will ignore if it is null
     *
     * @param id the id of the historiaClinicaDTO to save.
     * @param historiaClinicaDTO the historiaClinicaDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated historiaClinicaDTO,
     * or with status {@code 400 (Bad Request)} if the historiaClinicaDTO is not valid,
     * or with status {@code 404 (Not Found)} if the historiaClinicaDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the historiaClinicaDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<HistoriaClinicaDTO> partialUpdateHistoriaClinica(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody HistoriaClinicaDTO historiaClinicaDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update HistoriaClinica partially : {}, {}", id, historiaClinicaDTO);
        if (historiaClinicaDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, historiaClinicaDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!historiaClinicaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<HistoriaClinicaDTO> result = historiaClinicaService.partialUpdate(historiaClinicaDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, historiaClinicaDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /historia-clinicas} : get all the historiaClinicas.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of historiaClinicas in body.
     */
    @GetMapping("")
    public ResponseEntity<List<HistoriaClinicaDTO>> getAllHistoriaClinicas(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get a page of HistoriaClinicas");
        Page<HistoriaClinicaDTO> page;
        if (eagerload) {
            page = historiaClinicaService.findAllWithEagerRelationships(pageable);
        } else {
            page = historiaClinicaService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /historia-clinicas/:id} : get the "id" historiaClinica.
     *
     * @param id the id of the historiaClinicaDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the historiaClinicaDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<HistoriaClinicaDTO> getHistoriaClinica(@PathVariable("id") Long id) {
        LOG.debug("REST request to get HistoriaClinica : {}", id);
        Optional<HistoriaClinicaDTO> historiaClinicaDTO = historiaClinicaService.findOne(id);
        return ResponseUtil.wrapOrNotFound(historiaClinicaDTO);
    }

    /**
     * {@code DELETE  /historia-clinicas/:id} : delete the "id" historiaClinica.
     *
     * @param id the id of the historiaClinicaDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHistoriaClinica(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete HistoriaClinica : {}", id);
        historiaClinicaService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
