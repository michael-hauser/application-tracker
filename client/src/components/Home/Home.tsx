import React, { useEffect } from 'react';
import styles from './Home.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplications, filteredApplications } from '../../state/slices/applicationSlice';
import { AppDispatch } from '../../state/store';
import ApplicationsGrid from './ApplicationsGrid/ApplicationsGrid';
import ApplicationsFilter from './ApplicationsFilter/ApplicationsFilter';

const Home = () => {
  const dispatch: AppDispatch = useDispatch();
  const applications = useSelector(filteredApplications);

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch])

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
        <div className={styles.applicationsFilter}>
          <ApplicationsFilter></ApplicationsFilter>
        </div>
        <div className={styles.applicationsData}>
          <ApplicationsGrid applications={applications}></ApplicationsGrid>
        </div>
      </div>
    </div>
  );
};

export default Home;
