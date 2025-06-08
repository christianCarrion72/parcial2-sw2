package com.parcial2.consul.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class HistoriaClinicaTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static HistoriaClinica getHistoriaClinicaSample1() {
        return new HistoriaClinica().id(1L).diagnostico("diagnostico1").tratamiento("tratamiento1").hashBlockchain("hashBlockchain1");
    }

    public static HistoriaClinica getHistoriaClinicaSample2() {
        return new HistoriaClinica().id(2L).diagnostico("diagnostico2").tratamiento("tratamiento2").hashBlockchain("hashBlockchain2");
    }

    public static HistoriaClinica getHistoriaClinicaRandomSampleGenerator() {
        return new HistoriaClinica()
            .id(longCount.incrementAndGet())
            .diagnostico(UUID.randomUUID().toString())
            .tratamiento(UUID.randomUUID().toString())
            .hashBlockchain(UUID.randomUUID().toString());
    }
}
