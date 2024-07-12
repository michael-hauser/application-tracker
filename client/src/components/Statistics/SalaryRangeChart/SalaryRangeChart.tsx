import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../state/store';
import StatsWidget from '../../../lib/StatsWidget/StatsWidget';
import { ResponsiveContainer, Tooltip, AreaChart, Area } from 'recharts';
import styles from '../ChartStyles.module.scss';
import { parseSalary } from '../../../utils/parseSalary';
import { openEditorEdit, setSelectedApplication } from '../../../state/slices/applicationSlice';

const SalaryRangeChart: React.FC = () => {
    const dispatch = useDispatch();
    const applications = useSelector((state: RootState) => state.application.applications);

    const data = applications.map(a => ({
        company: a.company,
        role: a.role,
        valueTxt: a.salary,
        value: parseSalary(a.salary),
        id: a._id
    })).sort((a, b) => a.value - b.value);

    const handleClick = (payload: any) => {
        const application = applications.find(a => a._id === payload.activePayload[0].payload.id);
        if(application === undefined) return;
        dispatch(setSelectedApplication(application));
        dispatch(openEditorEdit());
    }

    return (
        <StatsWidget title='Salary Range'>
            <div className={styles.chartWrap}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        width={600}
                        height={400}
                        data={data}
                        onClick={(payload) => handleClick(payload)}
                    >
                        <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} content={({ active, payload, label }) => {
                            return <div className={styles.tooltip}>
                                <div className={styles.tooltipTitle}>{payload?.[0]?.payload.company}</div>
                                <div className={styles.tooltipSubtitle}>{payload?.[0]?.payload.role}</div>
                                <div className={styles.tooltipValue}>{
                                    payload?.[0]?.payload.valueTxt
                                }</div>
                            </div>;
                        }} />
                        <Area cursor={"pointer"} type="monotone" dataKey="value" stroke="var(--Primary)" fill="url(#chartGradient)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </StatsWidget>
    );
};

export default SalaryRangeChart;