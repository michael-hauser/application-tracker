import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './InfoBanner.module.scss';

const InfoBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        // Check local storage to see if the user has already dismissed the banner
        const bannerDismissed = localStorage.getItem('alphaBannerDismissed');
        if (!bannerDismissed) {
            setIsVisible(true);
        }
    }, []);

    const handleDismiss = () => {
        // Mark the banner as dismissed in local storage
        localStorage.setItem('alphaBannerDismissed', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className={styles.banner}>
            This is an alpha release. For more details, please visit our&nbsp;<Link to="/license">license page</Link>.
            <button className={'primary-button inverted'} onClick={handleDismiss}>Dismiss</button>
        </div>
    );
};

export default InfoBanner;
