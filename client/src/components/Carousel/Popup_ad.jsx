import React from 'react';
import '../Popup_ad.css';

const FullScreenPopup = ({ isVisible, onClose, children }) => {
    if (!isVisible) {
        return null;
    }

    return (
        <div className="popup-overlay" onClick={onClose}>
            {/* The content container prevents clicks inside the modal 
                from accidentally closing it. */}
            <div 
                className="popup-content" 
                onClick={(e) => e.stopPropagation()}
            >
                <button className="popup-close-btn" onClick={onClose}>
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
};

export default FullScreenPopup;