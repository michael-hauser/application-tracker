import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterApplications } from '../../../state/slices/applicationSlice';
import { AppDispatch, RootState } from '../../../state/store';
import { debounce } from 'lodash';
import { inputStyles } from './filterStyles';
import Icon from '../../../lib/icon/Icon';

const SearchFilter: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const [searchInput, setSearchInput] = useState('');
    const filterSearch = useSelector((state: RootState) => state.application.filter.search);

    // Update search input when filterSearch changes
    useEffect(() => {
        setSearchInput(filterSearch);
    }, [filterSearch]);

    // Debounced function with lodash debounce
    const debouncedDispatch = useCallback(
        debounce((searchValue: string) => {
            dispatch(filterApplications({ search: searchValue }));
        }, 500),
        [dispatch]
    );

    // Handle search input change
    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchInput(value);
        debouncedDispatch(value);
    };


    return (
        <div>
            <input
                style={{
                    ...inputStyles,
                    width: '250px',
                }}
                type="text"
                value={searchInput}
                onChange={handleSearchInputChange}
                placeholder="Search..."
            />
        </div>
    );
};

export default SearchFilter;
