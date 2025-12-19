import React from 'react';

const VideoCard = ({ video }) => {
    // Check if this is the special "New to you" card
    if (video.type === 'special') {
        return (
            <div className="special-card-wrapper">
                <div className="special-card">
                    <h3 style={{ marginBottom: '10px' }}>{video.title}</h3>
                    <p style={{ color: '#aaa', fontSize: '14px' }}>{video.description}</p>
                    <button className="special-btn">{video.buttonText}</button>
                </div>
            </div>
        );
    }

    // Standard Video Card
    return (
        <div className="video-card">
            <div className="thumbnail-container">
                <img src={video.thumbnail} className="thumbnail-image" alt={video.title} />
                <span className="duration">{video.duration}</span>
            </div>
            <div className="video-info">
                <img src={video.channelAvatar} className="channel-avatar" alt={video.channelName} />
                <div className="video-details">
                    <div className="video-title">{video.title}</div>
                    <div className="channel-name">{video.channelName}</div>
                    <div className="video-meta">{video.views} • {video.uploadedTime}</div>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;