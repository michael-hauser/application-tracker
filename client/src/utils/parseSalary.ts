export const parseSalary = (salary: string | undefined) => {
  if (!salary) return 0;

  // Remove non-numeric characters except for range indicators
  const cleaned = salary.replace(/[^\d\-.kK]/g, '');

  // Split ranges
  const parts = cleaned.split(/[-–]/).map(part => part.trim());

  // Convert parts to numbers
  const values = parts.map(part => {
    if (part.toLowerCase().includes('k')) {
      return parseFloat(part) * 1000;
    }
    return parseFloat(part);
  });

  // Return the average if range, otherwise the single value
  if (values.length === 2) {
    return (values[0] + values[1]) / 2;
  }

  return values[0] || 0;
};
