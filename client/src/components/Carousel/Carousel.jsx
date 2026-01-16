import React, { useState, useEffect } from 'react';
import easyTaskImg from "../assets/easytask.png?q=80&w=2070&auto=format&fit=crop";

const carouselData = [
    { 
        id: 1, 
        img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop", 
        title: "Future of Tech 2025", 
        caption: "Explore the latest in React, AI, and Web Development.", 
        button: "Watch Now" 
    },
    { 
        id: 2, 
        img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop", 
        title: "Top Music Hits", 
        caption: "Listen to the trending tracks from around the world.", 
        button: "Listen" 
    },
    { 
        id: 3, 
        img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop", 
        title: "New Movie Trailers", 
        caption: "Catch up on the latest teasers and trailers.", 
        button: "View All" 
        
    },
    
    { 
        id: 4, 
        img: easyTaskImg,
        title: "Easy task", 
        caption: "Simple tasks, Big Rewards", 
        button: "View All" 
        
    },
];

const Carousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prevIndex) => 
            (prevIndex === carouselData.length - 1 ? 0 : prevIndex + 1)
        );
    };

    const prevSlide = () => {
        setCurrentSlide((prevIndex) => 
            (prevIndex === 0 ? carouselData.length - 1 : prevIndex - 1)
        );
    };

    // Auto-scroll effect
    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval); // Cleanup function
    }, []);

    return (
        <section className="carousel-container">
            {carouselData.map((slide, index) => (
                <div 
                    key={slide.id} 
                    className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                >
                    <img src={slide.img} alt={slide.title} />
                    <div className="carousel-caption">
                        <h2>{slide.title}</h2>
                        <p>{slide.caption}</p>
                        <button className="carousel-btn">{slide.button}</button>
                    </div>
                </div>
            ))}

            <a className="prev" onClick={prevSlide}>&#10094;</a>
            <a className="next" onClick={nextSlide}>&#10095;</a>
        </section>
    );
};

export default Carousel;