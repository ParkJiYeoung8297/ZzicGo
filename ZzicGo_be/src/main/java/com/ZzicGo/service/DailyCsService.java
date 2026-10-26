package com.ZzicGo.service;

import com.ZzicGo.domain.cs.*;
import com.ZzicGo.dto.DailyCsDto.*;
import com.ZzicGo.global.*;
import com.ZzicGo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.*;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DailyCsService {
    private final DailyCsDayRepository days;
    private final DailyCsQuestionRepository questions;

    public DayView get(LocalDate date, boolean admin) {
        DailyCsDay day = days.findByDate(date).orElseThrow(DailyCsService::notFound);
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
        if (!admin && !day.isVisibleAt(now)) throw notFound();
        var visible = questions.findByDayIdOrderByIdAsc(day.getId()).stream()
                .filter(q -> admin || q.isVisibleAt(now)).map(QuestionView::from).toList();
        return DayView.from(day, visible);
    }

    @Transactional
    public DayView create(DayWrite input) {
        if (input.date() == null || input.questions() == null || input.questions().size() != 3
                || days.findByDate(input.date()).isPresent()) throw badRequest();
        LocalDateTime scheduled = input.scheduledAt() == null ? input.date().atTime(7, 0) : input.scheduledAt();
        if (!scheduled.toLocalDate().equals(input.date())) throw badRequest();
        input.questions().forEach(q -> validate(q));
        DailyCsDay day = days.save(new DailyCsDay(input.date(), scheduled, input.generationCompleted()));
        List<DailyCsQuestion> saved = questions.saveAll(input.questions().stream()
                .map(q -> new DailyCsQuestion(day, q.question(), q.answer(),
                        q.publishedAt() == null ? scheduled : q.publishedAt(), q.published())).toList());
        return DayView.from(day, saved.stream().map(QuestionView::from).toList());
    }

    @Transactional
    public void updateQuestion(Long id, QuestionWrite input) {
        validate(input);
        DailyCsQuestion question = questions.findById(id).orElseThrow(DailyCsService::notFound);
        question.update(input.question(), input.answer(),
                input.publishedAt() == null ? question.getPublishedAt() : input.publishedAt(), input.published());
    }

    @Transactional
    public void updateCompletion(Long id, boolean completed) {
        DailyCsDay day = days.findById(id).orElseThrow(DailyCsService::notFound);
        day.setGenerationCompleted(completed);
    }

    private static void validate(QuestionWrite input) {
        if (input == null || input.question() == null || input.question().isBlank()
                || input.answer() == null || input.answer().isBlank()) throw badRequest();
    }
    private static CustomException badRequest() { return new CustomException(GeneralErrorCode.BAD_REQUEST_400); }
    private static CustomException notFound() { return new CustomException(GeneralErrorCode.NOT_FOUND_404); }
}
