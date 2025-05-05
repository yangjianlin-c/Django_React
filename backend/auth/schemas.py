from pydantic import BaseModel

class UserCreateSchema(BaseModel):
    username: str
    email: str
    password: str

class LoginSchema(BaseModel):
    username: str
    password: str

class ChangePasswordSchema(BaseModel):
    old_password: str
    new_password: str