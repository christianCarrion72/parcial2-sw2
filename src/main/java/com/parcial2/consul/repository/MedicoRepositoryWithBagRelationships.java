package com.parcial2.consul.repository;

import com.parcial2.consul.domain.Medico;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface MedicoRepositoryWithBagRelationships {
    Optional<Medico> fetchBagRelationships(Optional<Medico> medico);

    List<Medico> fetchBagRelationships(List<Medico> medicos);

    Page<Medico> fetchBagRelationships(Page<Medico> medicos);
}
