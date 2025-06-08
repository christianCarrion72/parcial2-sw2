package com.parcial2.consul.repository;

import com.parcial2.consul.domain.HistoriaClinica;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the HistoriaClinica entity.
 */
@Repository
public interface HistoriaClinicaRepository extends JpaRepository<HistoriaClinica, Long> {
    default Optional<HistoriaClinica> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<HistoriaClinica> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<HistoriaClinica> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select historiaClinica from HistoriaClinica historiaClinica left join fetch historiaClinica.paciente",
        countQuery = "select count(historiaClinica) from HistoriaClinica historiaClinica"
    )
    Page<HistoriaClinica> findAllWithToOneRelationships(Pageable pageable);

    @Query("select historiaClinica from HistoriaClinica historiaClinica left join fetch historiaClinica.paciente")
    List<HistoriaClinica> findAllWithToOneRelationships();

    @Query(
        "select historiaClinica from HistoriaClinica historiaClinica left join fetch historiaClinica.paciente where historiaClinica.id =:id"
    )
    Optional<HistoriaClinica> findOneWithToOneRelationships(@Param("id") Long id);
}
