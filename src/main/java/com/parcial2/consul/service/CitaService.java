package com.parcial2.consul.service;

import com.parcial2.consul.domain.Cita;
import com.parcial2.consul.domain.enumeration.EstadoCita;
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

    // Nuevos métodos para pacientes

    /**
     * Get all citas for a specific patient.
     *
     * @param pacienteId the patient ID to filter by.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<CitaDTO> findByPacienteId(Long pacienteId, Pageable pageable) {
        LOG.debug("Request to get all Citas for patient: {}", pacienteId);
        return citaRepository.findByPacienteId(pacienteId, pageable).map(citaMapper::toDto);
    }

    /**
     * Get all citas for a specific patient with eager relationships.
     *
     * @param pacienteId the patient ID to filter by.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<CitaDTO> findByPacienteIdWithEagerRelationships(Long pacienteId, Pageable pageable) {
        LOG.debug("Request to get all Citas with eager relationships for patient: {}", pacienteId);
        return citaRepository.findByPacienteIdWithEagerRelationships(pacienteId, pageable).map(citaMapper::toDto);
    }

    /**
     * Get one cita by id for a specific patient.
     *
     * @param id the cita id
     * @param pacienteId the patient id
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<CitaDTO> findOneByPacienteId(Long id, Long pacienteId) {
        LOG.debug("Request to get Cita : {} for patient : {}", id, pacienteId);
        return citaRepository.findByIdAndPacienteIdWithEagerRelationships(id, pacienteId).map(citaMapper::toDto);
    }

    /**
     * Partially update a cita for a patient (only estado allowed).
     *
     * @param citaDTO the entity to update partially
     * @param pacienteId the patient id
     * @return the persisted entity
     */
    public Optional<CitaDTO> partialUpdateForPaciente(CitaDTO citaDTO, Long pacienteId) {
        LOG.debug("Request to partially update Cita : {} for patient : {}", citaDTO, pacienteId);

        return citaRepository
            .findByIdAndPacienteIdWithEagerRelationships(citaDTO.getId(), pacienteId)
            .map(existingCita -> {
                // Solo permitir cambio de estado para pacientes
                if (citaDTO.getEstado() != null) {
                    // Solo permitir CONFIRMADA o CANCELADA
                    if (citaDTO.getEstado() == EstadoCita.CONFIRMADA || citaDTO.getEstado() == EstadoCita.CANCELADA) {
                        existingCita.setEstado(citaDTO.getEstado());
                        if (citaDTO.getEstado() == EstadoCita.CONFIRMADA) {
                            existingCita.setConfirmada(true);
                        }
                    }
                }
                return existingCita;
            })
            .map(citaRepository::save)
            .map(citaMapper::toDto);
    }
}
