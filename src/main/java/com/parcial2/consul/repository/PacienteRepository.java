package com.parcial2.consul.repository;

import com.parcial2.consul.domain.Paciente;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Paciente entity.
 */
@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    default Optional<Paciente> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Paciente> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Paciente> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select paciente from Paciente paciente left join fetch paciente.user",
        countQuery = "select count(paciente) from Paciente paciente"
    )
    Page<Paciente> findAllWithToOneRelationships(Pageable pageable);

    @Query("select paciente from Paciente paciente left join fetch paciente.user")
    List<Paciente> findAllWithToOneRelationships();

    @Query("select paciente from Paciente paciente left join fetch paciente.user where paciente.id =:id")
    Optional<Paciente> findOneWithToOneRelationships(@Param("id") Long id);
}
