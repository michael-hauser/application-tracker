import React, { useEffect } from 'react';
import styles from './Home.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplications, selectApplications } from '../../state/slices/applicationSlice';
import { AppDispatch } from '../../state/store';

const Home = () => {
  const dispatch: AppDispatch = useDispatch();
  const applications = useSelector(selectApplications);

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch])

  const formatSalary = (number: number) => number.toLocaleString('en-US');

  const getBadgeColor = (number: number) =>  {
    switch (number) {
      case 1:
      case 2:
        return styles.init;
      case 3:
      case 4:
        return styles.active;
      case 5:
      case 6:
        return styles.success;
      case 7:
      case 8:
        return styles.fail;
      default:
        return styles.active;
    }
  }

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
        <div className={styles.applicationsData}>
        <div className={styles.tableHead}>
          <div className={styles.tableCell}>Company</div>
          <div className={styles.tableCell}>Role</div>
          <div className={styles.tableCell}>URL</div>
          <div className={styles.tableCell}>Location</div>
          <div className={styles.tableCell}>Salary</div>
          <div className={styles.tableCell}>Stage</div>
          <div className={styles.tableCell}>Rank</div>
        </div>
          {
            applications.map(a =>
              <div className={styles.tableRow}>
                <div className={styles.tableCell}>{a.company}</div>
                <div className={styles.tableCell}>{a.role}</div>
                <div className={styles.tableCell}>{a.url}</div>
                <div className={styles.tableCell}>{a.location}</div>
                <div className={styles.tableCell}>{formatSalary(a.salary ?? 0)}</div>
                <div className={styles.tableCell}>
                  <div className={styles.badge + ' ' + getBadgeColor(a.stage.number)}>{a.stage.name}</div>
                </div>
                <div className={styles.tableCell}>{a.rank}</div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Home;
