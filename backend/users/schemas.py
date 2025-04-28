from pydantic import BaseModel


class UserCreateSchema(BaseModel):
    username: str
    email: str
    password: str


class LoginSchema(BaseModel):
    username: str
    password: str


class TokenOut(BaseModel):
    access: str
    refresh: str


class LoginResponse(BaseModel):
    success: bool
    message: str


class UserProfileSchema(BaseModel):
    username: str
    email: str = ""
    first_name: str = ""
    last_name: str = ""
    role: str = "user"
    vip_expiry_date: str | None = None

    class Config:
        orm_mode = True


class ChangePasswordSchema(BaseModel):
    old_password: str
    new_password: str


class UpdateProfileSchema(BaseModel):
    email: str = ""
    first_name: str = ""
    last_name: str = ""


class EmailSchema(BaseModel):
    subject: str
    message: str
    recipient: str
    html_message: str = ""


class OrderSchema(BaseModel):
    order_number: str
    course: int
    price: float
    status: str
    payment_method: str = ""
    created_at: str = ""

    class Config:
        orm_mode = True
