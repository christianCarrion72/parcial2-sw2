package com.parcial2.consul.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ReporteTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Reporte getReporteSample1() {
        return new Reporte().id(1L).tipo("tipo1").rutaArchivo("rutaArchivo1");
    }

    public static Reporte getReporteSample2() {
        return new Reporte().id(2L).tipo("tipo2").rutaArchivo("rutaArchivo2");
    }

    public static Reporte getReporteRandomSampleGenerator() {
        return new Reporte().id(longCount.incrementAndGet()).tipo(UUID.randomUUID().toString()).rutaArchivo(UUID.randomUUID().toString());
    }
}
