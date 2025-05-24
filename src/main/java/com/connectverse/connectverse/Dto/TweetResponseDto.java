package com.connectverse.connectverse.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TweetResponseDto {
    private Integer tweetId;
    private String message;
    private String imageUrl;
    private String videoUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int likesCount;
    private Integer userId;
    private List<String> likes; // List of user IDs or usernames who liked the tweet
    private List<String> comments; // List of comment contents
}