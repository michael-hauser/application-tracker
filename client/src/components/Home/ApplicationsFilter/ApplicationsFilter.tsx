import React from 'react';
import styles from './ApplicationsFilter.module.scss';
import LocationFilter from './LocationFilter';
import StageFilter from './StageFilter';
import RankFilter from './RankFilter';
import SearchFilter from './SearchFilter';
import SortFilter from './SortFilter';
import { AppDispatch } from '../../../state/store';
import { useDispatch } from 'react-redux';
import { resetFilter } from '../../../state/slices/applicationSlice';

const ApplicationsFilter: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();

    // Function to reset filters
    const reset = () => {
        dispatch(resetFilter());
    };

    return (
        <div className={styles.applicationsFilter}>
            <SearchFilter/>
            <LocationFilter />
            <StageFilter />
            <RankFilter />
            <SortFilter />
            <button className='secondary-button' onClick={reset}>Reset Filters</button>
        </div>
    );
};

export default ApplicationsFilter;

