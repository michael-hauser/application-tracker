import React from 'react';
import styles from './PageNotFound.module.scss';
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <h1>Page Not Found</h1>
            <div>Oops! The page you're looking for does not exist.</div>
            <button className='primary-button inverted' onClick={() => navigate('/')}>Take me back home!</button>
        </div>
    );
};

export default PageNotFound;