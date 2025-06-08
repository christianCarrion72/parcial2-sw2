package com.parcial2.consul.web.rest;

import static com.parcial2.consul.domain.ReporteAsserts.*;
import static com.parcial2.consul.web.rest.TestUtil.createUpdateProxyForBean;
import static com.parcial2.consul.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.parcial2.consul.IntegrationTest;
import com.parcial2.consul.domain.Reporte;
import com.parcial2.consul.repository.ReporteRepository;
import com.parcial2.consul.service.dto.ReporteDTO;
import com.parcial2.consul.service.mapper.ReporteMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ReporteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ReporteResourceIT {

    private static final String DEFAULT_TIPO = "AAAAAAAAAA";
    private static final String UPDATED_TIPO = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_FECHA_GENERACION = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_FECHA_GENERACION = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_RUTA_ARCHIVO = "AAAAAAAAAA";
    private static final String UPDATED_RUTA_ARCHIVO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/reportes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ReporteRepository reporteRepository;

    @Autowired
    private ReporteMapper reporteMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restReporteMockMvc;

    private Reporte reporte;

    private Reporte insertedReporte;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Reporte createEntity() {
        return new Reporte().tipo(DEFAULT_TIPO).fechaGeneracion(DEFAULT_FECHA_GENERACION).rutaArchivo(DEFAULT_RUTA_ARCHIVO);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Reporte createUpdatedEntity() {
        return new Reporte().tipo(UPDATED_TIPO).fechaGeneracion(UPDATED_FECHA_GENERACION).rutaArchivo(UPDATED_RUTA_ARCHIVO);
    }

    @BeforeEach
    void initTest() {
        reporte = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedReporte != null) {
            reporteRepository.delete(insertedReporte);
            insertedReporte = null;
        }
    }

    @Test
    @Transactional
    void createReporte() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Reporte
        ReporteDTO reporteDTO = reporteMapper.toDto(reporte);
        var returnedReporteDTO = om.readValue(
            restReporteMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reporteDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ReporteDTO.class
        );

        // Validate the Reporte in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedReporte = reporteMapper.toEntity(returnedReporteDTO);
        assertReporteUpdatableFieldsEquals(returnedReporte, getPersistedReporte(returnedReporte));

        insertedReporte = returnedReporte;
    }

    @Test
    @Transactional
    void createReporteWithExistingId() throws Exception {
        // Create the Reporte with an existing ID
        reporte.setId(1L);
        ReporteDTO reporteDTO = reporteMapper.toDto(reporte);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restReporteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reporteDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Reporte in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTipoIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        reporte.setTipo(null);

        // Create the Reporte, which fails.
        ReporteDTO reporteDTO = reporteMapper.toDto(reporte);

        restReporteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reporteDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkFechaGeneracionIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        reporte.setFechaGeneracion(null);

        // Create the Reporte, which fails.
        ReporteDTO reporteDTO = reporteMapper.toDto(reporte);

        restReporteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reporteDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkRutaArchivoIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        reporte.setRutaArchivo(null);

        // Create the Reporte, which fails.
        ReporteDTO reporteDTO = reporteMapper.toDto(reporte);

        restReporteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reporteDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllReportes() throws Exception {
        // Initialize the database
        insertedReporte = reporteRepository.saveAndFlush(reporte);

        // Get all the reporteList
        restReporteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(reporte.getId().intValue())))
            .andExpect(jsonPath("$.[*].tipo").value(hasItem(DEFAULT_TIPO)))
            .andExpect(jsonPath("$.[*].fechaGeneracion").value(hasItem(sameInstant(DEFAULT_FECHA_GENERACION))))
            .andExpect(jsonPath("$.[*].rutaArchivo").value(hasItem(DEFAULT_RUTA_ARCHIVO)));
    }

    @Test
    @Transactional
    void getReporte() throws Exception {
        // Initialize the database
        insertedReporte = reporteRepository.saveAndFlush(reporte);

        // Get the reporte
        restReporteMockMvc
            .perform(get(ENTITY_API_URL_ID, reporte.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(reporte.getId().intValue()))
            .andExpect(jsonPath("$.tipo").value(DEFAULT_TIPO))
            .andExpect(jsonPath("$.fechaGeneracion").value(sameInstant(DEFAULT_FECHA_GENERACION)))
            .andExpect(jsonPath("$.rutaArchivo").value(DEFAULT_RUTA_ARCHIVO));
    }

    @Test
    @Transactional
    void getNonExistingReporte() throws Exception {
        // Get the reporte
        restReporteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingReporte() throws Exception {
        // Initialize the database
        insertedReporte = reporteRepository.saveAndFlush(reporte);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the reporte
        Reporte updatedReporte = reporteRepository.findById(reporte.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedReporte are not directly saved in db
        em.detach(updatedReporte);
        updatedReporte.tipo(UPDATED_TIPO).fechaGeneracion(UPDATED_FECHA_GENERACION).rutaArchivo(UPDATED_RUTA_ARCHIVO);
        ReporteDTO reporteDTO = reporteMapper.toDto(updatedReporte);

        restReporteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, reporteDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reporteDTO))
            )
            .andExpect(status().isOk());

        // Validate the Reporte in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedReporteToMatchAllProperties(updatedReporte);
    }

    @Test
    @Transactional
    void putNonExistingReporte() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reporte.setId(longCount.incrementAndGet());

        // Create the Reporte
        ReporteDTO reporteDTO = reporteMapper.toDto(reporte);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReporteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, reporteDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reporteDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reporte in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchReporte() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reporte.setId(longCount.incrementAndGet());

        // Create the Reporte
        ReporteDTO reporteDTO = reporteMapper.toDto(reporte);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReporteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(reporteDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reporte in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamReporte() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reporte.setId(longCount.incrementAndGet());

        // Create the Reporte
        ReporteDTO reporteDTO = reporteMapper.toDto(reporte);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReporteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(reporteDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Reporte in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateReporteWithPatch() throws Exception {
        // Initialize the database
        insertedReporte = reporteRepository.saveAndFlush(reporte);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the reporte using partial update
        Reporte partialUpdatedReporte = new Reporte();
        partialUpdatedReporte.setId(reporte.getId());

        partialUpdatedReporte.tipo(UPDATED_TIPO).fechaGeneracion(UPDATED_FECHA_GENERACION).rutaArchivo(UPDATED_RUTA_ARCHIVO);

        restReporteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReporte.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedReporte))
            )
            .andExpect(status().isOk());

        // Validate the Reporte in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertReporteUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedReporte, reporte), getPersistedReporte(reporte));
    }

    @Test
    @Transactional
    void fullUpdateReporteWithPatch() throws Exception {
        // Initialize the database
        insertedReporte = reporteRepository.saveAndFlush(reporte);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the reporte using partial update
        Reporte partialUpdatedReporte = new Reporte();
        partialUpdatedReporte.setId(reporte.getId());

        partialUpdatedReporte.tipo(UPDATED_TIPO).fechaGeneracion(UPDATED_FECHA_GENERACION).rutaArchivo(UPDATED_RUTA_ARCHIVO);

        restReporteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedReporte.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedReporte))
            )
            .andExpect(status().isOk());

        // Validate the Reporte in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertReporteUpdatableFieldsEquals(partialUpdatedReporte, getPersistedReporte(partialUpdatedReporte));
    }

    @Test
    @Transactional
    void patchNonExistingReporte() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reporte.setId(longCount.incrementAndGet());

        // Create the Reporte
        ReporteDTO reporteDTO = reporteMapper.toDto(reporte);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restReporteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, reporteDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(reporteDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reporte in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchReporte() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reporte.setId(longCount.incrementAndGet());

        // Create the Reporte
        ReporteDTO reporteDTO = reporteMapper.toDto(reporte);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReporteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(reporteDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Reporte in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamReporte() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        reporte.setId(longCount.incrementAndGet());

        // Create the Reporte
        ReporteDTO reporteDTO = reporteMapper.toDto(reporte);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restReporteMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(reporteDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Reporte in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteReporte() throws Exception {
        // Initialize the database
        insertedReporte = reporteRepository.saveAndFlush(reporte);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the reporte
        restReporteMockMvc
            .perform(delete(ENTITY_API_URL_ID, reporte.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return reporteRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Reporte getPersistedReporte(Reporte reporte) {
        return reporteRepository.findById(reporte.getId()).orElseThrow();
    }

    protected void assertPersistedReporteToMatchAllProperties(Reporte expectedReporte) {
        assertReporteAllPropertiesEquals(expectedReporte, getPersistedReporte(expectedReporte));
    }

    protected void assertPersistedReporteToMatchUpdatableProperties(Reporte expectedReporte) {
        assertReporteAllUpdatablePropertiesEquals(expectedReporte, getPersistedReporte(expectedReporte));
    }
}
