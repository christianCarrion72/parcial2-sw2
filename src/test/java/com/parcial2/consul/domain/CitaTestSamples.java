package com.parcial2.consul.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class CitaTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Cita getCitaSample1() {
        return new Cita().id(1L);
    }

    public static Cita getCitaSample2() {
        return new Cita().id(2L);
    }

    public static Cita getCitaRandomSampleGenerator() {
        return new Cita().id(longCount.incrementAndGet());
    }
}
