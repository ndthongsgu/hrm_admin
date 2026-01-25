# HRM Frontend Migration Tracker

> Migration from Transportation Management System to Human Resource Management System

## Overview

| Item | Details |
|------|---------|
| **Project** | HRM Admin Frontend |
| **Backend API** | `http://localhost:8080/api` |
| **Frontend Dev Server** | `http://localhost:5174` |
| **Start Date** | January 23, 2026 |
| **Status** | 🔄 In Progress |

---

## Architecture Comparison

### Old Frontend (Transportation)

| Module | Description |
|--------|-------------|
| Customer | Customer management |
| CustomerType | Customer type management |
| Car | Vehicle management |
| CarType | Vehicle type management |
| CarEmployee | Driver assignment |
| Route | Route management |
| Trip | Trip scheduling |
| TripStop | Trip stop points |
| Booking | Booking management |
| BookingSeat | Seat booking |
| Payment | Payment transactions |
| PaymentMethod | Payment methods |
| Reports | Revenue, trips statistics |

### New Backend (HRM)

| Module | API Endpoint | Description |
|--------|--------------|-------------|
| Auth | `/api/auth/login` | Authentication |
| User | `/api/users` | User management |
| Role | `/api/roles` | Role management |
| Employee | `/api/employees` | Employee management |
| Department | `/api/departments` | Department management |
| Position | `/api/positions` | Position/Job title management |
| Contract | `/api/contracts` | Labor contract management |
| AllowanceType | `/api/allowance-types` | Allowance type configuration |
| ContractAllowance | `/api/contract-allowances` | Contract allowances |
| WorkShift | `/api/work-shifts` | Work shift configuration |
| ShiftAssignment | `/api/shift-assignments` | Employee shift assignment |
| DailyAttendance | `/api/daily-attendances` | Daily attendance records |
| TimeLog | `/api/time-logs` | Time logging |
| AttendanceSummary | `/api/attendance-summaries` | Attendance summary reports |
| PayrollPeriod | `/api/payroll-periods` | Payroll period management |
| Payslip | `/api/payslips` | Payslip generation |
| SalaryAdjustment | `/api/salary-adjustments` | Salary adjustments |
| TaxBracket | `/api/tax-brackets` | Tax bracket configuration |
| InsuranceConfig | `/api/insurance-configs` | Insurance configuration |
| Dependent | `/api/dependents` | Employee dependents |
| EmployeeIdentity | `/api/employee-identities` | Employee identity documents |
| TimekeepingDevice | `/api/timekeeping-devices` | Timekeeping device management |
| SysSetting | `/api/sys-settings` | System settings |

---

## Migration Tasks

### Phase 1: Core Infrastructure ✅

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1.1 | Update API base configuration | ✅ Done | All endpoints updated to match HRM backend |
| 1.2 | Update Auth flow (login/logout) | ✅ Done | Updated to use `/auth/login` |
| 1.3 | Update JWT response handling | ✅ Done | Updated AuthResponse to match JwtResponse structure |
| 1.4 | Configure CORS properly | ✅ Done | Backend SecurityConfig updated |
| 1.5 | Setup bypass auth for development | ✅ Done | `VITE_BYPASS_AUTH=true` |

### Phase 2: User & Role Management ✅

| # | Task | Status | Notes |
|---|------|--------|-------|
| 2.1 | Create User DTOs | ✅ Done | Updated to match backend User entity |
| 2.2 | Create User service | ✅ Done | Full CRUD operations implemented |
| 2.3 | Create User list page | ✅ Done | Full User Manager page with table, pagination, activate/deactivate |
| 2.4 | Create User form (add/edit) | ✅ Done | Add/Edit pages with role selection, password handling |
| 2.4.1 | Create User detail page | ✅ Done | Detail page with user info and action log |
| 2.4.2 | Add User routes | ✅ Done | Routes added to routes/index.tsx |
| 2.5 | Create Role DTOs | ✅ Done | Added permissionsJson field |
| 2.6 | Create Role service | ✅ Done | Full CRUD operations implemented |
| 2.7 | Update Role list page | ✅ Done | Already exists, hooks updated |
| 2.8 | Update Role form with permissions | ✅ Done | Permission manager updated to use JSON format |

