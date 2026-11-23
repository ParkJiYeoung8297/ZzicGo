package com.ZzicGo.repository;

import com.ZzicGo.domain.interview.InterviewQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InterviewQuestionRepository extends JpaRepository<InterviewQuestion, Long> {
    List<InterviewQuestion> findAllByOrderBySortOrderAscIdAsc();
}
