from pydantic import BaseModel
class Message(BaseModel):
    message: str
    class Config:
        from_attributes=True
class InfoEmailSend(BaseModel):
    email: str
    name:str
    verification_code: str        