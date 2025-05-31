package com.jobboard.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum Role {
    APPLICANT,
    EMPLOYER;

    @JsonCreator
    public static Role fromString(String value) {
        return Role.valueOf(value.toUpperCase());
    }
}
