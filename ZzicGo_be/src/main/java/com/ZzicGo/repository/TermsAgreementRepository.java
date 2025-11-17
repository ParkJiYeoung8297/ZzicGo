package com.ZzicGo.repository;

import com.ZzicGo.domain.terms.Terms;
import com.ZzicGo.domain.terms.TermsAgreement;
import com.ZzicGo.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TermsAgreementRepository extends JpaRepository<TermsAgreement, Long> {
    boolean existsByUserAndTerms(User user, Terms terms);

    Optional<TermsAgreement> findByUserAndTerms(User user, Terms terms);
}
