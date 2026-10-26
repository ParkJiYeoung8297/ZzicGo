package com.ZzicGo.controller;

import com.ZzicGo.dto.DailyCsDto.*;
import com.ZzicGo.global.CustomResponse;
import com.ZzicGo.service.DailyCsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@Tag(name = "Daily CS", description = "CS 문제 등록 및 예약 공개 (시간은 Asia/Seoul)")
@RequestMapping("/api/z1/cs")
public class DailyCsController {
    private final DailyCsService service;

    @GetMapping("/days/{date}")
    public CustomResponse<DayView> get(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return CustomResponse.ok(service.get(date, false));
    }
    @GetMapping("/admin/days/{date}")
    public CustomResponse<DayView> preview(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return CustomResponse.ok(service.get(date, true));
    }
    @PostMapping("/admin/days")
    public CustomResponse<DayView> create(@RequestBody DayWrite input) {
        return CustomResponse.created(service.create(input));
    }
    @PutMapping("/admin/questions/{id}")
    public CustomResponse<Void> update(@PathVariable Long id, @RequestBody QuestionWrite input) {
        service.updateQuestion(id, input);
        return CustomResponse.ok(null);
    }
    @PatchMapping("/admin/days/{id}/completion")
    public CustomResponse<Void> complete(@PathVariable Long id, @RequestBody CompletionWrite input) {
        service.updateCompletion(id, input.generationCompleted());
        return CustomResponse.ok(null);
    }
}
