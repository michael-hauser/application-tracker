import React, { useEffect, useState } from 'react';

// Function to extract color codes from the CSS variables
const getCssVariableValue = (variable: string) => {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
};

const parseGradient = (gradient: string) => {
  const colorStops = gradient.match(/#[0-9a-fA-F]{6}/g);
  return colorStops ? Array.from(colorStops) : [];
};

const DEFAULT_COLORS = ["black", "black"];

const SvgDefs: React.FC = () => {
  const [colors, setColors] = useState({
    InitGradient: DEFAULT_COLORS,
    PrimaryGradient1: DEFAULT_COLORS,
    PrimaryGradient2: DEFAULT_COLORS,
    ProgressGradient: DEFAULT_COLORS,
    SuccessGradient: DEFAULT_COLORS,
    WarningGradient: DEFAULT_COLORS,
    ErrorGradient: DEFAULT_COLORS,
  });

  useEffect(() => {
    const initGradientColors = parseGradient(getCssVariableValue('--InitGradient'));
    const primaryGradient1Colors = parseGradient(getCssVariableValue('--PrimaryGradient1'));
    const primaryGradient2Colors = parseGradient(getCssVariableValue('--PrimaryGradient2'));
    const progressGradientColors = parseGradient(getCssVariableValue('--ProgressGradient'));
    const successGradientColors = parseGradient(getCssVariableValue('--SuccessGradient'));
    const warningGradientColors = parseGradient(getCssVariableValue('--WarningGradient'));
    const errorGradientColors = parseGradient(getCssVariableValue('--ErrorGradient'));

    setColors({
      InitGradient: initGradientColors,
      PrimaryGradient1: primaryGradient1Colors,
      PrimaryGradient2: primaryGradient2Colors,
      ProgressGradient: progressGradientColors,
      SuccessGradient: successGradientColors,
      WarningGradient: warningGradientColors,
      ErrorGradient: errorGradientColors,
    });
  }, []);

  return (
    <svg style={{ position: "fixed", visibility: "hidden"}}>
      <defs>
        <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="100%" gradientUnits="userSpaceOnUse">
          <stop offset="10%" stopColor="var(--Primary)" stopOpacity={1} />
          <stop offset="95%" stopColor="var(--Primary)" stopOpacity={0} />
        </linearGradient>

        {colors.InitGradient.length > 0 && (
          <linearGradient id="InitGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.InitGradient[1]} />
            <stop offset="100%" stopColor={colors.InitGradient[0]} />
          </linearGradient>
        )}
        {colors.PrimaryGradient1.length > 0 && (
          <linearGradient id="PrimaryGradient1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.PrimaryGradient1[0]} />
            <stop offset="100%" stopColor={colors.PrimaryGradient1[1]} />
          </linearGradient>
        )}
        {colors.PrimaryGradient2.length > 0 && (
          <linearGradient id="PrimaryGradient2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.PrimaryGradient2[1]} />
            <stop offset="100%" stopColor={colors.PrimaryGradient2[0]} />
          </linearGradient>
        )}
        {colors.ProgressGradient.length > 0 && (
          <linearGradient id="ProgressGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.ProgressGradient[0]} />
            <stop offset="100%" stopColor={colors.ProgressGradient[1]} />
          </linearGradient>
        )}
        {colors.SuccessGradient.length > 0 && (
          <linearGradient id="SuccessGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.SuccessGradient[1]} />
            <stop offset="100%" stopColor={colors.SuccessGradient[0]} />
          </linearGradient>
        )}
        {colors.WarningGradient.length > 0 && (
          <linearGradient id="WarningGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.WarningGradient[0]} />
            <stop offset="100%" stopColor={colors.WarningGradient[1]} />
          </linearGradient>
        )}
        {colors.ErrorGradient.length > 0 && (
          <linearGradient id="ErrorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.ErrorGradient[0]} />
            <stop offset="100%" stopColor={colors.ErrorGradient[1]} />
          </linearGradient>
        )}
      </defs>
    </svg>
  );
};

export default SvgDefs;