### Phase 3: Employee Management ✅

| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.1 | Create Employee DTOs | ✅ Done | Updated with HRM fields (taxCode, bankAccount, etc.) |
| 3.2 | Create Employee service | ✅ Done | Full CRUD operations implemented |
| 3.3 | Create Employee hooks | ✅ Done | Already existed, compatible with new DTOs |
| 3.4 | Update Employee list page | ✅ Done | Updated with new fields, department, position columns |
| 3.5 | Update Employee add page | ✅ Done | Form with all new HRM fields (personal, job, insurance, bank) |
| 3.6 | Update Employee edit page | ✅ Done | Reuses add page component with isEdit flag |
| 3.7 | Update Employee detail page | ✅ Done | Organized sections: basic info, job, insurance, bank, emergency contact |
| 3.9 | Create Department DTOs | ✅ Done | New module with manager and parent department support |
| 3.10 | Create Department service & hooks | ✅ Done | Full CRUD + select dropdown support |
| 3.11 | Create Department list page | ✅ Done | Table with code, name, manager, parent dept, status |
| 3.12 | Create Department add page | ✅ Done | Form with code, name, parent dept, manager, description |
| 3.13 | Create Department edit page | ✅ Done | Reuses add component with isEdit flag |
| 3.14 | Create Department detail page | ✅ Done | Sections: basic info, organization, description |
| 3.15 | Add Department routes | ✅ Done | Routes added to routes/index.tsx |
| 3.16 | Create Position DTOs | ✅ Done | New module with level and baseSalary |
| 3.17 | Create Position service & hooks | ✅ Done | Full CRUD + select dropdown support |
| 3.18 | Create Position list page | ✅ Done | Table with code, name, level, baseSalary, status |
| 3.19 | Create Position add page | ✅ Done | Form with code, name, level, baseSalary, description |
| 3.20 | Create Position edit page | ✅ Done | Reuses add component with isEdit flag |
| 3.21 | Create Position detail page | ✅ Done | Sections: basic info, salary & level, description |
| 3.22 | Add Position routes | ✅ Done | Routes added to routes/index.tsx |

### Phase 4: Contract Management 📄

| # | Task | Status | Notes |
|---|------|--------|-------|
| 4.1 | Create Contract DTOs | ⬜ TODO | Match backend Contract entity |
| 4.2 | Create Contract service | ⬜ TODO | Full CRUD operations |
| 4.3 | Create Contract hooks | ⬜ TODO | usePaginationContract, useCreateContract, etc. |
| 4.4 | Create Contract list page | ⬜ TODO | New module |
| 4.5 | Create Contract add page | ⬜ TODO | Form with employee selection |
| 4.6 | Create Contract edit page | ⬜ TODO | Update form |
| 4.7 | Create Contract detail page | ⬜ TODO | View with action log |
| 4.8 | Add Contract routes | ⬜ TODO | Routes configuration |
| 4.9 | Create AllowanceType DTOs & service | ⬜ TODO | Configuration module |
| 4.10 | Create AllowanceType pages | ⬜ TODO | List/add/edit/detail |
| 4.11 | Create ContractAllowance DTOs & service | ⬜ TODO | Submodule |
| 4.12 | Create ContractAllowance pages | ⬜ TODO | List/add/edit/delete |

### Phase 5: Attendance Management ⏰

| # | Task | Status | Notes |
|---|------|--------|-------|
| 5.1 | Create WorkShift DTOs & service | ⬜ TODO | Shift configuration |
| 5.2 | Create WorkShift pages | ⬜ TODO | List/add/edit/detail |
| 5.3 | Create ShiftAssignment DTOs & service | ⬜ TODO | Assign shifts to employees |
| 5.4 | Create ShiftAssignment pages | ⬜ TODO | List/add/edit/delete |
| 5.5 | Create DailyAttendance DTOs & service | ⬜ TODO | Daily check-in/out |
| 5.6 | Create DailyAttendance pages | ⬜ TODO | List/add/edit |
| 5.7 | Create TimeLog DTOs & service | ⬜ TODO | Time tracking |
| 5.8 | Create TimeLog pages | ⬜ TODO | List/add/edit |
| 5.9 | Create AttendanceSummary DTOs & service | ⬜ TODO | Monthly/period summary |
| 5.10 | Create AttendanceSummary pages | ⬜ TODO | List/view detail |
| 5.11 | Create TimekeepingDevice DTOs & service | ⬜ TODO | Device management |
| 5.12 | Create TimekeepingDevice pages | ⬜ TODO | List/add/edit/detail |

