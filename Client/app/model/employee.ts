import { Pager } from './pager';
export class Employee {
    employeeId: number;
    firstName: string;
    lastName: string;
    jobTitle: string;
    hireDate: Date;
    department: string;
    email: string;
    created: Date;
    Modified: Date;
}

export class EmployeeList extends Pager
{	
	result: Employee[];
}