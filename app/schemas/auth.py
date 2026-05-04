from pydantic import BaseModel
from sqlmodel import SQLModel

# USER SCHEMAS (DTOs)
# These classes define the shape of data exchanged via the API
# They are NOT database models
# Used for validation, serialization, and security


# USER CREATE SCHEMA
# Used when registering a new user
# Includes password because it will be hashed in the backend
class UserCreate(SQLModel):
    username: str
    email: str
    password: str


# USER LOGIN SCHEMA
# Used for authentication requests
# Only requires credentials
class UserLogin(SQLModel):
    username: str
    password: str


# USER READ SCHEMA
# Used when returning user data from the API
# IMPORTANT: excludes password for security reasons
class UserRead(SQLModel):
    id: int
    username: str
    email: str


# TOKEN SCHEMA
# Represents JWT authentication response
# Sent back after successful login
class Token(SQLModel):
    access_token: str
    token_type: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    username: str

