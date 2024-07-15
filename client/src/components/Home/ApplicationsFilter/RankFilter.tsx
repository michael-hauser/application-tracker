import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../state/store';
import { filterApplications } from '../../../state/slices/applicationSlice';
import Select from 'react-select';
import { filterStyles, filterTheme } from './filterStyles';

const RankFilter: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const ranks = useSelector((state: RootState) => state.application.filterData.ranks);
    const selectedRanks = useSelector((state: RootState) => state.application.filter.rank);

    // Handle change in multi-select react-select
    const handleRankChange = (selectedOptions: any) => {
        const selectedValues = selectedOptions ? selectedOptions.map((option: any) => parseInt(option.value)) : [];
        dispatch(filterApplications({
            rank: selectedValues
        }));
    };

    // Transform ranks data to format expected by react-select
    const rankOptions = ranks.map(rank => ({
        value: rank.toString(),
        label: rank.toString()
    }));

    return (
        <Select
            isMulti
            styles={filterStyles}
            theme={filterTheme}
            value={selectedRanks.map(rank => ({ value: rank.toString(), label: rank.toString() }))}
            onChange={handleRankChange}
            options={rankOptions}
            placeholder="Filter by Rank"
        />
    );
};

export default RankFilter;
