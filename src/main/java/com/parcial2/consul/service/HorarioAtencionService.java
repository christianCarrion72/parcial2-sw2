package com.parcial2.consul.service;

import com.parcial2.consul.domain.HorarioAtencion;
import com.parcial2.consul.repository.HorarioAtencionRepository;
import com.parcial2.consul.service.dto.HorarioAtencionDTO;
import com.parcial2.consul.service.mapper.HorarioAtencionMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.parcial2.consul.domain.HorarioAtencion}.
 */
@Service
@Transactional
public class HorarioAtencionService {

    private static final Logger LOG = LoggerFactory.getLogger(HorarioAtencionService.class);

    private final HorarioAtencionRepository horarioAtencionRepository;

    private final HorarioAtencionMapper horarioAtencionMapper;

    public HorarioAtencionService(HorarioAtencionRepository horarioAtencionRepository, HorarioAtencionMapper horarioAtencionMapper) {
        this.horarioAtencionRepository = horarioAtencionRepository;
        this.horarioAtencionMapper = horarioAtencionMapper;
    }

    /**
     * Save a horarioAtencion.
     *
     * @param horarioAtencionDTO the entity to save.
     * @return the persisted entity.
     */
    public HorarioAtencionDTO save(HorarioAtencionDTO horarioAtencionDTO) {
        LOG.debug("Request to save HorarioAtencion : {}", horarioAtencionDTO);
        HorarioAtencion horarioAtencion = horarioAtencionMapper.toEntity(horarioAtencionDTO);
        horarioAtencion = horarioAtencionRepository.save(horarioAtencion);
        return horarioAtencionMapper.toDto(horarioAtencion);
    }

    /**
     * Update a horarioAtencion.
     *
     * @param horarioAtencionDTO the entity to save.
     * @return the persisted entity.
     */
    public HorarioAtencionDTO update(HorarioAtencionDTO horarioAtencionDTO) {
        LOG.debug("Request to update HorarioAtencion : {}", horarioAtencionDTO);
        HorarioAtencion horarioAtencion = horarioAtencionMapper.toEntity(horarioAtencionDTO);
        horarioAtencion = horarioAtencionRepository.save(horarioAtencion);
        return horarioAtencionMapper.toDto(horarioAtencion);
    }

    /**
     * Partially update a horarioAtencion.
     *
     * @param horarioAtencionDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<HorarioAtencionDTO> partialUpdate(HorarioAtencionDTO horarioAtencionDTO) {
        LOG.debug("Request to partially update HorarioAtencion : {}", horarioAtencionDTO);

        return horarioAtencionRepository
            .findById(horarioAtencionDTO.getId())
            .map(existingHorarioAtencion -> {
                horarioAtencionMapper.partialUpdate(existingHorarioAtencion, horarioAtencionDTO);

                return existingHorarioAtencion;
            })
            .map(horarioAtencionRepository::save)
            .map(horarioAtencionMapper::toDto);
    }

    /**
     * Get all the horarioAtencions.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<HorarioAtencionDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all HorarioAtencions");
        return horarioAtencionRepository.findAll(pageable).map(horarioAtencionMapper::toDto);
    }

    /**
     * Get all the horarioAtencions with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<HorarioAtencionDTO> findAllWithEagerRelationships(Pageable pageable) {
        return horarioAtencionRepository.findAllWithEagerRelationships(pageable).map(horarioAtencionMapper::toDto);
    }

    /**
     * Get one horarioAtencion by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<HorarioAtencionDTO> findOne(Long id) {
        LOG.debug("Request to get HorarioAtencion : {}", id);
        return horarioAtencionRepository.findOneWithEagerRelationships(id).map(horarioAtencionMapper::toDto);
    }

    /**
     * Delete the horarioAtencion by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete HorarioAtencion : {}", id);
        horarioAtencionRepository.deleteById(id);
    }
}
