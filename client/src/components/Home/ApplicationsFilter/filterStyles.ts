import { StylesConfig, Theme, ThemeConfig } from "react-select";

export const inputStyles = {
    borderRadius: 'var(--border-radius)',
    height: 'var(--input-height)',
    backgroundColor: 'transparent',
    color: 'var(--Font)',
    inactiveColor: 'var(--FontShaded)',
    borderColor: 'transparent',
    minWidth: '150px',
}

export const filterStyles: StylesConfig = {
    control: (base) => ({
        ...base,
        ...inputStyles
    })
};

export const filterTheme: any = (theme: ThemeConfig) => ({
    ...theme,
    borderRadius: 'var(--border-radius)',
    colors: {
        ...(theme as Theme).colors,
        primary: 'var(--Primary)',
        primary75: 'var(--Primary)',
        primary50: 'var(--Primary)',
        primary25: 'var(--Primary05)',
        neutral0: 'var(--Background)',
        neutral20: 'transparent',
        neutral30: 'var(--Gray10)',
        neutral40: 'transparent',
        neutral50: 'var(--FontShaded)',
    },
})