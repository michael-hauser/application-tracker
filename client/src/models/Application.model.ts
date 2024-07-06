export interface Application {
    id: string;
    company: string;
    role: string;
    url: string;
    location: string;
    salary?: number;
    stage: string; 
    rank?: number;
    dateCreated: Date;
    dateModified: Date;
    dateApplied?: Date;
    user: string;
}
