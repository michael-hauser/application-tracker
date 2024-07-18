import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import styles from './ApplicationEditor.module.scss';
import { AppDispatch, RootState } from '../../state/store';
import { Application } from '../../models/Application.model';
import { addApplication, closeEditor, deleteApplication, updateApplication } from '../../state/slices/applicationSlice';
import { fetchStagesIfNeeded, selectStages } from '../../state/slices/stageSlice';
import { Stage } from '../../models/Stage.model';
import Progress from '../../lib/progress/Progress';

const ApplicationEditor: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const selectedApplication = useSelector((state: RootState) => state.application.selectedApplication);
    const error = useSelector((state: RootState) => state.application.error);
    const stages = useSelector(selectStages);
    const mode = useSelector((state: RootState) => state.application.editorMode);

    const [applicationData, setApplicationData] = useState<Application | null>(null);
    const [isDirty, setIsDirty] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if(stages.length === 0) dispatch(fetchStagesIfNeeded());

        if (selectedApplication) {
            setApplicationData(selectedApplication);
        } else if (mode === 'add' && stages.length > 0) {
            setApplicationData({
                _id: '',
                company: '',
                role: '',
                url: '',
                location: '',
                salary: undefined,
                stage: stages[0], // Default to the first stage
                rank: 0,
                user: '',
                dateModified: new Date(),
                dateCreated: new Date(),
            });
        }
    }, [selectedApplication, mode, dispatch, stages]);

    if (!applicationData) {
        return <div className={styles.applicationEditor}>Loading...</div>;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setApplicationData({
            ...applicationData,
            [name]: value,
        });
        setIsDirty(true);
    };

    const handleStageChange = (selectedOption: any) => {
        setApplicationData({
            ...applicationData,
            stage: (stages.find(stage => stage._id === selectedOption.value) || applicationData.stage) as Stage,
        });
        setIsDirty(true);
    };

    const  handleSave = async () => {
        let result;
        setIsSaving(true);

        if (applicationData && mode === 'edit' && isDirty) {
            result = await dispatch(updateApplication(applicationData));
        } else if (applicationData && mode === 'add') {
            result = await dispatch(addApplication(applicationData))
        } else return;

        if (updateApplication.fulfilled.match(result)) {
            setIsDirty(false);
            setIsSaving(false);
            dispatch(closeEditor());
        } else {
            setIsSaving(false);
        }
    };

    const handleDelete = () => {
        const confirmMessage = `Are you sure you want to delete ${applicationData?.company} - ${applicationData?.role}?`;
        if (applicationData && window.confirm(confirmMessage)) {
            setIsDeleting(true);
            dispatch(deleteApplication(applicationData._id)).then(() => {
                setIsDeleting(false);
                dispatch(closeEditor())
            });
        }
    }

    const handleClose = () => {
        setIsDirty(false);
        dispatch(closeEditor());
    }

    const stageOptions = stages.map(stage => ({
        value: stage._id,
        label: stage.name,
    }));

    return (
        <div className={styles.applicationEditor}>
            <h1>{mode === 'add' ? 'Add Application' : 'Edit Application'}</h1>
            {error && <div className={styles.error}>{error}</div>}
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
                    type="text"
                    name="salary"
                    value={applicationData.salary || ''}
                    onChange={handleChange}
                />
            </div>
            <div className={styles.formGroup}>
                <label>Stage</label>
                <Select
                    value={stageOptions.find(option => option.value === applicationData.stage._id)}
                    onChange={handleStageChange}
                    options={stageOptions}
                />
            </div>
            <div className={styles.formGroup}>
                <label>Rank</label>
                <input
                    type="number"
                    name="rank"
                    min={1}
                    max={5}
                    value={applicationData.rank}
                    onChange={handleChange}
                />
            </div>
            <div className={styles.formGroup}>
                <label>Comments</label>
                <textarea
                    name="comments"
                    value={applicationData.comments || ''}
                    onChange={handleChange}
                />
            </div>
            <div className={styles.footer}>
                {mode === 'edit' && (
                    <button className="danger-button" onClick={handleDelete}>
                        {isDeleting && <Progress />}
                        Delete
                    </button>
                )}
                <div className={styles.spacer}></div>
                <button className="secondary-button" onClick={handleClose}>
                    Cancel
                </button>
                <button className="primary-button" disabled={!isDirty} onClick={handleSave}>
                    {isSaving && <Progress />}
                    Save
                </button>
            </div>
        </div>
    );
};

export default ApplicationEditor;