### Phase 6: Payroll Management 💰

| # | Task | Status | Notes |
|---|------|--------|-------|
| 6.1 | Create PayrollPeriod DTOs & service | ⬜ TODO | Period management |
| 6.2 | Create PayrollPeriod pages | ⬜ TODO | List/add/edit/detail |
| 6.3 | Create Payslip DTOs & service | ⬜ TODO | Payslip generation |
| 6.4 | Create Payslip pages | ⬜ TODO | List/add/edit/view |
| 6.5 | Create SalaryAdjustment DTOs & service | ⬜ TODO | Adjustments |
| 6.6 | Create SalaryAdjustment pages | ⬜ TODO | List/add/edit/delete |
| 6.7 | Create TaxBracket DTOs & service | ⬜ TODO | Tax settings configuration |
| 6.8 | Create TaxBracket pages | ⬜ TODO | List/add/edit/detail |
| 6.9 | Create InsuranceConfig DTOs & service | ⬜ TODO | Insurance settings |
| 6.10 | Create InsuranceConfig pages | ⬜ TODO | List/add/edit/detail |

### Phase 7: Navigation & Layout 🗺️

| # | Task | Status | Notes |
|---|------|--------|-------|
| 7.1 | Update sidebar menu | ⬜ TODO | New HRM menu structure |
| 7.2 | Update routes configuration | ⬜ TODO | New route paths |
| 7.3 | Update breadcrumbs | ⬜ TODO | |
| 7.4 | Remove old transportation modules | ⬜ TODO | Clean up unused code |

### Phase 8: Reports & Dashboard 📊

| # | Task | Status | Notes |
|---|------|--------|-------|
| 8.1 | Update Dashboard with HRM widgets | ⬜ TODO | Employee count, attendance, etc. |
| 8.2 | Create Attendance reports | ⬜ TODO | |
| 8.3 | Create Payroll reports | ⬜ TODO | |
| 8.4 | Remove old transportation reports | ⬜ TODO | |

---

## API Endpoint Mapping

### Authentication

| Frontend | Backend | Method | Notes |
|----------|---------|--------|-------|
| `/auth/login` | `/api/auth/login` | POST | ⚠️ Need to update |
| `/auth/me` | N/A | GET | Backend needs implementation |
| `/auth/refresh` | N/A | POST | Backend needs implementation |

### Standard CRUD Pattern

All backend modules follow this pattern:

| Action | Method | Endpoint |
|--------|--------|----------|
| List (paginated) | GET | `/api/{module}?page=0&size=10` |
| Get by ID | GET | `/api/{module}/{id}` |
| Create | POST | `/api/{module}` |
| Update | PUT | `/api/{module}/{id}` |
| Delete | DELETE | `/api/{module}/{id}` |

### Response Format

```json
// Success Response
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2026-01-23T10:00:00Z"
}

// Paginated Response
{
  "success": true,
  "data": {
    "items": [...],
    "totalElements": 100,
    "totalPages": 10,
    "page": 0,
    "size": 10
  }
}

// Error Response
{
  "success": false,
  "message": "Error message",
  "timestamp": "2026-01-23T10:00:00Z"
}
```

