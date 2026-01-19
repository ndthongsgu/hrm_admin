import type { BaseDto } from "./base.dto";
import type { CustomerDto } from "./customer.dto";
import type { EmployeeDto } from "./employee.dto";
import type { RoleDto } from "./role.dto";

export interface UserDto extends BaseDto {
  userId: number;
  userUuid: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  roles: RoleUserDto[];
  customer: CustomerDto;
  employee: EmployeeDto;
}

export interface RoleUserDto {
  id: number;
  role: RoleDto;
  isActive: boolean;
}

export interface UserFilter {
  name?: string;
  email?: string;
  phoneNumber?: string;
  includeRoles?: string[];
  excludeRoles?: string[];
  active?: boolean;
}

export interface UserCreateUpdateDto {
  fullName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  isActive?: boolean;
  roleIds: number[];
}

export interface UserPageRequest extends UserFilter {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface UserSelectDto {
  id: string;
  username: string;
}
