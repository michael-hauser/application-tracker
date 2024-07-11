import { ApplicationState, Statistics } from '../applicationSlice';

export const updateStatistics: (state: ApplicationState) => Statistics = (state: ApplicationState) => {
    return {
        totalApplications: state.applications.length
    };
}