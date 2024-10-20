package com.example.lawmadad_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthCheck {

    @GetMapping("/health-check")
    @ResponseStatus(HttpStatus.OK)
    public String healthCheck(){
        return "Service is up and running";
    }
}
