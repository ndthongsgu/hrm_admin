export interface BaseDto {
  id: string;
  createdDate: Date;
  updatedDate: Date;
  createdBy: string | null;
  updatedBy: string | null;
  isDeleted: boolean;
  version: number;
  isCanEdit?: boolean;
  isCanDelete?: boolean;
  isCanView?: boolean;
  isCanCreate?: boolean;
  isCanDeactivate?: boolean;
  isCanActivate?: boolean;
  statusName?: string;
  statusColor?: string;
  status?: string;
}
export interface PaginationDto<T> {
  skip: number;
  take: number;
  where: T;
  sortBy?: string;
  sortDirection?: string;
}

export class PageResponse<T = any> {
  data: T[] = [];
  total: number = 0;
}

export interface PrimaryBaseEntity {
  id?: string;
  createdDate?: Date;
  updatedDate?: Date;
  createdBy?: string | null;
  updatedBy?: string | null;
  version?: number;
}
export interface ActionLogDto extends BaseDto {
  functionId: string;
  functionType: string;
  type: string;
  description: string;
  createdByName?: string;
  employeeCode?: string;
}
