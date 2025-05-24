package com.connectverse.connectverse.service;

import com.connectverse.connectverse.Dto.ProfileDto;
import com.connectverse.connectverse.Dto.TweetDto;
import com.connectverse.connectverse.Dto.TweetResponseDto;
import com.connectverse.connectverse.Repository.TweetRepository;
import com.connectverse.connectverse.model.Post;
import com.connectverse.connectverse.model.Profile;
import com.connectverse.connectverse.model.Tweet;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TweetService {
    @Autowired
    private TweetRepository tweetRepository;

    public List<TweetResponseDto> getAllTweets() {
        List<Tweet> tweets = tweetRepository.findAll();
        return tweets.stream().map(this::convertToTweetResponseDto).collect(Collectors.toList());
    }

    private TweetResponseDto convertToTweetResponseDto(Tweet tweet) {
        return TweetResponseDto.builder()
                .tweetId(tweet.getTweet_id())
                .message(tweet.getMessage())
                .imageUrl(tweet.getImageUrl())
                .videoUrl(tweet.getVideoUrl())
                .createdAt(tweet.getCreatedAt())
                .updatedAt(tweet.getUpdatedAt())
                .likesCount(tweet.getLikesCount())
                .userId(tweet.getUser().getId()) // Map user_id explicitly
                .likes(tweet.getLikes().stream()
                        .map(like -> like.getUser().getUsername()) // Assuming `Like` has a `User` field
                        .collect(Collectors.toList()))
                .comments(tweet.getComments().stream()
                        .map(comment -> comment.getContent()) // Assuming `Comment` has a `content` field
                        .collect(Collectors.toList()))
                .build();
    }

    public String addTweet(Tweet tweet) {
        try {
            tweetRepository.save(tweet);
            return "tweet saved successfully";
        } catch (Exception e) {
            return "Failed to save tweet: " + e.getMessage();
        }
    }

    public TweetDto getTweetById(Integer tweetId) {
        Tweet tweet = tweetRepository.findById(tweetId)
                .orElseThrow(() -> new RuntimeException("Tweet not found"));

        TweetDto tweetDto = convertToDto(tweet);
        return tweetDto;
    }

    private TweetDto convertToDto(Tweet tweet) {
        return TweetDto.builder()
                .id(tweet.getTweet_id())
                .message(tweet.getMessage())
                .imageUrl(tweet.getImageUrl())
                .videoUrl(tweet.getVideoUrl())
                .build();
    }

    public List<TweetDto> getAllTweetsForUser(Long userId) {
        List<Tweet> tweets = tweetRepository.findByUserId(userId);
        if (tweets.isEmpty()) {
            throw new RuntimeException("No tweets found for user with ID: " + userId);
        }
        return convertToDtoList(tweets);
    }

    private List<TweetDto> convertToDtoList(List<Tweet> tweets) {
        return tweets.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public void deleteTweet(Integer tweetId) {
        tweetRepository.deleteById(tweetId);
    }
}
