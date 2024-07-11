import React, { useEffect } from 'react';
import styles from './Home.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplications } from '../../state/slices/applicationSlice';
import { AppDispatch, RootState } from '../../state/store';
import ApplicationsGrid from './ApplicationsGrid/ApplicationsGrid';
import ApplicationsFilter from './ApplicationsFilter/ApplicationsFilter';
import { openEditorAdd } from '../../state/slices/applicationSlice';
import ApplicationEditor from '../ApplicationEditor/ApplicationEditor';
import Sidebar from '../../lib/sidebar/Sidebar';
import Icon from '../../lib/icon/Icon';
import TotalApplicationsChart from '../Statistics/TotalApplicationsChart/TotalApplicationsChart';
import StatsWidget from '../../lib/StatsWidget/StatsWidget';

const Home = () => {
    const dispatch: AppDispatch = useDispatch();
    const editorMode = useSelector((state: RootState) => state.application.editorMode);

    useEffect(() => {
        dispatch(fetchApplications());
    }, [dispatch]);

    const handleAddApplication = () => {
        dispatch(openEditorAdd());
    };

    return (
        <div className={styles.home}>
            <div className={styles.charts}>
                <div className={styles.chart}><StatsWidget title='Applications by Status'><></></StatsWidget></div>
                <div className={styles.chart}><TotalApplicationsChart /></div>
                <div className={styles.chart}><StatsWidget title='Salary Range'><></></StatsWidget></div>
            </div>
            <div className={styles.applicationsWrap}>
                <div className={styles.applicationsHeader}>
                    <h2>All Applications</h2>
                    <button className='primary-button' onClick={handleAddApplication}>
                      <Icon icon='add'  />
                      New Application
                    </button>
                </div>
                <div className={styles.applicationsFilter}>
                    <ApplicationsFilter />
                </div>
                <div className={styles.applicationsData}>
                    <ApplicationsGrid />
                </div>
            </div>
            
            {editorMode === 'add' ? <Sidebar><ApplicationEditor /></Sidebar> : null}
        </div>
    );
};

export default Home;
