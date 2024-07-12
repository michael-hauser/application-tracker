import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../state/store';
import StatsWidget from '../../../lib/StatsWidget/StatsWidget';
import { ResponsiveContainer, BarChart, Bar, Cell, Tooltip } from 'recharts';
import styles from '../ChartStyles.module.scss';
import { Stage, StageType } from '../../../models/Stage.model';
import { Application } from '../../../models/Application.model';
import { setFilterToStage } from '../../../state/slices/applicationSlice';

const ApplicationsStatusChart: React.FC = () => {
    const dispatch = useDispatch();
    const applications = useSelector((state: RootState) => state.application.applications);

    const groups: {
        [key: string]: Application[]
    } = {};

    applications.forEach(a => {
        groups[a.stage.name] = (groups[a.stage.name] || []).concat(a);
    });

    const getStageColorGradient = (stage: Stage) => {
        switch (stage.type) {
            case StageType.Init:
                return "url(#InitGradient)";
            case StageType.Active1:
                return "url(#PrimaryGradient2)";
            case StageType.Active2:
                return "url(#ProgressGradient)";
            case StageType.Pause:
                return "url(#WarningGradient)";
            case StageType.Fail:
                return "url(#ErrorGradient)";
            case StageType.Success:
                return "url(#SuccessGradient)";
            default:
                return 'red';
        }
    };

    const data = Object.entries(groups)
        .map(([name, applications]) => ({
            name,
            value: applications.length,
            svgGradient: getStageColorGradient(applications[0].stage),
            stageNumber: applications[0].stage.number
        }))
        .sort((a, b) => a.stageNumber - b.stageNumber);

    const handleClick = (payload: any) => {
        const stage = applications.find(a => a.stage.name === payload.payload.name)?.stage;
        if(stage === undefined) return;
        dispatch(setFilterToStage(stage));
    }

    return (
        <StatsWidget title='Applications by Status'>
            <div className={styles.chartWrap}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart width={150} height={40} data={data}>
                        <Bar dataKey="value" onClick={(payload) => handleClick(payload)}>
                            {data.map((entry, index) => (
                                <Cell cursor="pointer" fill={entry.svgGradient} key={`cell-${index}`} />
                            ))}
                        </Bar>
                        <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} content={({ active, payload, label }) => {
                            return <div className={styles.tooltip}>
                                <div className={styles.tooltipTitle}>{payload?.[0]?.payload.name}</div>
                                <div className={styles.tooltipValue}>{payload?.[0]?.payload.value}</div>
                            </div>;
                        }} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </StatsWidget>
    );
};

export default ApplicationsStatusChart;