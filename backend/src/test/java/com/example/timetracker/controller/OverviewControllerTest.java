package com.example.timetracker.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import com.example.timetracker.repository.TimeEntryRepository;
import com.example.timetracker.service.UserService;           // ← add this
import org.springframework.security.test.context.support.WithMockUser;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(OverviewController.class)
class OverviewControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TimeEntryRepository repository;

    @MockBean
    private UserService userService;           // ← This satisfies JwtAuthFilter constructor

    @Test
    @WithMockUser
    void getWeeklyOverview() throws Exception {
        mockMvc.perform(get("/api/overviews/weekly")
                        .param("userId", "1")
                        .param("start", "2026-02-16"))
                .andExpect(status().isOk());
    }

    // Add similar test for monthly
}