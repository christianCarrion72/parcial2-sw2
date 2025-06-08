package com.parcial2.consul.repository;

import com.parcial2.consul.domain.Medico;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Medico entity.
 *
 * When extending this class, extend MedicoRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface MedicoRepository extends MedicoRepositoryWithBagRelationships, JpaRepository<Medico, Long> {
    default Optional<Medico> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findOneWithToOneRelationships(id));
    }

    default List<Medico> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships());
    }

    default Page<Medico> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships(pageable));
    }

    @Query(value = "select medico from Medico medico left join fetch medico.user", countQuery = "select count(medico) from Medico medico")
    Page<Medico> findAllWithToOneRelationships(Pageable pageable);

    @Query("select medico from Medico medico left join fetch medico.user")
    List<Medico> findAllWithToOneRelationships();

    @Query("select medico from Medico medico left join fetch medico.user where medico.id =:id")
    Optional<Medico> findOneWithToOneRelationships(@Param("id") Long id);
}
