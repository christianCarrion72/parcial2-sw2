package com.parcial2.consul.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class HorarioAtencionTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static HorarioAtencion getHorarioAtencionSample1() {
        return new HorarioAtencion().id(1L);
    }

    public static HorarioAtencion getHorarioAtencionSample2() {
        return new HorarioAtencion().id(2L);
    }

    public static HorarioAtencion getHorarioAtencionRandomSampleGenerator() {
        return new HorarioAtencion().id(longCount.incrementAndGet());
    }
}
