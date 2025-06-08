package com.parcial2.consul.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class PacienteTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Paciente getPacienteSample1() {
        return new Paciente().id(1L).nroHistoriaClinica("nroHistoriaClinica1").direccion("direccion1").telefono("telefono1");
    }

    public static Paciente getPacienteSample2() {
        return new Paciente().id(2L).nroHistoriaClinica("nroHistoriaClinica2").direccion("direccion2").telefono("telefono2");
    }

    public static Paciente getPacienteRandomSampleGenerator() {
        return new Paciente()
            .id(longCount.incrementAndGet())
            .nroHistoriaClinica(UUID.randomUUID().toString())
            .direccion(UUID.randomUUID().toString())
            .telefono(UUID.randomUUID().toString());
    }
}
