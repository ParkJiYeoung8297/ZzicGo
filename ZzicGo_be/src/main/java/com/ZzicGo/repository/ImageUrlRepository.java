package com.ZzicGo.repository;

import com.ZzicGo.domain.history.ImageUrl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ImageUrlRepository extends JpaRepository<ImageUrl, Long> {

    @Query("""
        SELECT i FROM ImageUrl i
        WHERE i.history.id IN :historyIds
    """)
    List<ImageUrl> findByHistoryIds(@Param("historyIds") List<Long> historyIds);
}
