package com.ZzicGo.repository;

import com.ZzicGo.domain.terms.TermType;
import com.ZzicGo.domain.terms.Terms;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TermsRepository extends JpaRepository<Terms,Long> {
    Optional<Terms> findByTermTypeAndVersion(TermType termType, String version);

}
