import { Stage } from "./Stage.model";

export interface Application {
    id: string;
    company: string;
    role: string;
    url: string;
    location: string;
    salary?: number;
    stage: Stage; 
    rank?: number;
    dateCreated: Date;
    dateModified: Date;
    dateApplied?: Date;
    user: string;
}
