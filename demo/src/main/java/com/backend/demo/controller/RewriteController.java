package com.backend.demo.controller;

import com.backend.demo.model.RewriteRequest;
import com.backend.demo.service.RewriteSimulator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/rewrite")
@CrossOrigin(origins = "*")
public class RewriteController {

    @PostMapping
    public ResponseEntity<Map<String, String>> rewriteText(@RequestBody RewriteRequest request) {
        String rewritten = RewriteSimulator.simulate(request.getText(), request.getTone());
        Map<String, String> response = new HashMap<>();
        response.put("rewritten", rewritten);
        return ResponseEntity.ok(response);
    }
}
