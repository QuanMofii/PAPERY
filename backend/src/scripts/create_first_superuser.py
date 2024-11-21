import asyncio
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from core.db.database import async_engine, local_session
from core.security import get_password_hash
from crud.crud_users import crud_users
from schemas.user import UserCreateInternal, UserRead
from core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def create_superuser(db: AsyncSession) -> None:
    try:
        # Kiểm tra nếu email đã tồn tại
        email_exists = await crud_users.exists(db=db, email=settings.ADMIN_EMAIL)
        if email_exists:
            logger.info(f"Admin user with email '{settings.ADMIN_EMAIL}' already exists.")
            return

        # Kiểm tra nếu username đã tồn tại
        username_exists = await crud_users.exists(db=db, username=settings.ADMIN_USERNAME)
        if username_exists:
            logger.info(f"Admin user with username '{settings.ADMIN_USERNAME}' already exists.")
            return

        # Chuẩn bị dữ liệu tạo superuser
        hashed_password = get_password_hash(settings.ADMIN_PASSWORD)
        superuser_data = UserCreateInternal(
            name=settings.ADMIN_NAME,
            email=settings.ADMIN_EMAIL,
            username=settings.ADMIN_USERNAME,
            hashed_password=hashed_password,
            is_superuser=True,
        )

        # Tạo superuser
        created_user: UserRead = await crud_users.create(db=db, object=superuser_data)
        logger.info(f"Superuser '{created_user.username}' created successfully.")

    except Exception as e:
        logger.error(f"Failed to create superuser: {e}")

async def main():
    # Kết nối và chạy hàm tạo superuser
    async with local_session() as session:
        await create_superuser(db=session)

if __name__ == "__main__":
    asyncio.run(main())
