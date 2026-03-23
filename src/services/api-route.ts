export const API_ROUTES: ApiRoutes = {
  BASE_URL: import.meta.env.VITE_BE_API,
  PAYMENT_BASE_URL: import.meta.env.VITE_API_PAYMENT_URL,
  TIMEOUT: 10000,
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
    ME: "/api/auth/me", // Get current user info with permissions
    PASSWORD_CHANGE: "/api/auth/change-password",
    PASSWORD_RESET_REQUEST: "/api/auth/password-reset/request",
    PASSWORD_RESET_CONFIRM: "/api/auth/password-reset/confirm",
  },
  OAUTH: {
    GOOGLE: "/oauth2/authorization/google", // Spring Security default
    CALLBACK: "/oauth/callback", // Your frontend callback route
  },
  EMPLOYEE: {
    PAGINATION: "/api/employees",
    GET_ALL: "/api/employees",
    CREATE: "/api/employees",
    UPDATE: (id: string) => `/api/employees/${id}`,
    FIND_BY_ID: (id: string) => `/api/employees/${id}`,
    SELECT: "/api/employees/select",
    SELECT_OPTIONS: "/api/employees/select-options",
    DEACTIVATE: (id: string) => `/api/employees/deactivate/${id}`,
    ACTIVATE: (id: string) => `/api/employees/activate/${id}`,
    UPLOAD_KNOWN_FACES: (id: string) => `/api/employees/${id}/known-faces/upload`,
  },

  ROLE: {
    PAGINATION: "/api/roles",
    CREATE: "/api/roles",
    UPDATE: (id: string) => `/api/roles/${id}`,
    DETAIL: (id: string) => `/api/roles/${id}`,
    LIST_ALL: "/api/roles",
    DEACTIVATE: (id: string) => `/api/roles/deactivate/${id}`,
    ACTIVATE: (id: string) => `/api/roles/activate/${id}`,
    SELECT: "/api/roles/select",
  },
  // HRM Modules
  DEPARTMENT: {
    PAGINATION: "/api/departments",
    GET_ALL: "/api/departments",
    CREATE: "/api/departments",
    UPDATE: (id: string) => `/api/departments/${id}`,
    FIND_BY_ID: (id: string) => `/api/departments/${id}`,
    SELECT: "/api/departments/select",
    DEACTIVATE: (id: string) => `/api/departments/deactivate/${id}`,
    ACTIVATE: (id: string) => `/api/departments/activate/${id}`,
  },

  POSITION: {
    PAGINATION: "/api/positions",
    GET_ALL: "/api/positions",
    CREATE: "/api/positions",
    UPDATE: (id: string) => `/api/positions/${id}`,
    FIND_BY_ID: (id: string) => `/api/positions/${id}`,
    SELECT: "/api/positions/select",
    DEACTIVATE: (id: string) => `/api/positions/deactivate/${id}`,
    ACTIVATE: (id: string) => `/api/positions/activate/${id}`,
  },
  CONTRACT: {
    PAGINATION: "/api/contracts",
    GET_ALL: "/api/contracts",
    ACTIVE: "/api/contracts/active",
    CREATE: "/api/contracts",
    UPDATE: (id: string) => `/api/contracts/${id}`,
    FIND_BY_ID: (id: string) => `/api/contracts/${id}`,
    DELETE: (id: string) => `/api/contracts/${id}`,
    SELECT: "/api/contracts/select",
    DEACTIVATE: (id: string) => `/api/contracts/deactivate/${id}`,
    ACTIVATE: (id: string) => `/api/contracts/activate/${id}`,
  },
  ALLOWANCE_TYPE: {
    PAGINATION: "/api/allowance-types",
    GET_ALL: "/api/allowance-types",
    CREATE: "/api/allowance-types",
    UPDATE: (id: string) => `/api/allowance-types/${id}`,
    FIND_BY_ID: (id: string) => `/api/allowance-types/${id}`,
    DELETE: (id: string) => `/api/allowance-types/${id}`,
    SELECT: "/api/allowance-types/select",
    DEACTIVATE: (id: string) => `/api/allowance-types/deactivate/${id}`,
    ACTIVATE: (id: string) => `/api/allowance-types/activate/${id}`,
  },
  CONTRACT_ALLOWANCE: {
    PAGINATION: "/api/contract-allowances",
    GET_ALL: "/api/contract-allowances",
    BY_CONTRACT: (contractId: string) =>
      `/api/contract-allowances/by-contract/${contractId}`,
    CREATE: "/api/contract-allowances",
    UPDATE: (id: string) => `/api/contract-allowances/${id}`,
    FIND_BY_ID: (id: string) => `/api/contract-allowances/${id}`,
    DELETE: (id: string) => `/api/contract-allowances/${id}`,
  },
  WORK_SHIFT: {
    PAGINATION: "/api/work-shifts",
    GET_ALL: "/api/work-shifts",
    CREATE: "/api/work-shifts",
    UPDATE: (id: string) => `/api/work-shifts/${id}`,
    FIND_BY_ID: (id: string) => `/api/work-shifts/${id}`,
    SELECT: "/api/work-shifts/select",
    DEACTIVATE: (id: string) => `/api/work-shifts/deactivate/${id}`,
    ACTIVATE: (id: string) => `/api/work-shifts/activate/${id}`,
  },
  SHIFT_ASSIGNMENT: {
    PAGINATION: "/api/shift-assignments",
    GET_ALL: "/api/shift-assignments",
    CREATE: "/api/shift-assignments",
    UPDATE: (id: string) => `/api/shift-assignments/${id}`,
    FIND_BY_ID: (id: string) => `/api/shift-assignments/${id}`,
    DELETE: (id: string) => `/api/shift-assignments/${id}`,
  },
  DAILY_ATTENDANCE: {
    PAGINATION: "/api/daily-attendances",
    GET_ALL: "/api/daily-attendances",
    CREATE: "/api/daily-attendances",
    UPDATE: (id: string) => `/api/daily-attendances/${id}`,
    FIND_BY_ID: (id: string) => `/api/daily-attendances/${id}`,
  },
  TIME_LOG: {
    PAGINATION: "/api/time-logs",
    GET_ALL: "/api/time-logs",
    CREATE: "/api/time-logs",
    UPDATE: (id: string) => `/api/time-logs/${id}`,
    FIND_BY_ID: (id: string) => `/api/time-logs/${id}`,
  },
  ATTENDANCE_SUMMARY: {
    PAGINATION: "/api/attendance-summaries",
    GET_ALL: "/api/attendance-summaries",
    FIND_BY_ID: (id: string) => `/api/attendance-summaries/${id}`,
    UNAPPROVE: (id: string) => `/api/attendance-summaries/${id}/unApprove`,
    APPROVE: (id: string) => `/api/attendance-summaries/${id}/approve`,
  },
  PAYROLL_PERIOD: {
    PAGINATION: "/api/payroll-periods",
    CREATE: "/api/payroll-periods/create",
    UPDATE: (id: string) => `/api/payroll-periods/${id}`,
    FIND_BY_ID: (id: string) => `/api/payroll-periods/${id}`,
    SELECT: "/api/payroll-periods/select",
    SELECT_OPTIONS: "/api/payroll-periods/select-options",
    DEACTIVATE: (id: string) => `/api/payroll-periods/${id}/deActivate`,
    ACTIVATE: (id: string) => `/api/payroll-periods/${id}/activate`,
    APPROVE: (id: string) => `/api/payroll-periods/${id}/approve`,
    UNAPPROVE: (id: string) => `/api/payroll-periods/${id}/unApprove`,
  },
  PAYSLIP: {
    PAGINATION: "/api/payslips",
    GET_ALL: "/api/payslips",
    CREATE: "/api/payslips",
    UPDATE: (id: string) => `/api/payslips/${id}`,
    FIND_BY_ID: (id: string) => `/api/payslips/${id}`,
    GENERATE: (payrollPeriodId: string) => `/api/payslips/generate/${payrollPeriodId}`,
    GENERATE_FOR_EMPLOYEE: (payrollPeriodId: string, employeeId: string) => `/api/payslips/generate/${payrollPeriodId}/employee/${employeeId}`,
    APPROVE: (id: string) => `/api/payslips/${id}/approve`,
    ACTIVATE: (id: string) => `/api/payslips/${id}/activate`,
    UNAPPROVE: (id: string) => `/api/payslips/${id}/unApprove`,
  },
  SALARY_ADJUSTMENT: {
    PAGINATION: "/api/salary-adjustments",
    GET_ALL: "/api/salary-adjustments",
    CREATE: "/api/salary-adjustments/create",
    UPDATE: (id: string) => `/api/salary-adjustments/${id}`,
    FIND_BY_ID: (id: string) => `/api/salary-adjustments/${id}`,
    DELETE: (id: string) => `/api/salary-adjustments/${id}`,
    ACTIVATE: (id: string) => `/api/salary-adjustments/${id}/activate`,
    APPROVE: (id: string) => `/api/salary-adjustments/${id}/approve`,
    UNAPPROVE: (id: string) => `/api/salary-adjustments/${id}/unApprove`,
  },
  OFFICE_LOCATION: {
    PAGINATION: "/api/office-locations",
    GET_ALL: "/api/office-locations",
    CREATE: "/api/office-locations/create",
    UPDATE: (id: string) => `/api/office-locations/${id}`,
    FIND_BY_ID: (id: string) => `/api/office-locations/${id}`,
    DELETE: (id: string) => `/api/office-locations/${id}`,
    ACTIVATE: (id: string) => `/api/office-locations/${id}/activate`,
    APPROVE: (id: string) => `/api/office-locations/${id}/approve`,
    UNAPPROVE: (id: string) => `/api/office-locations/${id}/unApprove`,
  },
  TAX_BRACKET: {
    PAGINATION: "/api/tax-brackets",
    GET_ALL: "/api/tax-brackets",
    CREATE: "/api/tax-brackets",
    UPDATE: (id: string) => `/api/tax-brackets/${id}`,
    FIND_BY_ID: (id: string) => `/api/tax-brackets/${id}`,
    SELECT: "/api/tax-brackets/select",
    DEACTIVATE: (id: string) => `/api/tax-brackets/deactivate/${id}`,
    ACTIVATE: (id: string) => `/api/tax-brackets/activate/${id}`,
  },
  INSURANCE_CONFIG: {
    PAGINATION: "/api/insurance-configs",
    GET_ALL: "/api/insurance-configs",
    CREATE: "/api/insurance-configs",
    UPDATE: (id: string) => `/api/insurance-configs/${id}`,
    FIND_BY_ID: (id: string) => `/api/insurance-configs/${id}`,
    SELECT: "/api/insurance-configs/select",
    DEACTIVATE: (id: string) => `/api/insurance-configs/deactivate/${id}`,
    ACTIVATE: (id: string) => `/api/insurance-configs/activate/${id}`,
  },
  DEPENDENT: {
    PAGINATION: "/api/dependents",
    GET_ALL: "/api/dependents",
    CREATE: "/api/dependents",
    UPDATE: (id: string) => `/api/dependents/${id}`,
    FIND_BY_ID: (id: string) => `/api/dependents/${id}`,
    DELETE: (id: string) => `/api/dependents/${id}`,
  },
  EMPLOYEE_IDENTITY: {
    PAGINATION: "/api/employee-identities",
    GET_ALL: "/api/employee-identities",
    CREATE: "/api/employee-identities",
    UPDATE: (id: string) => `/api/employee-identities/${id}`,
    FIND_BY_ID: (id: string) => `/api/employee-identities/${id}`,
    DELETE: (id: string) => `/api/employee-identities/${id}`,
  },
  TIMEKEEPING_DEVICE: {
    PAGINATION: "/api/timekeeping-devices",
    GET_ALL: "/api/timekeeping-devices",
    CREATE: "/api/timekeeping-devices",
    UPDATE: (id: string) => `/api/timekeeping-devices/${id}`,
    FIND_BY_ID: (id: string) => `/api/timekeeping-devices/${id}`,
    SELECT: "/api/timekeeping-devices/select",
    DEACTIVATE: (id: string) => `/api/timekeeping-devices/deactivate/${id}`,
    ACTIVATE: (id: string) => `/api/timekeeping-devices/activate/${id}`,
  },
  SYS_SETTING: {
    PAGINATION: "/api/sys-settings",
    GET_ALL: "/api/sys-settings",
    CREATE: "/api/sys-settings",
    UPDATE: (id: string) => `/api/sys-settings/${id}`,
    FIND_BY_ID: (id: string) => `/api/sys-settings/${id}`,
  },
  PERMISSION: {
    GET_ALL: "/admin/permissions",
    GET_BY_ROLE: (roleId: string) => `/admin/permissions/by-role/${roleId}`,
    ASSIGN: (roleId: string) => `/admin/permissions/assign-to-role/${roleId}`,
  },
  ACTION_LOG: {
    PAGINATION: "/api/action-logs",
    GET_ALL: "/api/action-logs",
    FIND_BY_ENTITY: (entityId: string) => `/api/action-logs/entity/${entityId}`,
  },
};

interface ApiRoutes {
  BASE_URL: string;
  PAYMENT_BASE_URL: string;
  TIMEOUT: number;
  HEADERS: {
    "Content-Type": string;
    Accept: string;
    Authorization?: string;
  };
}

export default API_ENDPOINTS;
