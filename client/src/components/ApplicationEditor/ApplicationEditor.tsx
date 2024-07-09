import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './ApplicationEditor.module.scss';
import { AppDispatch, RootState } from '../../state/store';
import { Application } from '../../models/Application.model';
import { updateApplication } from '../../state/slices/applicationSlice';

const ApplicationEditor: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const selectedApplication = useSelector((state: RootState) => state.application.selectedApplication);

    const [applicationData, setApplicationData] = useState<Application | null>(null);

    useEffect(() => {
        if (selectedApplication) {
            setApplicationData(selectedApplication);
        }
    }, [selectedApplication]);

    if (!applicationData) {
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setApplicationData({
            ...applicationData,
            [name]: value,
        });
    };

    const handleSave = () => {
        if (applicationData) {
            dispatch(updateApplication(applicationData));
        }
    };

    return (
        <div className={styles.applicationEditor}>
            <h1>Edit Application</h1>
            <div className={styles.formGroup}>
                <label>Company</label>
                <input
                    type="text"
                    name="company"
                    value={applicationData.company}
                    onChange={handleChange}
                />
            </div>
            <div className={styles.formGroup}>
                <label>Role</label>
                <input
                    type="text"
                    name="role"
                    value={applicationData.role}
                    onChange={handleChange}
                />
            </div>
            <div className={styles.formGroup}>
                <label>URL</label>
                <input
                    type="text"
                    name="url"
                    value={applicationData.url}
                    onChange={handleChange}
                />
            </div>
            <div className={styles.formGroup}>
                <label>Location</label>
                <input
                    type="text"
                    name="location"
                    value={applicationData.location}
                    onChange={handleChange}
                />
            </div>
            <div className={styles.formGroup}>
                <label>Salary</label>
                <input
                    type="number"
                    name="salary"
                    value={applicationData.salary || ''}
                    onChange={handleChange}
                />
            </div>
            <div className={styles.formGroup}>
                <label>Stage</label>
                <input
                    type="text"
                    name="stage"
                    value={applicationData.stage.name}
                    onChange={handleChange}
                />
            </div>
            <div className={styles.formGroup}>
                <label>Rank</label>
                <input
                    type="number"
                    name="rank"
                    value={applicationData.rank}
                    onChange={handleChange}
                />
            </div>
            <div className={styles.footer}>
                <button className="secondary-button" onClick={handleSave}>Cancel</button>
                <button className="primary-button" onClick={handleSave}>Save</button>
            </div>
        </div>
    );
};

export default ApplicationEditor;
