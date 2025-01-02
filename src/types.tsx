export interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  salary: string;
  applied: boolean;
  interview: boolean;
  offer: boolean;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface User {
    email: string;
    id: string;
  }
  
  
  