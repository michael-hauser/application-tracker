import React, { useState } from 'react';
import styles from './ApplicationsGrid.module.scss';
import { Stage, StageType } from '../../../models/Stage.model';
import { Application } from '../../../models/Application.model';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedApplication } from '../../../state/slices/applicationSlice';
import { RootState } from '../../../state/store';
import ApplicationEditor from '../../ApplicationEditor/ApplicationEditor';

const ApplicationsGrid = ({ applications }: { applications: Application[] }) => {
    const dispatch = useDispatch();
    const selectedApplication = useSelector((state: RootState) => state.application.selectedApplication);

    const formatSalary = (number: number) => number.toLocaleString('en-US');

    const getBadgeColor = (stage: Stage) => {
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
        }
    };

    const handleRowClick = (application: Application) => {
        dispatch(setSelectedApplication(application));
    };

    return (
        <div className={styles.applicationsGridContainer}>
            <div className={styles.applicationsGrid}>
                <div className={styles.tableHead}>
                    <div className={styles.tableCell}>Company</div>
                    <div className={styles.tableCell}>Role</div>
                    <div className={styles.tableCell}>URL</div>
                    <div className={styles.tableCell}>Location</div>
                    <div className={styles.tableCell}>Salary</div>
                    <div className={styles.tableCell}>Stage</div>
                    <div className={styles.tableCell}>Rank</div>
                </div>
                {applications.map((a) => (
                    <div
                        key={`key-${a._id}`}
                        className={styles.tableRow}
                        onClick={() => handleRowClick(a)}
                    >
                        <div className={styles.tableCell}>{a.company}</div>
                        <div className={styles.tableCell}>{a.role}</div>
                        <div className={styles.tableCell}>{a.url}</div>
                        <div className={styles.tableCell}>{a.location}</div>
                        <div className={styles.tableCell}>{formatSalary(a.salary ?? 0)}</div>
                        <div className={styles.tableCell}>
                            <div className={styles.badge + ' ' + getBadgeColor(a.stage)}>{a.stage.name}</div>
                        </div>
                        <div className={styles.tableCell}>{a.rank}</div>
                    </div>
                ))}
            </div>
            {selectedApplication && (
                <div className={styles.overlay}>
                    <div className={styles.sidebar}>
                        <ApplicationEditor />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicationsGrid;
