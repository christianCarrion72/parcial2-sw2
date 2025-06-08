package com.parcial2.consul.service;

import com.parcial2.consul.domain.Cita;
import com.parcial2.consul.repository.CitaRepository;
import com.parcial2.consul.service.dto.CitaDTO;
import com.parcial2.consul.service.mapper.CitaMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.parcial2.consul.domain.Cita}.
 */
@Service
@Transactional
public class CitaService {

    private static final Logger LOG = LoggerFactory.getLogger(CitaService.class);

    private final CitaRepository citaRepository;

    private final CitaMapper citaMapper;

    public CitaService(CitaRepository citaRepository, CitaMapper citaMapper) {
        this.citaRepository = citaRepository;
        this.citaMapper = citaMapper;
    }

    /**
     * Save a cita.
     *
     * @param citaDTO the entity to save.
     * @return the persisted entity.
     */
    public CitaDTO save(CitaDTO citaDTO) {
        LOG.debug("Request to save Cita : {}", citaDTO);
        Cita cita = citaMapper.toEntity(citaDTO);
        cita = citaRepository.save(cita);
        return citaMapper.toDto(cita);
    }

    /**
     * Update a cita.
     *
     * @param citaDTO the entity to save.
     * @return the persisted entity.
     */
    public CitaDTO update(CitaDTO citaDTO) {
        LOG.debug("Request to update Cita : {}", citaDTO);
        Cita cita = citaMapper.toEntity(citaDTO);
        cita = citaRepository.save(cita);
        return citaMapper.toDto(cita);
    }

    /**
     * Partially update a cita.
     *
     * @param citaDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<CitaDTO> partialUpdate(CitaDTO citaDTO) {
        LOG.debug("Request to partially update Cita : {}", citaDTO);

        return citaRepository
            .findById(citaDTO.getId())
            .map(existingCita -> {
                citaMapper.partialUpdate(existingCita, citaDTO);

                return existingCita;
            })
            .map(citaRepository::save)
            .map(citaMapper::toDto);
    }

    /**
     * Get all the citas.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<CitaDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Citas");
        return citaRepository.findAll(pageable).map(citaMapper::toDto);
    }

    /**
     * Get all the citas with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<CitaDTO> findAllWithEagerRelationships(Pageable pageable) {
        return citaRepository.findAllWithEagerRelationships(pageable).map(citaMapper::toDto);
    }

    /**
     * Get one cita by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<CitaDTO> findOne(Long id) {
        LOG.debug("Request to get Cita : {}", id);
        return citaRepository.findOneWithEagerRelationships(id).map(citaMapper::toDto);
    }

    /**
     * Delete the cita by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Cita : {}", id);
        citaRepository.deleteById(id);
    }
}
