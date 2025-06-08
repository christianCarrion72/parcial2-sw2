package com.parcial2.consul.repository;

import com.parcial2.consul.domain.HorarioAtencion;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the HorarioAtencion entity.
 */
@Repository
public interface HorarioAtencionRepository extends JpaRepository<HorarioAtencion, Long> {
    default Optional<HorarioAtencion> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<HorarioAtencion> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<HorarioAtencion> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select horarioAtencion from HorarioAtencion horarioAtencion left join fetch horarioAtencion.medico",
        countQuery = "select count(horarioAtencion) from HorarioAtencion horarioAtencion"
    )
    Page<HorarioAtencion> findAllWithToOneRelationships(Pageable pageable);

    @Query("select horarioAtencion from HorarioAtencion horarioAtencion left join fetch horarioAtencion.medico")
    List<HorarioAtencion> findAllWithToOneRelationships();

    @Query(
        "select horarioAtencion from HorarioAtencion horarioAtencion left join fetch horarioAtencion.medico where horarioAtencion.id =:id"
    )
    Optional<HorarioAtencion> findOneWithToOneRelationships(@Param("id") Long id);
}
