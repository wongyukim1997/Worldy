package com.ssafy.worldy.model.game.dto;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class Emoticon {
    private String type;
    private String emoticon;
    private String roomId;
    private String kakaoId;
}
