package com.parcial2.consul.repository;

import com.parcial2.consul.domain.Medico;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class MedicoRepositoryWithBagRelationshipsImpl implements MedicoRepositoryWithBagRelationships {

    private static final String ID_PARAMETER = "id";
    private static final String MEDICOS_PARAMETER = "medicos";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Medico> fetchBagRelationships(Optional<Medico> medico) {
        return medico.map(this::fetchEspecialidades);
    }

    @Override
    public Page<Medico> fetchBagRelationships(Page<Medico> medicos) {
        return new PageImpl<>(fetchBagRelationships(medicos.getContent()), medicos.getPageable(), medicos.getTotalElements());
    }

    @Override
    public List<Medico> fetchBagRelationships(List<Medico> medicos) {
        return Optional.of(medicos).map(this::fetchEspecialidades).orElse(Collections.emptyList());
    }

    Medico fetchEspecialidades(Medico result) {
        return entityManager
            .createQuery("select medico from Medico medico left join fetch medico.especialidades where medico.id = :id", Medico.class)
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<Medico> fetchEspecialidades(List<Medico> medicos) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, medicos.size()).forEach(index -> order.put(medicos.get(index).getId(), index));
        List<Medico> result = entityManager
            .createQuery("select medico from Medico medico left join fetch medico.especialidades where medico in :medicos", Medico.class)
            .setParameter(MEDICOS_PARAMETER, medicos)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
