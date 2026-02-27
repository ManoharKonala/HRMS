from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import date, datetime
from typing import Optional, List
from uuid import UUID

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[str] = None
    role: Optional[str] = None

class EmployeeBase(BaseModel):
    employee_number: Optional[str] = None
    first_name: str
    last_name: str
    preferred_name: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    hire_date: Optional[date] = None
    employment_type: str = "full_time"
    status: str = "active"
    department_id: Optional[UUID] = None
    job_id: Optional[UUID] = None
    location_id: Optional[UUID] = None
    manager_id: Optional[UUID] = None

class EmployeeCreate(EmployeeBase):
    password: str
    role: str = "employee"

class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    status: Optional[str] = None
    role: Optional[str] = None

class EmployeeOut(EmployeeBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class TimeOffRequestBase(BaseModel):
    type: str
    start_date: date
    end_date: date
    reason: Optional[str] = None

class TimeOffRequestCreate(TimeOffRequestBase):
    pass

class TimeOffRequestUpdate(BaseModel):
    status: str # approved, rejected

class TimeOffRequestOut(TimeOffRequestBase):
    id: UUID
    employee_id: UUID
    status: str
    approver_id: Optional[UUID] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
