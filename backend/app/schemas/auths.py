from pydantic import BaseModel
class Login (BaseModel):
    username: str
    password: str
class ChangePassword(BaseModel):
    current_password: str
    new_password: str
class TokenRefresh(BaseModel):
    refresh_token: str
    user_id: int
class VerifyEmailSend(BaseModel):
    email: str
class VerifyCodeComfirm(BaseModel):
    email: str
    verify_code: str 
class VerifyCodeChangePassword(BaseModel):
    verify_code: str
    email: str
    new_password: str
  
