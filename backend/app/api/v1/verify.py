from fastapi import APIRouter

from api.deps import SessionDep

from schemas.auths import  VerifyEmailSend,VerifyCodeComfirm,VerifyCodeChangePassword
from schemas.utils import Message

from services.verify import VerifyService

verify_service = VerifyService()

router = APIRouter(prefix="/verify")

@router.post("/account/code", response_model=Message)
async def active_code_by_email(
    data: VerifyEmailSend, 
    session: SessionDep
):
    result = await verify_service.active_code_by_email_service(session, data)
    return result

@router.post("/account/code/confirm",response_model=Message)
async def confirm_active_code(
    data: VerifyCodeComfirm, 
    session: SessionDep
):
    result = await verify_service.confirm_active_code_service(session, data)
    return result
@router.post("/account/code/active-account",response_model=Message)
async def confirm_verify_code_active_account(
    data: VerifyCodeComfirm, 
    session: SessionDep
    ):
    result = await verify_service.confirm_active_code_account_service(session, data)
    return result
@router.post("/recovery-account/code", response_model=Message)
async def recovery_code_by_email(
    data: VerifyEmailSend, 
    session: SessionDep):
    result = await verify_service.recovery_code_by_email_service(session, data)
    return result

@router.post("/recovery-account/code/confirm",response_model=Message)
async def confirm_recovery_code(
    data: VerifyCodeComfirm, 
    session: SessionDep
    ):
    result = await verify_service.confirm_recovery_code_service(session, data)
    return result

@router.put("/recovery-account/code/change-password", response_model=Message)
async def confirm_recovery_code_and_change_password(
    session: SessionDep,
    data: VerifyCodeChangePassword, 
    ):
    result = await verify_service.confirm_recovery_code_change_password_service(session, data)
    return result