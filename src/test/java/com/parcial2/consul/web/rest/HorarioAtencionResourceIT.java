package com.parcial2.consul.web.rest;

import static com.parcial2.consul.domain.HorarioAtencionAsserts.*;
import static com.parcial2.consul.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.parcial2.consul.IntegrationTest;
import com.parcial2.consul.domain.HorarioAtencion;
import com.parcial2.consul.domain.enumeration.DiaSemana;
import com.parcial2.consul.repository.HorarioAtencionRepository;
import com.parcial2.consul.service.HorarioAtencionService;
import com.parcial2.consul.service.dto.HorarioAtencionDTO;
import com.parcial2.consul.service.mapper.HorarioAtencionMapper;
import jakarta.persistence.EntityManager;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link HorarioAtencionResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class HorarioAtencionResourceIT {

    private static final DiaSemana DEFAULT_DIA_SEMANA = DiaSemana.LUNES;
    private static final DiaSemana UPDATED_DIA_SEMANA = DiaSemana.MARTES;

    private static final LocalTime DEFAULT_HORA_INICIO = LocalTime.NOON;
    private static final LocalTime UPDATED_HORA_INICIO = LocalTime.MAX.withNano(0);

    private static final LocalTime DEFAULT_HORA_FIN = LocalTime.NOON;
    private static final LocalTime UPDATED_HORA_FIN = LocalTime.MAX.withNano(0);

    private static final String ENTITY_API_URL = "/api/horario-atencions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private HorarioAtencionRepository horarioAtencionRepository;

    @Mock
    private HorarioAtencionRepository horarioAtencionRepositoryMock;

    @Autowired
    private HorarioAtencionMapper horarioAtencionMapper;

    @Mock
    private HorarioAtencionService horarioAtencionServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restHorarioAtencionMockMvc;

    private HorarioAtencion horarioAtencion;

    private HorarioAtencion insertedHorarioAtencion;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HorarioAtencion createEntity() {
        return new HorarioAtencion().diaSemana(DEFAULT_DIA_SEMANA).horaInicio(DEFAULT_HORA_INICIO).horaFin(DEFAULT_HORA_FIN);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HorarioAtencion createUpdatedEntity() {
        return new HorarioAtencion().diaSemana(UPDATED_DIA_SEMANA).horaInicio(UPDATED_HORA_INICIO).horaFin(UPDATED_HORA_FIN);
    }

    @BeforeEach
    void initTest() {
        horarioAtencion = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedHorarioAtencion != null) {
            horarioAtencionRepository.delete(insertedHorarioAtencion);
            insertedHorarioAtencion = null;
        }
    }

    @Test
    @Transactional
    void createHorarioAtencion() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the HorarioAtencion
        HorarioAtencionDTO horarioAtencionDTO = horarioAtencionMapper.toDto(horarioAtencion);
        var returnedHorarioAtencionDTO = om.readValue(
            restHorarioAtencionMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(horarioAtencionDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            HorarioAtencionDTO.class
        );

        // Validate the HorarioAtencion in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedHorarioAtencion = horarioAtencionMapper.toEntity(returnedHorarioAtencionDTO);
        assertHorarioAtencionUpdatableFieldsEquals(returnedHorarioAtencion, getPersistedHorarioAtencion(returnedHorarioAtencion));

        insertedHorarioAtencion = returnedHorarioAtencion;
    }

    @Test
    @Transactional
    void createHorarioAtencionWithExistingId() throws Exception {
        // Create the HorarioAtencion with an existing ID
        horarioAtencion.setId(1L);
        HorarioAtencionDTO horarioAtencionDTO = horarioAtencionMapper.toDto(horarioAtencion);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restHorarioAtencionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(horarioAtencionDTO)))
            .andExpect(status().isBadRequest());

        // Validate the HorarioAtencion in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDiaSemanaIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        horarioAtencion.setDiaSemana(null);

        // Create the HorarioAtencion, which fails.
        HorarioAtencionDTO horarioAtencionDTO = horarioAtencionMapper.toDto(horarioAtencion);

        restHorarioAtencionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(horarioAtencionDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkHoraInicioIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        horarioAtencion.setHoraInicio(null);

        // Create the HorarioAtencion, which fails.
        HorarioAtencionDTO horarioAtencionDTO = horarioAtencionMapper.toDto(horarioAtencion);

        restHorarioAtencionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(horarioAtencionDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkHoraFinIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        horarioAtencion.setHoraFin(null);

        // Create the HorarioAtencion, which fails.
        HorarioAtencionDTO horarioAtencionDTO = horarioAtencionMapper.toDto(horarioAtencion);

        restHorarioAtencionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(horarioAtencionDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllHorarioAtencions() throws Exception {
        // Initialize the database
        insertedHorarioAtencion = horarioAtencionRepository.saveAndFlush(horarioAtencion);

        // Get all the horarioAtencionList
        restHorarioAtencionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(horarioAtencion.getId().intValue())))
            .andExpect(jsonPath("$.[*].diaSemana").value(hasItem(DEFAULT_DIA_SEMANA.toString())))
            .andExpect(jsonPath("$.[*].horaInicio").value(hasItem(DEFAULT_HORA_INICIO.toString())))
            .andExpect(jsonPath("$.[*].horaFin").value(hasItem(DEFAULT_HORA_FIN.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllHorarioAtencionsWithEagerRelationshipsIsEnabled() throws Exception {
        when(horarioAtencionServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restHorarioAtencionMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(horarioAtencionServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllHorarioAtencionsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(horarioAtencionServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restHorarioAtencionMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(horarioAtencionRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getHorarioAtencion() throws Exception {
        // Initialize the database
        insertedHorarioAtencion = horarioAtencionRepository.saveAndFlush(horarioAtencion);

        // Get the horarioAtencion
        restHorarioAtencionMockMvc
            .perform(get(ENTITY_API_URL_ID, horarioAtencion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(horarioAtencion.getId().intValue()))
            .andExpect(jsonPath("$.diaSemana").value(DEFAULT_DIA_SEMANA.toString()))
            .andExpect(jsonPath("$.horaInicio").value(DEFAULT_HORA_INICIO.toString()))
            .andExpect(jsonPath("$.horaFin").value(DEFAULT_HORA_FIN.toString()));
    }

    @Test
    @Transactional
    void getNonExistingHorarioAtencion() throws Exception {
        // Get the horarioAtencion
        restHorarioAtencionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingHorarioAtencion() throws Exception {
        // Initialize the database
        insertedHorarioAtencion = horarioAtencionRepository.saveAndFlush(horarioAtencion);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the horarioAtencion
        HorarioAtencion updatedHorarioAtencion = horarioAtencionRepository.findById(horarioAtencion.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedHorarioAtencion are not directly saved in db
        em.detach(updatedHorarioAtencion);
        updatedHorarioAtencion.diaSemana(UPDATED_DIA_SEMANA).horaInicio(UPDATED_HORA_INICIO).horaFin(UPDATED_HORA_FIN);
        HorarioAtencionDTO horarioAtencionDTO = horarioAtencionMapper.toDto(updatedHorarioAtencion);

        restHorarioAtencionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, horarioAtencionDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(horarioAtencionDTO))
            )
            .andExpect(status().isOk());

        // Validate the HorarioAtencion in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedHorarioAtencionToMatchAllProperties(updatedHorarioAtencion);
    }

    @Test
    @Transactional
    void putNonExistingHorarioAtencion() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        horarioAtencion.setId(longCount.incrementAndGet());

        // Create the HorarioAtencion
        HorarioAtencionDTO horarioAtencionDTO = horarioAtencionMapper.toDto(horarioAtencion);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHorarioAtencionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, horarioAtencionDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(horarioAtencionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the HorarioAtencion in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchHorarioAtencion() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        horarioAtencion.setId(longCount.incrementAndGet());

        // Create the HorarioAtencion
        HorarioAtencionDTO horarioAtencionDTO = horarioAtencionMapper.toDto(horarioAtencion);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHorarioAtencionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(horarioAtencionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the HorarioAtencion in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamHorarioAtencion() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        horarioAtencion.setId(longCount.incrementAndGet());

        // Create the HorarioAtencion
        HorarioAtencionDTO horarioAtencionDTO = horarioAtencionMapper.toDto(horarioAtencion);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHorarioAtencionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(horarioAtencionDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the HorarioAtencion in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateHorarioAtencionWithPatch() throws Exception {
        // Initialize the database
        insertedHorarioAtencion = horarioAtencionRepository.saveAndFlush(horarioAtencion);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the horarioAtencion using partial update
        HorarioAtencion partialUpdatedHorarioAtencion = new HorarioAtencion();
        partialUpdatedHorarioAtencion.setId(horarioAtencion.getId());

        partialUpdatedHorarioAtencion.horaInicio(UPDATED_HORA_INICIO).horaFin(UPDATED_HORA_FIN);

        restHorarioAtencionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHorarioAtencion.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedHorarioAtencion))
            )
            .andExpect(status().isOk());

        // Validate the HorarioAtencion in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertHorarioAtencionUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedHorarioAtencion, horarioAtencion),
            getPersistedHorarioAtencion(horarioAtencion)
        );
    }

    @Test
    @Transactional
    void fullUpdateHorarioAtencionWithPatch() throws Exception {
        // Initialize the database
        insertedHorarioAtencion = horarioAtencionRepository.saveAndFlush(horarioAtencion);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the horarioAtencion using partial update
        HorarioAtencion partialUpdatedHorarioAtencion = new HorarioAtencion();
        partialUpdatedHorarioAtencion.setId(horarioAtencion.getId());

        partialUpdatedHorarioAtencion.diaSemana(UPDATED_DIA_SEMANA).horaInicio(UPDATED_HORA_INICIO).horaFin(UPDATED_HORA_FIN);

        restHorarioAtencionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHorarioAtencion.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedHorarioAtencion))
            )
            .andExpect(status().isOk());

        // Validate the HorarioAtencion in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertHorarioAtencionUpdatableFieldsEquals(
            partialUpdatedHorarioAtencion,
            getPersistedHorarioAtencion(partialUpdatedHorarioAtencion)
        );
    }

    @Test
    @Transactional
    void patchNonExistingHorarioAtencion() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        horarioAtencion.setId(longCount.incrementAndGet());

        // Create the HorarioAtencion
        HorarioAtencionDTO horarioAtencionDTO = horarioAtencionMapper.toDto(horarioAtencion);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHorarioAtencionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, horarioAtencionDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(horarioAtencionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the HorarioAtencion in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchHorarioAtencion() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        horarioAtencion.setId(longCount.incrementAndGet());

        // Create the HorarioAtencion
        HorarioAtencionDTO horarioAtencionDTO = horarioAtencionMapper.toDto(horarioAtencion);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHorarioAtencionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(horarioAtencionDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the HorarioAtencion in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamHorarioAtencion() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        horarioAtencion.setId(longCount.incrementAndGet());

        // Create the HorarioAtencion
        HorarioAtencionDTO horarioAtencionDTO = horarioAtencionMapper.toDto(horarioAtencion);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHorarioAtencionMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(horarioAtencionDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the HorarioAtencion in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteHorarioAtencion() throws Exception {
        // Initialize the database
        insertedHorarioAtencion = horarioAtencionRepository.saveAndFlush(horarioAtencion);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the horarioAtencion
        restHorarioAtencionMockMvc
            .perform(delete(ENTITY_API_URL_ID, horarioAtencion.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return horarioAtencionRepository.count();
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

    protected HorarioAtencion getPersistedHorarioAtencion(HorarioAtencion horarioAtencion) {
        return horarioAtencionRepository.findById(horarioAtencion.getId()).orElseThrow();
    }

    protected void assertPersistedHorarioAtencionToMatchAllProperties(HorarioAtencion expectedHorarioAtencion) {
        assertHorarioAtencionAllPropertiesEquals(expectedHorarioAtencion, getPersistedHorarioAtencion(expectedHorarioAtencion));
    }

    protected void assertPersistedHorarioAtencionToMatchUpdatableProperties(HorarioAtencion expectedHorarioAtencion) {
        assertHorarioAtencionAllUpdatablePropertiesEquals(expectedHorarioAtencion, getPersistedHorarioAtencion(expectedHorarioAtencion));
    }
}