### JWT Response (Login)

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": "uuid",
  "username": "admin",
  "email": "admin@example.com",
  "roles": ["ROLE_ADMIN"]
}
```

---

## Permission System

### Module Codes

```typescript
const ModuleCode = {
  EMPLOYEE: "EMPLOYEE",
  CONTRACT: "CONTRACT", 
  SALARY: "SALARY",
  ATTENDANCE: "ATTENDANCE",
  PAYROLL: "PAYROLL",
  ROLE: "ROLE",
  PERMISSION: "PERMISSION"
};
```

### Permission Actions

```typescript
const PermissionAction = {
  READ: "READ",
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  ACTIVATE: "ACTIVATE",
  DEACTIVATE: "DEACTIVATE",
  IMPORT: "IMPORT",
  EXPORT: "EXPORT"
};
```

### Permission JSON Format (in Role)

```json
{
  "EMPLOYEE": ["READ", "CREATE", "UPDATE"],
  "CONTRACT": ["READ"],
  "PAYROLL": ["READ", "CREATE", "UPDATE", "DELETE"]
}
```

---

## File Structure (Target)

```
src/
├── common/
│   └── constants/
│       └── routes.ts          # Update with HRM routes
├── dto/
│   ├── auth.dto.ts            # Update JWT response
│   ├── user.dto.ts            # New/Update
│   ├── role.dto.ts            # Update with permissionsJson
│   ├── employee.dto.ts        # New
│   ├── department.dto.ts      # New
│   ├── position.dto.ts        # New
│   ├── contract.dto.ts        # New
│   ├── attendance.dto.ts      # New
│   └── payroll.dto.ts         # New
├── services/
│   ├── api-route.ts           # Update all endpoints
│   ├── auth.service.ts        # Update
│   ├── user.service.ts        # New/Update
│   ├── role.service.ts        # Update
│   ├── employee.service.ts    # New
│   ├── department.service.ts  # New
│   └── ...
├── pages/
│   └── main/
│       ├── employee-manager/  # Repurpose
│       ├── department/        # New
│       ├── position/          # New
│       ├── contract/          # New
│       ├── attendance/        # New
│       └── payroll/           # New
└── routes/
    └── index.tsx              # Update routes
