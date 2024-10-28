import asyncio
from .common.mail import send_email, render_email_template

from core.security import create_verify_code, get_password_hash
from core.redis import get_redis_client

from repositories.users import crud_user



from schemas.auths import VerifyCodeComfirm, VerifyEmailSend, VerifyCodeChangePassword
from schemas.utils import InfoEmailSend

from utils.errors.verify import (
    ActivateCodeInvalidError, ActivateCodeExpiredError, 
    RecoveryCodeInvalidError, RecoveryCodeExpiredError, 
)
from utils.errors.auth import EmailSendFailureError,InvalidEmailError
from utils.errors.user import UserNotFoundError,UserAccountAleadyActivatedError,UserAccountInactiveError


class VerifyService():
    def __init__(self):
        self.redis_client = asyncio.run(get_redis_client()) 

    async def active_code_by_email_service(self, session, data: VerifyEmailSend):
        """
        Send activation code to user's email. Store the activation code in Redis.
        """
        user = await crud_user.get( session,return_columns=["id", "full_name", "is_active"], email=data.email)
        if user is None:
            raise UserNotFoundError()
        if user.is_active:
            raise UserAccountAleadyActivatedError()
        existing_code = await self.redis_client.get(f"activate_code:{user.id}")
        if existing_code:
            return {"message": "Activation code already sent. Please check your email."}

        new_code_active, new_exp_active = create_verify_code()
        await self.redis_client.setex(f"activate_code:{user.id}", new_exp_active, new_code_active)
        info = InfoEmailSend(email=data.email, name=user.full_name, verification_code=new_code_active)
        html_content = await render_email_template("verify_code.html", **info.dict())
        response = await send_email(email_to=data.email, subject="Your Activation Code", html_content=html_content)
        if not response:
            raise EmailSendFailureError()
        return {"message": "Activation code sent successfully. Please check your email."}
    async def recovery_code_by_email_service(self, session, data: VerifyEmailSend):
        """
        Send recovery code to user's email. If code already sent and not expired,
        return a message indicating the code has already been sent.
        """
       
        user = await crud_user.get(session,return_columns=["id", "full_name"], email=data.email)
        if user is None:
            raise UserNotFoundError()
        existing_code = await self.redis_client.get(f"recovery_code:{user.id}")
        if existing_code:
            return {"message": "Recovery code already sent. Please check your email to recover your account."}

        new_code_recovery, new_exp_recovery = create_verify_code()
        await self.redis_client.setex(f"recovery_code:{user.id}", new_exp_recovery, new_code_recovery)
        

        info = InfoEmailSend(email=data.email, name=user.full_name, verification_code=new_code_recovery)
        html_content = await render_email_template("verify_code.html", **info.dict())
        response = await send_email(
            email_to=data.email,
            subject="Your Recovery Code",
            html_content=html_content
        )
        if not response:
            raise EmailSendFailureError()

        return {"message": "Successfully sent code. Please check your email to recover your account."}

    
    async def confirm_active_code(self,session, data: VerifyCodeComfirm):
        """
        Confirm the activation code from Redis.
        """
        user = await crud_user.get(session,return_columns=["id"], email=data.email)
        print(user)
        if user is None:
            raise UserNotFoundError()
        activate_code = await self.redis_client.get(f"activate_code:{user.id}")
        if not activate_code:
            raise ActivateCodeExpiredError()
        if activate_code != data.verify_code:
            raise  ActivateCodeInvalidError()
        
        await self.redis_client.delete(f"activate_code:{user.id}")  
        return True
    
    async def confirm_active_code_service(self, session, data: VerifyCodeComfirm):
        """
        Service to confirm the activation code without updating user status.
        """
        await self.confirm_active_code(session, data)
        return {"message": "Activation code confirmed."}

    
    async def confirm_active_code_account_service(self, session, data: VerifyCodeComfirm):
        """
        Service to confirm the activation code and activate the user account.
        """
        await self.confirm_active_code(session, data)
        await crud_user.update(session,email=data.email, obj_in={"is_active": True})
        return {"message": "User activated successfully."}
    
    async def confirm_recovery_code(self, session, data: VerifyCodeComfirm):
        """
        Confirm the recovery code. Raises appropriate errors if the code is invalid,
        expired, or already used.
        """
        user = await crud_user.get(session,return_columns=["email", "id"], email=data.email)
        if user is None:
            raise UserNotFoundError()

        recovery_code = await self.redis_client.get(f"recovery_code:{user.id}")
        if not recovery_code:
            raise RecoveryCodeExpiredError()
        if recovery_code != data.verify_code:
            raise RecoveryCodeInvalidError()
        return True

    
    async def confirm_recovery_code_service(self, session, data: VerifyCodeComfirm):
        """
        Service to confirm the recovery code without changing the password.
        """
        await self.confirm_recovery_code(session, data)
        return {"message": "Recovery code confirmed."}

    
    async def confirm_recovery_code_change_password_service(self, session, data: VerifyCodeChangePassword):
        """
        Service to confirm the recovery code and change the user's password.
        """
        await self.confirm_recovery_code(session, data)
        await crud_user.update(session, email=data.email, obj_in={"hashed_password": get_password_hash(data.new_password)})
    
        return {"message": "Password changed successfully."}
