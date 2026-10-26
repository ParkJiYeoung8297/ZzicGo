package com.ZzicGo.repository;
import com.ZzicGo.domain.cs.DailyCsQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface DailyCsQuestionRepository extends JpaRepository<DailyCsQuestion, Long> {
    List<DailyCsQuestion> findByDayIdOrderByIdAsc(Long dayId);
}
