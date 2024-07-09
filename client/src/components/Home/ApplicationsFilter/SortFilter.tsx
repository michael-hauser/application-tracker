import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterApplications, SortOptions } from '../../../state/slices/applicationSlice';
import { AppDispatch, RootState } from '../../../state/store';
import Select from 'react-select';
import { filterStyles } from './filterStyles';

const SortFilter: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const value = useSelector((state: RootState) => state.application.filter.sort);

    // Handle change in single-select react-select
    const handleSortOptionChange = (selectedOption: any) => {
        dispatch(filterApplications({
            sort: selectedOption.value
        }));
    };

    // Options for sorting
    const sortOptions = [
        { value: SortOptions.company, label: 'Company' },
        { value: SortOptions.role, label: 'Role' },
        { value: SortOptions.url, label: 'URL' },
        { value: SortOptions.location, label: 'Location' },
        { value: SortOptions.salary, label: 'Salary' },
        { value: SortOptions.stage, label: 'Stage' },
        { value: SortOptions.rank, label: 'Rank' },
        { value: SortOptions.date, label: 'Date' }
    ];

    
    return (
        <Select
            styles={filterStyles}
            value={value === SortOptions.none ? null : sortOptions.find(option => option.value === value)}
            onChange={handleSortOptionChange}
            options={sortOptions}
            placeholder="Sort by..."
        />
    );
};

export default SortFilter;
