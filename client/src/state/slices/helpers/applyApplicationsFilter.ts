import { Application } from "../../../models/Application.model";
import { ApplicationsFilter } from "../applicationSlice";

const parseSalary = (salary: string | undefined) => {
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

// Helper function to apply filter
export const applyApplicationsFilter = (filter: Partial<ApplicationsFilter>, applications: Application[]) => {
  const filterStages = filter.stage?.map(stage => stage._id) || [];
  let filteredApplications = applications.filter(application => {
    const matchesSearch = filter.search
      ? (
        application.company.toLowerCase().includes(filter.search.toLowerCase()) ||
        application.role.toLowerCase().includes(filter.search.toLowerCase())
      )
      : true;
    const matchesLocation = filter.location?.length ? filter.location.includes(application.location) : true;
    const matchesStage = filter.stage?.length ? filterStages.includes(application.stage._id) : true;
    const matchesRank = filter.rank?.length ? filter.rank.includes(application.rank) : true;
    return matchesSearch && matchesLocation && matchesStage && matchesRank;
  });

  // Sorting
  if (filter.sort) {
    filteredApplications.sort((a, b) => {
      switch (filter.sort) {
        case 'company':
          return a.company.localeCompare(b.company);
        case 'role':
          return a.role.localeCompare(b.role);
        case 'url':
          return a.url.localeCompare(b.url);
        case 'location':
          return a.location.localeCompare(b.location);
        case 'stage':
          return a.stage.name.localeCompare(b.stage.name);
        case 'salary':
          const aSalary = parseSalary(a.salary);
          const bSalary = parseSalary(b.salary);
          return bSalary - aSalary;
        case 'rank':
          return a.rank - b.rank;
        case 'date':
          return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime();
        default:
          return 0;
      }
    });
  }

  return filteredApplications;
}
