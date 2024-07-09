import { StylesConfig } from "react-select";

export const inputStyles = {
    borderRadius: 'var(--border-radius)',
    height: 'var(--input-height)',
}

export const filterStyles: StylesConfig = {
    control: (base) => ({
        ...base,
        ...inputStyles
    })
};