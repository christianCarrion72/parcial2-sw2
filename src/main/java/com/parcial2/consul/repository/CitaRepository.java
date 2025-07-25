package com.parcial2.consul.repository;

import com.parcial2.consul.domain.Cita;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Cita entity.
 */
@Repository
public interface CitaRepository extends JpaRepository<Cita, Long> {
    default Optional<Cita> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Cita> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Cita> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select cita from Cita cita left join fetch cita.paciente left join fetch cita.medico",
        countQuery = "select count(cita) from Cita cita"
    )
    Page<Cita> findAllWithToOneRelationships(Pageable pageable);

    @Query("select cita from Cita cita left join fetch cita.paciente left join fetch cita.medico")
    List<Cita> findAllWithToOneRelationships();

    @Query("select cita from Cita cita left join fetch cita.paciente left join fetch cita.medico where cita.id =:id")
    Optional<Cita> findOneWithToOneRelationships(@Param("id") Long id);

    // Nuevos métodos para filtrar por paciente
    @Query(
        value = "select cita from Cita cita left join fetch cita.paciente left join fetch cita.medico where cita.paciente.id = :pacienteId",
        countQuery = "select count(cita) from Cita cita where cita.paciente.id = :pacienteId"
    )
    Page<Cita> findByPacienteId(@Param("pacienteId") Long pacienteId, Pageable pageable);

    @Query(
        value = "select cita from Cita cita left join fetch cita.paciente left join fetch cita.medico left join fetch cita.horario where cita.paciente.id = :pacienteId",
        countQuery = "select count(cita) from Cita cita where cita.paciente.id = :pacienteId"
    )
    Page<Cita> findByPacienteIdWithEagerRelationships(@Param("pacienteId") Long pacienteId, Pageable pageable);

    @Query(
        "select cita from Cita cita left join fetch cita.paciente left join fetch cita.medico where cita.paciente.id = :pacienteId and cita.id = :id"
    )
    Optional<Cita> findByIdAndPacienteIdWithEagerRelationships(@Param("id") Long id, @Param("pacienteId") Long pacienteId);
}
