import type { BaseDto } from "./base.dto";
import type { RoleDto } from "./role.dto";

export interface UserDto extends BaseDto {
  username: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  isActive: boolean;
  roles: RoleDto[];
  employeeId?: string;
}

export interface UserFilter {
  username?: string;
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  isActive?: boolean;
  roleIds?: string[];
}

export interface UserCreateDto {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  phoneNumber?: string;
  roleIds: string[];
}

export interface UserUpdateDto {
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  roleIds?: string[];
  isActive?: boolean;
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
  email: string;
  fullName?: string;
}
