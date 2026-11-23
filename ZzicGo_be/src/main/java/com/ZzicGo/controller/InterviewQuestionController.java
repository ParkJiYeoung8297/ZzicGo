package com.ZzicGo.controller;

import com.ZzicGo.domain.interview.InterviewQuestion;
import com.ZzicGo.global.CustomResponse;
import com.ZzicGo.repository.InterviewQuestionRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/z1/interview")
@Tag(name = "Interview Questions", description = "프로젝트 면접 질문 목록")
public class InterviewQuestionController {
    private final InterviewQuestionRepository questions;

    @GetMapping("/questions")
    public CustomResponse<List<QuestionView>> list() {
        return CustomResponse.ok(questions.findAllByOrderBySortOrderAscIdAsc().stream()
                .map(QuestionView::from).toList());
    }

    public record QuestionView(Long id, String category, String question) {
        private static QuestionView from(InterviewQuestion question) {
            return new QuestionView(question.getId(), question.getCategory(), question.getQuestion());
        }
    }
}
