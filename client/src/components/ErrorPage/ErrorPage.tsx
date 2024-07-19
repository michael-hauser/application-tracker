import React from 'react';
import styles from './ErrorPage.module.scss';

const ErrorPage = () => {
    return (
        <div className={styles.container}>
            <h1>Oops, something went wrong!</h1>
            <div>Please click this button to go back and continue:</div>
            <button className='primary-button inverted' onClick={() => 
                    document.location.href = '/'
            }>Take me back home!</button>
        </div>
    );
};

export default ErrorPage;