package com.parcial2.consul.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class EspecialidadTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Especialidad getEspecialidadSample1() {
        return new Especialidad().id(1L).nombre("nombre1").descripcion("descripcion1");
    }

    public static Especialidad getEspecialidadSample2() {
        return new Especialidad().id(2L).nombre("nombre2").descripcion("descripcion2");
    }

    public static Especialidad getEspecialidadRandomSampleGenerator() {
        return new Especialidad()
            .id(longCount.incrementAndGet())
            .nombre(UUID.randomUUID().toString())
            .descripcion(UUID.randomUUID().toString());
    }
}
