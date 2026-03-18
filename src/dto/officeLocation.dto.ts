export interface OfficeLocationDto {
  id?: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  radius: number;
  status: 'APPROVED' | 'PENDING';
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OfficeLocationFilter {
  name?: string;
  address?: string;
  status?: 'APPROVED' | 'PENDING';
  isDeleted?: boolean;
}
