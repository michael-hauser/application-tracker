import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../state/store';
import { filterApplications } from '../../../state/slices/applicationSlice';
import Select from 'react-select';
import { filterStyles } from './filterStyles';

const LocationFilter: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const locations = useSelector((state: RootState) => state.application.filterData.locations);
    const selectedLocations = useSelector((state: RootState) => state.application.filter.location);

    // Handle change in multi-select react-select
    const handleLocationChange = (selectedOptions: any) => {
        const selectedValues = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
        dispatch(filterApplications({
            location: selectedValues
        }));
    };

    // Transform locations data to format expected by react-select
    const locationOptions = locations.map(location => ({
        value: location,
        label: location
    }));

    return (
        <Select
            isMulti
            styles={filterStyles}
            value={selectedLocations.map(location => ({ value: location, label: location }))}
            onChange={handleLocationChange}
            options={locationOptions}
            placeholder="Filter by Location"
        />
    );
};

export default LocationFilter;
