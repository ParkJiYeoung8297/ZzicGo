package com.ZzicGo.repository;
import com.ZzicGo.domain.cs.DailyCsDay;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.Optional;
public interface DailyCsDayRepository extends JpaRepository<DailyCsDay, Long> {
    Optional<DailyCsDay> findByDate(LocalDate date);
}
