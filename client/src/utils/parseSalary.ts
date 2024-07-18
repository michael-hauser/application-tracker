export const parseSalary = (salary: string | undefined): number => {
    const containsNoNumbers = !/\d/.test(salary || '');
    if (!salary || containsNoNumbers) return 0;

    const isHourly = (value: string) => /\/?hr$|\/?h$/i.test(value);
    const toAnnual = (hourly: number) => hourly * 40 * 52;

    const parseValue = (value: string): number => {
        value = value.replace(/[$,/yr]/g, '').toLowerCase().trim();
        if (value.endsWith('k')) value = (parseFloat(value) * 1000).toString();
        return parseFloat(value);
    };

    const parseRange = (value: string): number => {
        const [min, max] = value.split('-').map(parseValue);
        return (min + max) / 2;
    };

    if (salary.includes('-')) {
        const rangeAverage = parseRange(salary);
        return isHourly(salary) ? toAnnual(rangeAverage) : rangeAverage;
    }

    const value = parseValue(salary);
    return isHourly(salary) ? toAnnual(value) : value;
};
