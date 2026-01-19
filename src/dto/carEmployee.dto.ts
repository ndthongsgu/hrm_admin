import type { EmployeeDto } from "@/dto/employee.dto";

export interface CarEmployeeDto {
  id: string;
  car: {
    id: string;
    licensePlate: string;
  };
  employee: EmployeeDto;
  role?: string;
  createdDate?: string;
  updatedDate?: string;
}

export interface CarEmployeeFilter {
  carId?: string;
  employeeId?: string;
}

export interface CarEmployeeCreateUpdateDto {
  carId: string;
  employeeId: string;
  role?: string;
}

export interface CarEmployeePageRequest extends CarEmployeeFilter {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}
