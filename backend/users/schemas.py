from pydantic import BaseModel


class UpdateProfileSchema(BaseModel):
    email: str
    first_name: str
    last_name: str


class EmailSchema(BaseModel):
    recipient: str
    subject: str
    message: str


class UserProfileSchema(BaseModel):
    role: str
    vip_expiry_date: str = None

    class Config:
        orm_mode = True


class OrderSchema(BaseModel):
    order_number: str
    course: int
    price: float
    status: str
    payment_method: str = ""
    created_at: str = ""

    class Config:
        orm_mode = True
