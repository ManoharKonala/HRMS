from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from core.database import get_db
from core.config import settings
from core.utils import verify_password, create_access_token, get_password_hash
from models import Employee, UserAccount, TimeOffRequest, Salary
import schemas
from api import deps
from uuid import UUID

auth_router = APIRouter(prefix="/auth", tags=["auth"])
employees_router = APIRouter(prefix="/employees", tags=["employees"])
time_off_router = APIRouter(prefix="/time-off", tags=["time-off"])

api_router = APIRouter()

@auth_router.post("/login", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Employee).where(Employee.email == form_data.username))
    employee = result.scalar_one_or_none()
    if not employee:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    
    result_ua = await db.execute(select(UserAccount).where(UserAccount.employee_id == employee.id))
    user_account = result_ua.scalar_one_or_none()
    if not user_account:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    if not verify_password(form_data.password, str(user_account.auth_uid)):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user_account.id), "role": user_account.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@employees_router.post("", response_model=schemas.EmployeeOut, status_code=status.HTTP_201_CREATED)
async def create_employee(employee: schemas.EmployeeCreate, current_user: UserAccount = Depends(deps.require_roles(["HR", "SuperAdmin"])), db: AsyncSession = Depends(get_db)):
    new_employee = Employee(**employee.model_dump(exclude={'password', 'role'}))
    db.add(new_employee)
    await db.flush() 
    
    hashed_password = get_password_hash(employee.password)
    new_user_account = UserAccount(auth_uid=hashed_password, employee_id=new_employee.id, role=employee.role)
    db.add(new_user_account)
    await db.commit()
    await db.refresh(new_employee)
    return new_employee

@employees_router.get("", response_model=list[schemas.EmployeeOut])
async def read_employees(skip: int = 0, limit: int = 100, current_user: UserAccount = Depends(deps.get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Employee).offset(skip).limit(limit))
    employees = result.scalars().all()
    return employees

@employees_router.get("/{employee_id}", response_model=schemas.EmployeeOut)
async def read_employee(employee_id: UUID, current_user: UserAccount = Depends(deps.get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Employee).where(Employee.id == employee_id))
    employee = result.scalar_one_or_none()
    if employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@employees_router.get("/{employee_id}/salary")
async def read_employee_salary(employee_id: UUID, current_user: UserAccount = Depends(deps.require_roles(["HR", "SuperAdmin"])), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Salary).where(Salary.employee_id == employee_id))
    salaries = result.scalars().all()
    return salaries

@time_off_router.post("", response_model=schemas.TimeOffRequestOut)
async def create_time_off_request(request: schemas.TimeOffRequestCreate, current_user: UserAccount = Depends(deps.get_current_user), db: AsyncSession = Depends(get_db)):
    new_request = TimeOffRequest(**request.model_dump(), employee_id=current_user.employee_id)
    db.add(new_request)
    await db.commit()
    await db.refresh(new_request)
    return new_request

@time_off_router.get("", response_model=list[schemas.TimeOffRequestOut])
async def read_time_off_requests(skip: int = 0, limit: int = 100, current_user: UserAccount = Depends(deps.get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role in ["HR", "Manager", "SuperAdmin"]:
        result = await db.execute(select(TimeOffRequest).offset(skip).limit(limit))
    else:
        result = await db.execute(select(TimeOffRequest).where(TimeOffRequest.employee_id == current_user.employee_id).offset(skip).limit(limit))
    return result.scalars().all()

@time_off_router.put("/{request_id}/status", response_model=schemas.TimeOffRequestOut)
async def update_time_off_status(request_id: UUID, status_update: schemas.TimeOffRequestUpdate, current_user: UserAccount = Depends(deps.require_roles(["HR", "Manager", "SuperAdmin"])), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TimeOffRequest).where(TimeOffRequest.id == request_id))
    req = result.scalar_one_or_none()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    
    req.status = status_update.status
    req.approver_id = current_user.employee_id
    await db.commit()
    await db.refresh(req)
    return req

api_router.include_router(auth_router)
api_router.include_router(employees_router)
api_router.include_router(time_off_router)
