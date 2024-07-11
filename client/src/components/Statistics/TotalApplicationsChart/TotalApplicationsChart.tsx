import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../state/store';
import StatsWidget from '../../../lib/StatsWidget/StatsWidget';
import styles from './TotalApplicationsChart.module.scss';

const TotalApplicationsChart: React.FC = () => {
    const totalApplications = useSelector((state: RootState) => state.application.statistics.totalApplications);

    return (
        <StatsWidget title='Total Applications'>
            <div className={styles.number}>{totalApplications}</div>
        </StatsWidget>
    );
};

export default TotalApplicationsChart;