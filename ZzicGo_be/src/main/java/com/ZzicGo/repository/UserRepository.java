package com.ZzicGo.repository;

import com.ZzicGo.domain.user.Provider;
import com.ZzicGo.domain.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByProviderAndProviderId(Provider provider, String providerId);

}
