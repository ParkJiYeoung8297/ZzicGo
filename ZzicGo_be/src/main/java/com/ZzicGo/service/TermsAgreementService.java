package com.ZzicGo.service;

import com.ZzicGo.domain.terms.Terms;
import com.ZzicGo.domain.terms.TermsAgreement;
import com.ZzicGo.domain.user.User;
import com.ZzicGo.exception.TermsException;
import com.ZzicGo.exception.UserException;
import com.ZzicGo.global.CustomException;
import com.ZzicGo.repository.TermsAgreementRepository;
import com.ZzicGo.repository.TermsRepository;
import com.ZzicGo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class TermsAgreementService {

    private final TermsRepository termsRepository;
    private final TermsAgreementRepository termsAgreementRepository;
    private final UserRepository userRepository;

    public void updateAgreement(Long userId, Long termId, boolean isAgreed) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(UserException.NOT_EXIST_USER));

        Terms terms = termsRepository.findById(termId)
                .orElseThrow(() -> new CustomException(TermsException.TERMS_NOT_FOUND));

        TermsAgreement agreement = termsAgreementRepository.findByUserAndTerms(user, terms)
                .orElse(null);

        if (terms.isRequired() && !isAgreed) {
            throw new CustomException(TermsException.CANNOT_UNAGREE_REQUIRED_TERMS);
        }

        if (agreement != null) {
            agreement.updateAgreement(isAgreed); // true일 때만 변경됨
            return;
        }

        // --- 없는 경우: 새로 생성 ---
        TermsAgreement newAgreement = TermsAgreement.builder()
                .user(user)
                .terms(terms)
                .isAgreed(isAgreed)
                .agreedAt(LocalDateTime.now())
                .build();

        termsAgreementRepository.save(newAgreement);
    }
}
