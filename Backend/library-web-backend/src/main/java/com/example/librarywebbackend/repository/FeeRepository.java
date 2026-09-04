package com.example.librarywebbackend.repository;

import com.example.librarywebbackend.entity.Fee;
import com.example.librarywebbackend.entity.FeeStatus;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FeeRepository extends JpaRepository<Fee, Long> {
    List<Fee> findByStatus(FeeStatus status);

    @Query("""
    select case when count(f) > 0 then true else false end
    from Fee f
    where f.user.id = :userId and f.status = :status
""")
    boolean existsByUserIdAndStatus(Long userId, FeeStatus status);

    @Query("select f from Fee f where f.user.id = :userId")
    List<Fee> findByUserId(@Param("userId") Long userId);

    @Query("""
    select
        row_number() over (order by count(f) desc) as id,
        u.id as userId,
        u.firstName as firstName,
        u.lastName as lastName,
        u.email as email,
        count(f) as countFees,
        sum(case when f.status = com.example.librarywebbackend.entity.FeeStatus.PENDING then 1 else 0 end) as countUnpaid,
        sum(case when f.status = com.example.librarywebbackend.entity.FeeStatus.PAID then 1 else 0 end) as countPaid,
        sum(case when f.status = com.example.librarywebbackend.entity.FeeStatus.CANCELLED then 1 else 0 end) as countCancelled
    from Fee f
    join f.user u
    group by u.id, u.firstName, u.lastName, u.email
    order by count(f) desc
""")
    List<Object[]> countFeesByUserRaw();
}
