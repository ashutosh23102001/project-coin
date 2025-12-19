import React from 'react';
import Carousel from '../Carousel/Carousel';
import VideoCard from '../Carousel/VideoCard';
import '../Carousel/wid.css'; // Import the shared styles

// Sample data structure for the video grid
const videoData = [
    {
        id: 1,
        title: "Build a Customizable Card Component in ReactJS - Beginner Friendly",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop",
        duration: "18:21",
        channelAvatar: "https://i.pravatar.cc/150?img=1",
        channelName: "Code Complete",
        views: "42K views",
        uploadedTime: "2 years ago"
    },
    {
        id: 2,
        title: "EXPOSED Indian Parents | Pets & Babies | Ft. Childhood",
        thumbnail: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=1000&auto=format&fit=crop",
        duration: "10:18",
        channelAvatar: "https://i.pravatar.cc/150?img=2",
        channelName: "HardToonz",
        views: "2.8M views",
        uploadedTime: "5 days ago"
    },
    {
        id: 3,
        title: "Fa9la - Rehman Dakait Full Song & Dance Video | Baloch Music",
        thumbnail: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000&auto=format&fit=crop",
        duration: "3:18",
        channelAvatar: "https://i.pravatar.cc/150?img=3",
        channelName: "Zair Wania Films",
        views: "5.3M views",
        uploadedTime: "4 days ago"
    },
    // Special Card placement matching the screenshot
    {
        id: 4,
        type: 'special',
        title: "Looking for something different?",
        description: "Get video recommendations beyond what you usually watch",
        buttonText: "New to you"
    },
    {
        id: 5,
        title: "AVATAR 3 FIRE AND ASH : 5 Minute Trailer (4K ULTRA HD)",
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop",
        duration: "5:07",
        channelAvatar: "https://i.pravatar.cc/150?img=8",
        channelName: "FilmSpot Trailer",
        views: "229K views",
        uploadedTime: "2 months ago"
    },
    {
        id: 6,
        title: "React & Next.js Devs ALERT: 2 NEW Server Vulnerabilities Found",
        thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop",
        duration: "6:51",
        channelAvatar: "https://i.pravatar.cc/150?img=12",
        channelName: "Thapa Technical",
        views: "1.6K views",
        uploadedTime: "5 hours ago"
    },
];


function Home() {
  return (
    <div className="App">
      <Carousel />
      
      <main className="main-content">
        <div className="video-grid">
          {videoData.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Home;