package com.nxtclass.config;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

import java.util.concurrent.atomic.AtomicLong;

public class IdentityGeneratorClass implements IdentifierGenerator {
    private static final AtomicLong counter = new AtomicLong(System.currentTimeMillis());

    @Override
    public Object generate(SharedSessionContractImplementor sharedSessionContractImplementor, Object o) {
        return counter.getAndIncrement();
    }
}
