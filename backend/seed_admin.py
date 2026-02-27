import asyncio
from sqlalchemy.future import select
from core.database import AsyncSessionLocal
from models import Employee, UserAccount
from core.utils import get_password_hash

async def seed():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Employee).where(Employee.email == "admin@hrms.com"))
        existing_admin = result.scalar_one_or_none()
        
        if existing_admin:
            print("Admin already exists! (admin@hrms.com / admin123)")
            return

        new_emp = Employee(first_name="Super", last_name="Admin", email="admin@hrms.com", employment_type="full_time", status="active")
        session.add(new_emp)
        await session.flush()
        
        hashed_pw = get_password_hash("admin123")
        new_ua = UserAccount(auth_uid=hashed_pw, employee_id=new_emp.id, role="SuperAdmin")
        session.add(new_ua)
        await session.commit()
        print("Successfully created admin user!")
        print("Email: admin@hrms.com")
        print("Password: admin123")

if __name__ == "__main__":
    asyncio.run(seed())