```

---

## Development Notes

### Environment Variables

```env
VITE_BYPASS_AUTH=true          # Development only
VITE_BE_API=http://localhost:8080
```

### Backend Configuration Needed

1. ✅ CORS configuration updated
2. ⬜ Add `/api/auth/me` endpoint for user info
3. ⬜ Add `/api/auth/refresh` endpoint for token refresh
4. ⬜ Verify pagination response format

### Frontend Conventions

- Use existing UI components (Ant Design)
- Follow existing service pattern (axios + react-query)
- Maintain existing form validation (yup + react-hook-form)
- Keep table/list component patterns

---

## Progress Summary

| Phase | Progress | Tasks Done | Total Tasks |
|-------|----------|------------|-------------|
| Phase 1: Core | 100% | 5 | 5 |
| Phase 2: User/Role | 100% | 10 | 10 |
| Phase 3: Employee | 100% | 21 | 21 |
| Phase 4: Contract | 0% | 0 | 12 |
| Phase 5: Attendance | 0% | 0 | 12 |
| Phase 6: Payroll | 0% | 0 | 10 |
| Phase 7: Navigation | 0% | 0 | 4 |
| Phase 8: Reports | 0% | 0 | 4 |
| **Total** | **46%** | **36** | **78** |

---

## Changelog

### 2026-01-25

- [x] **API Response Handling Fix:**
  - [x] Added axios response interceptor to automatically unwrap backend response format `{success: true, data: {...}}`
  - [x] Implemented automatic mapping from `items` to `content` for pagination responses
  - [x] Updated PaginationResponse DTO to include optional fields: `totalPages`, `page`, `size`
  - [x] **Benefits:**
    - ✅ No need to modify individual hooks
    - ✅ Centralized response handling in axios interceptor
    - ✅ Consistent data structure across all modules
    - ✅ Backward compatible with existing code

### 2026-01-23

- [x] Initial migration tracker created
- [x] Backend API structure analyzed
- [x] CORS configuration fixed in backend
- [x] Bypass auth mechanism verified
- [x] **Phase 1 Completed:**
  - [x] Updated all API endpoints to remove `/admin` prefix
  - [x] Added all HRM module endpoints (Department, Position, Contract, etc.)
  - [x] Updated auth endpoints to match backend structure
  - [x] Updated AuthResponse DTO to match JwtResponse (token, type, id, username, email, roles)
  - [x] Updated auth service to store token from new response format
  - [x] Updated useLogin hook to handle new JWT response structure
  - [x] Fixed token refresh endpoint path in api-client
- [x] **Phase 2 Completed:**
  - [x] Updated UserDto to match backend User entity (removed customer/employee relations, updated field types)
  - [x] Created separate UserCreateDto and UserUpdateDto
  - [x] Created user.service.ts with full CRUD operations
  - [x] **Created User Manager pages:**
    - [x] User list page (`/user_manager`) - Table with pagination, search, activate/deactivate
    - [x] User add page (`/user_manager/add`) - Form with username, email, password, roles selection
    - [x] User edit page (`/user_manager/edit/:id`) - Form with update fields (no password/username)
    - [x] User detail page (`/user_manager/detail/:id`) - View user info with action log
  - [x] Added User routes to routes/index.tsx
  - [x] Updated RoleDto to include permissionsJson field (JSON format: {"EMPLOYEE": ["READ", "CREATE"]})
  - [x] Created separate RoleCreateDto and RoleUpdateDto
  - [x] Created role.service.ts with full CRUD operations
  - [x] Updated user hooks to use new DTOs (changed id from number to string)
  - [x] Updated role hooks to use new DTOs
  - [x] Updated permission manager to transform data to new JSON format
  - [x] Fixed permission hook to accept Record<string, string[]> instead of old array format
- [x] **Phase 3 Core Services Completed (35%):**
  - [x] Updated EmployeeDto with HRM fields (taxCode, socialInsuranceNumber, healthInsuranceNumber, bankAccount, bankName, emergencyContact, dateOfBirth, gender, address, hireDate, terminationDate, departmentId, positionId)
  - [x] Created separate EmployeeCreateDto and EmployeeUpdateDto
  - [x] Created employee.service.ts with full CRUD operations
  - [x] Employee hooks already existed and are compatible
  - [x] **Department Module:**
    - [x] Created department.dto.ts with full DTOs (support for manager and parent department)
    - [x] Created department.service.ts with full CRUD operations
    - [x] Created department/index.ts hooks (pagination, CRUD, activate/deactivate, select options)
  - [x] **Position Module:**
    - [x] Created position.dto.ts with full DTOs (includes level and baseSalary fields)
    - [x] Created position.service.ts with full CRUD operations
    - [x] Created position/index.ts hooks (pagination, CRUD, activate/deactivate, select options)
  - [x] Fixed employee manager page to use new field names (fullName, phoneNumber, isActive)
  - [x] **Employee Pages Updated:**
    - [x] Updated employee list page with new columns (departmentName, positionName)
    - [x] Updated employee add page with comprehensive form fields:
      - Personal info: fullName, dateOfBirth, gender, email, phoneNumber, address
      - Job info: departmentId, positionId, hireDate
      - Tax & Insurance: taxCode, socialInsuranceNumber, healthInsuranceNumber
      - Banking: bankAccount, bankName
      - Emergency: emergencyContact, emergencyPhone
      - Notes field
    - [x] Updated employee detail page with organized sections:
      - Section I: Basic Information
      - Section II: Job Information
      - Section III: Insurance & Tax
      - Section IV: Banking Information
      - Section V: Emergency Contact
      - Section VI: Notes
- [x] **Phase 3 Completed (100%):**
  - [x] **Department Pages Created:**
    - [x] Department list page (`/department_manager`) - Table with filters, activate/deactivate actions
    - [x] Department add page (`/department_manager/add`) - Form with code, name, parent dept, manager, description
    - [x] Department edit page (`/department_manager/edit/:id`) - Reuses add component
    - [x] Department detail page (`/department_manager/detail/:id`) - Organized sections
    - [x] Department routes added to routes/index.tsx and routes.ts
  - [x] **Position Pages Created:**
    - [x] Position list page (`/position_manager`) - Table with filters, level, baseSalary columns
    - [x] Position add page (`/position_manager/add`) - Form with code, name, level, baseSalary, description
    - [x] Position edit page (`/position_manager/edit/:id`) - Reuses add component
    - [x] Position detail page (`/position_manager/detail/:id`) - Salary & level section
    - [x] Position routes added to routes/index.tsx and routes.ts

---

## References

- Backend source: `/Users/tungcaiquang/Documents/CODE/DACN/hrm_api`
- Frontend source: `/Users/tungcaiquang/Documents/CODE/DACN/hrm_admin`
- Postman collection: `hrm_api/HRM_API.postman_collection.json`
