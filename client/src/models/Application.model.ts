import { Stage } from "./Stage.model";

export interface Application {
    _id: string;
    company: string;
    role: string;
    url: string;
    location: string;
    salary?: string;
    stage: Stage; 
    rank: number;
    dateCreated: Date;
    dateModified: Date;
    dateApplied?: Date;
    user: string;
    comments?: string;
}
