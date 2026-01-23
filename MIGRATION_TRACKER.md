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

### Phase 3: Employee Management 👥

| # | Task | Status | Notes |
|---|------|--------|-------|
| 3.1 | Create Employee DTOs | ⬜ TODO | Match backend Employee entity (taxCode, bankAccount, etc.) |
| 3.2 | Create Employee service | ⬜ TODO | Full CRUD operations |
| 3.3 | Create Employee hooks | ⬜ TODO | usePaginationEmployee, useCreateEmployee, etc. |
| 3.4 | Create Employee list page | ⬜ TODO | Replace old employee module, add new fields |
| 3.5 | Create Employee add page | ⬜ TODO | Form with all new fields |
| 3.6 | Create Employee edit page | ⬜ TODO | Update form |
| 3.7 | Create Employee detail page | ⬜ TODO | View with action log |
| 3.8 | Add Employee routes | ⬜ TODO | Routes to routes/index.tsx |
| 3.9 | Create Department DTOs | ⬜ TODO | New module |
| 3.10 | Create Department service & hooks | ⬜ TODO | Full CRUD |
| 3.11 | Create Department pages (list/add/edit/detail) | ⬜ TODO | Complete module |
| 3.12 | Add Department routes | ⬜ TODO | Routes configuration |
| 3.13 | Create Position DTOs | ⬜ TODO | New module |
| 3.14 | Create Position service & hooks | ⬜ TODO | Full CRUD |
| 3.15 | Create Position pages (list/add/edit/detail) | ⬜ TODO | Complete module |
| 3.16 | Add Position routes | ⬜ TODO | Routes configuration |
| 3.17 | Create EmployeeIdentity DTOs & service | ⬜ TODO | Identity documents submodule |
| 3.18 | Create EmployeeIdentity pages | ⬜ TODO | List/add/edit/detail |
| 3.19 | Create Dependent DTOs & service | ⬜ TODO | Employee dependents submodule |
| 3.20 | Create Dependent pages | ⬜ TODO | List/add/edit/detail |

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
| Phase 3: Employee | 0% | 0 | 20 |
| Phase 4: Contract | 0% | 0 | 12 |
| Phase 5: Attendance | 0% | 0 | 12 |
| Phase 6: Payroll | 0% | 0 | 10 |
| Phase 7: Navigation | 0% | 0 | 4 |
| Phase 8: Reports | 0% | 0 | 4 |
| **Total** | **19%** | **15** | **78** |

---

## Changelog

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

---

## References

- Backend source: `/Users/tungcaiquang/Documents/CODE/DACN/hrm_api`
- Frontend source: `/Users/tungcaiquang/Documents/CODE/DACN/hrm_admin`
- Postman collection: `hrm_api/HRM_API.postman_collection.json`
