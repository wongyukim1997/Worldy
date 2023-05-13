package com.ssafy.worldy.model.adventure.repo;

import com.ssafy.worldy.model.adventure.entity.Info;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface InfoRepo extends JpaRepository<Info, Long> {

    @Query(value = "select * from info where nation_id = ?1 and category = ?2", nativeQuery = true)
    Info getInfoByNationIdAndCategory(Long nationId, String category);
}
