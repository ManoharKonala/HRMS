import uuid
from datetime import date, datetime
from sqlalchemy import Column, String, Date, DateTime, Numeric, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship as db_relationship
from core.database import Base
from sqlalchemy.sql import func

class Department(Base):
    __tablename__ = "departments"
    __table_args__ = {'schema': 'hrms'}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, unique=True)
    code = Column(String, unique=True)
    manager_id = Column(UUID(as_uuid=True), ForeignKey("hrms.employees.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    manager = db_relationship("Employee", foreign_keys="Department.manager_id")

class Job(Base):
    __tablename__ = "jobs"
    __table_args__ = {'schema': 'hrms'}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    code = Column(String, unique=True)
    level = Column(String)
    description = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class Location(Base):
    __tablename__ = "locations"
    __table_args__ = {'schema': 'hrms'}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    address = Column(String)
    city = Column(String)
    state = Column(String)
    country = Column(String)
    postal_code = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class Employee(Base):
    __tablename__ = "employees"
    __table_args__ = {'schema': 'hrms'}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_number = Column(String, unique=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    preferred_name = Column(String)
    email = Column(String, nullable=False, unique=True)
    phone = Column(String)
    date_of_birth = Column(Date)
    gender = Column(String)
    hire_date = Column(Date, nullable=False, default=date.today)
    termination_date = Column(Date)
    employment_type = Column(String, nullable=False, default="full_time")
    status = Column(String, nullable=False, default="active")
    manager_id = Column(UUID(as_uuid=True), ForeignKey("hrms.employees.id"))
    department_id = Column(UUID(as_uuid=True)) # no explicit FK in schema
    job_id = Column(UUID(as_uuid=True))
    location_id = Column(UUID(as_uuid=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    attendance = db_relationship("Attendance", back_populates="employee")
    benefits = db_relationship("Benefit", back_populates="employee")
    contacts = db_relationship("EmployeeContact", back_populates="employee")
    employment_history = db_relationship("EmploymentHistory", back_populates="employee")
    salaries = db_relationship("Salary", back_populates="employee")
    time_off_requests = db_relationship("TimeOffRequest", foreign_keys="[TimeOffRequest.employee_id]", back_populates="employee")
    user_account = db_relationship("UserAccount", back_populates="employee", uselist=False)

class Attendance(Base):
    __tablename__ = "attendance"
    __table_args__ = {'schema': 'hrms'}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("hrms.employees.id"), nullable=False)
    clock_in = Column(DateTime(timezone=True), nullable=False)
    clock_out = Column(DateTime(timezone=True))
    source = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    employee = db_relationship("Employee", back_populates="attendance")

class Benefit(Base):
    __tablename__ = "benefits"
    __table_args__ = {'schema': 'hrms'}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("hrms.employees.id"), nullable=False)
    plan_name = Column(String, nullable=False)
    plan_type = Column(String)
    enrollment_date = Column(Date, nullable=False, default=date.today)
    status = Column(String, nullable=False, default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    employee = db_relationship("Employee", back_populates="benefits")

class EmployeeContact(Base):
    __tablename__ = "employee_contacts"
    __table_args__ = {'schema': 'hrms'}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("hrms.employees.id"), nullable=False)
    contact_name = Column(String, nullable=False)
    relationship = Column(String)
    phone = Column(String)
    email = Column(String)
    address = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    employee = db_relationship("Employee", back_populates="contacts")

class EmploymentHistory(Base):
    __tablename__ = "employment_history"
    __table_args__ = {'schema': 'hrms'}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("hrms.employees.id"), nullable=False)
    job_id = Column(UUID(as_uuid=True), ForeignKey("hrms.jobs.id"))
    department_id = Column(UUID(as_uuid=True), ForeignKey("hrms.departments.id"))
    location_id = Column(UUID(as_uuid=True), ForeignKey("hrms.locations.id"))
    start_date = Column(Date, nullable=False)
    end_date = Column(Date)
    reason = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    employee = db_relationship("Employee", back_populates="employment_history")

class Salary(Base):
    __tablename__ = "salaries"
    __table_args__ = {'schema': 'hrms'}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("hrms.employees.id"), nullable=False)
    currency = Column(String, default="USD", nullable=False)
    amount = Column(Numeric, nullable=False)
    frequency = Column(String, default="annual", nullable=False)
    effective_date = Column(Date, nullable=False, default=date.today)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    employee = db_relationship("Employee", back_populates="salaries")

class TimeOffRequest(Base):
    __tablename__ = "time_off_requests"
    __table_args__ = {'schema': 'hrms'}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("hrms.employees.id"), nullable=False)
    type = Column(String, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    status = Column(String, nullable=False, default="pending")
    approver_id = Column(UUID(as_uuid=True), ForeignKey("hrms.employees.id"))
    reason = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    employee = db_relationship("Employee", foreign_keys="TimeOffRequest.employee_id", back_populates="time_off_requests")
    approver = db_relationship("Employee", foreign_keys="TimeOffRequest.approver_id")

class UserAccount(Base):
    __tablename__ = "user_accounts"
    __table_args__ = {'schema': 'hrms'}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    auth_uid = Column(String, unique=True)
    employee_id = Column(UUID(as_uuid=True), ForeignKey("hrms.employees.id"), unique=True)
    role = Column(String, default="employee")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    employee = db_relationship("Employee", back_populates="user_account")
