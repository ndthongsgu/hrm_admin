export interface WorkShiftDto {
  id?: string;
  name: string;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  breakStart?: string; // HH:mm format
  breakEnd?: string; // HH:mm format
  lateGraceMinutes?: number;
  earlyLeaveGraceMinutes?: number;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WorkShiftFilter {
  name?: string;
  isDeleted?: boolean;
}

export interface SelectOptionDto {
  id: string;
  name: string;
}
