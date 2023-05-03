package com.ssafy.worldy.controller.game;

import com.ssafy.worldy.model.game.dto.GameResultDto;
import com.ssafy.worldy.model.game.dto.GameRoom;
import com.ssafy.worldy.model.game.dto.MatchingResultDto;
import com.ssafy.worldy.model.game.dto.MatchingWaitingRoom;
import com.ssafy.worldy.model.game.repo.GameRoomRepo;
import com.ssafy.worldy.model.game.service.GameService;
import com.ssafy.worldy.model.game.service.RedisPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
@Slf4j
public class GameController {

    private final GameRoomRepo gameRoomRepo;
    private final GameService gameService;
    private final RedisPublisher redisPublisher;
    private static final String SUCCESS = "success";

    /**
     * [친구와 같이하는 게임]
     **/
    @GetMapping("/with/friend")
    public ResponseEntity<GameRoom> gameWithFriend() {

        GameRoom gameRoom = gameRoomRepo.createGameRoom();

        return new ResponseEntity<>(gameRoom, HttpStatus.OK);
    }

    /**
     * [게임 종료]
     **/
    @GetMapping("/finish")
    public ResponseEntity<String> gameFinish(@RequestParam String roomId) {

        gameRoomRepo.deleteGameRoom(roomId);

        return new ResponseEntity<>(SUCCESS, HttpStatus.OK);
    }

    /**
     * [게임 정보 저장 & mmr 갱신]
     **/
    @PostMapping("/result")
    public ResponseEntity<String> gameResult(@RequestBody GameResultDto gameResultDto) {

        gameService.gameResult(gameResultDto);

        return new ResponseEntity<>(SUCCESS, HttpStatus.OK);
    }

    /**
     * [게임 매칭 요청 - 소켓 연결]
     **/
    @GetMapping("/matching")
    public ResponseEntity<MatchingWaitingRoom> gameMatching() {
       
        String kakaoId = SecurityContextHolder.getContext().getAuthentication().getName();
        
        // kakaoId로 매칭 서버와 소켓할 방 생성
        MatchingWaitingRoom matchingWaitingRoom = MatchingWaitingRoom.builder().roomId("waiting-"+kakaoId).build();
        return new ResponseEntity<>(matchingWaitingRoom, HttpStatus.OK);
    }

    @PostMapping("/matching/result")
    public ResponseEntity<MatchingResultDto> gameMatching(@RequestBody MatchingResultDto matchingResultDto) {
        log.info("send socket");
        redisPublisher.publish(matchingResultDto);

        return new ResponseEntity<>(matchingResultDto, HttpStatus.OK);
    }
}
