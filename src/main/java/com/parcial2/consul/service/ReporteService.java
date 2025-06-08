package com.parcial2.consul.service;

import com.parcial2.consul.domain.Reporte;
import com.parcial2.consul.repository.ReporteRepository;
import com.parcial2.consul.service.dto.ReporteDTO;
import com.parcial2.consul.service.mapper.ReporteMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.parcial2.consul.domain.Reporte}.
 */
@Service
@Transactional
public class ReporteService {

    private static final Logger LOG = LoggerFactory.getLogger(ReporteService.class);

    private final ReporteRepository reporteRepository;

    private final ReporteMapper reporteMapper;

    public ReporteService(ReporteRepository reporteRepository, ReporteMapper reporteMapper) {
        this.reporteRepository = reporteRepository;
        this.reporteMapper = reporteMapper;
    }

    /**
     * Save a reporte.
     *
     * @param reporteDTO the entity to save.
     * @return the persisted entity.
     */
    public ReporteDTO save(ReporteDTO reporteDTO) {
        LOG.debug("Request to save Reporte : {}", reporteDTO);
        Reporte reporte = reporteMapper.toEntity(reporteDTO);
        reporte = reporteRepository.save(reporte);
        return reporteMapper.toDto(reporte);
    }

    /**
     * Update a reporte.
     *
     * @param reporteDTO the entity to save.
     * @return the persisted entity.
     */
    public ReporteDTO update(ReporteDTO reporteDTO) {
        LOG.debug("Request to update Reporte : {}", reporteDTO);
        Reporte reporte = reporteMapper.toEntity(reporteDTO);
        reporte = reporteRepository.save(reporte);
        return reporteMapper.toDto(reporte);
    }

    /**
     * Partially update a reporte.
     *
     * @param reporteDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ReporteDTO> partialUpdate(ReporteDTO reporteDTO) {
        LOG.debug("Request to partially update Reporte : {}", reporteDTO);

        return reporteRepository
            .findById(reporteDTO.getId())
            .map(existingReporte -> {
                reporteMapper.partialUpdate(existingReporte, reporteDTO);

                return existingReporte;
            })
            .map(reporteRepository::save)
            .map(reporteMapper::toDto);
    }

    /**
     * Get all the reportes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ReporteDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Reportes");
        return reporteRepository.findAll(pageable).map(reporteMapper::toDto);
    }

    /**
     * Get one reporte by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ReporteDTO> findOne(Long id) {
        LOG.debug("Request to get Reporte : {}", id);
        return reporteRepository.findById(id).map(reporteMapper::toDto);
    }

    /**
     * Delete the reporte by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Reporte : {}", id);
        reporteRepository.deleteById(id);
    }
}
