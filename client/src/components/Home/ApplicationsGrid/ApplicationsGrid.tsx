import React from 'react';
import styles from './ApplicationsGrid.module.scss';
import { Stage, StageType } from '../../../models/Stage.model';
import { Application } from '../../../models/Application.model';
import { useDispatch, useSelector } from 'react-redux';
import { openEditorEdit, setSelectedApplication } from '../../../state/slices/applicationSlice';
import { RootState } from '../../../state/store';
import ApplicationEditor from '../../ApplicationEditor/ApplicationEditor';
import Sidebar from '../../../lib/sidebar/Sidebar';

const ApplicationsGrid = () => {
    const dispatch = useDispatch();
    const editorMode = useSelector((state: RootState) => state.application.editorMode);
    const applications = useSelector((state: RootState) => state.application.filteredApplications);

    const getStageColor = (stage: Stage) => {
        switch (stage.type) {
            case StageType.Init:
                return styles.init;
            case StageType.Active1:
                return styles.active1;
            case StageType.Active2:
                return styles.active2;
            case StageType.Pause:
                return styles.pause;
            case StageType.Fail:
                return styles.fail;
            case StageType.Success:
                return styles.success;
            default:
                return '';
        }
    };

    const handleRowClick = (application: Application) => {
        dispatch(setSelectedApplication(application));
        dispatch(openEditorEdit());
    };

    return (
        <div className={styles.applicationsGridContainer}>
            <div className={styles.applicationsGrid}>
                <div className={styles.tableHead}>
                    <div className={styles.tableCell}>Company</div>
                    <div className={styles.tableCell}>Role</div>
                    <div className={`${styles.tableCell} ${styles.hideOnMobile}`}>URL</div>
                    <div className={`${styles.tableCell} ${styles.hideOnMobile}`}>Location</div>
                    <div className={`${styles.tableCell} ${styles.hideOnMobile}`}>Salary</div>
                    <div className={styles.tableCell}>Stage</div>
                    <div className={`${styles.tableCell} ${styles.hideOnMobile}`}>Rank</div>
                </div>
                {applications.map((a) => (
                    <div
                        key={`key-${a._id}`}
                        className={styles.tableRow}
                        onClick={() => handleRowClick(a)}
                    >
                        <div className={styles.tableCell}>{a.company}</div>
                        <div className={styles.tableCell}>{a.role}</div>
                        <div className={`${styles.tableCell} ${styles.hideOnMobile}`}>{a.url}</div>
                        <div className={`${styles.tableCell} ${styles.hideOnMobile}`}>{a.location}</div>
                        <div className={`${styles.tableCell} ${styles.hideOnMobile}`}>{a.salary}</div>
                        <div className={styles.tableCell}>
                            <div className={styles.badge + ' ' + getStageColor(a.stage)}>{a.stage.name}</div>
                        </div>
                        <div className={`${styles.tableCell} ${styles.hideOnMobile}`}>{a.rank}</div>
                    </div>
                ))}
            </div>

            {editorMode === 'edit' ? <Sidebar><ApplicationEditor /></Sidebar> : null}
        </div>
    );
};

export default ApplicationsGrid;
