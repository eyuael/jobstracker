export interface User {
    id: string;
    email: string;
}

export interface JobApplication {
    id: string;
    userId: string;
    jobTitle: string;
    company: string;
    salary: string;
    applied: boolean;
    interview: boolean;
    offer: boolean;
    createdAt: Date;
    updatedAt: Date;
}