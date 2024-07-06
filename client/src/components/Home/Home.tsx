import React from 'react';
import styles from './Home.module.scss';

const Home = () => {
  return (
    <div className={styles.home}>
      <div className={styles.charts}>
        <div className={styles.chart}></div>
        <div className={styles.chart}></div>
        <div className={styles.chart}></div>
      </div>
      <div className={styles.applicationsWrap}>
        <div className={styles.applicationsHeader}>
          <h2>All Applications</h2>
        </div>
        <div className={styles.applicationsFilter}></div>
        <div className={styles.applicationsData}></div>
      </div>
    </div>
  );
};

export default Home;
