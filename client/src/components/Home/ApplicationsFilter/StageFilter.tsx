import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../state/store';
import { filterApplications } from '../../../state/slices/applicationSlice';
import { Stage } from '../../../models/Stage.model';
import Select from 'react-select';
import { filterStyles, filterTheme } from './filterStyles';

const StageFilter: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const stages = useSelector((state: RootState) => state.application.filterData.stages);
    const selectedStages = useSelector((state: RootState) => state.application.filter.stage);

    // Handle change in multi-select react-select
    const handleStageChange = (selectedOptions: any) => {
        const selectedValues = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
        const selectedStages = stages.filter((stage: Stage) => selectedValues.includes(stage._id));
        dispatch(filterApplications({
            stage: selectedStages
        }));
    };

    // Transform stages data to format expected by react-select
    const stageOptions = stages.map(stage => ({
        value: stage._id,
        label: stage.name
    }));

    return (
        <Select
            isMulti
            styles={filterStyles}
            theme={filterTheme}
            value={selectedStages.map(stage => ({ value: stage._id, label: stage.name }))}
            onChange={handleStageChange}
            options={stageOptions}
            placeholder="Filter by Stage"
        />
    );
};

export default StageFilter;
