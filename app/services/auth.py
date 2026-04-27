# FastAPI imports for dependency injection and error handling
from fastapi import Depends, HTTPException, status

# Security utilities for handling Bearer tokens
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

# SQLModel for database operations
from sqlmodel import Session, select

# Typing utilities
from typing import Annotated

# JWT handling
from jose import JWTError, jwt

# Date utilities for token expiration
from datetime import datetime, timedelta

# App models and database
from app.models.user import User
from app.db.database import get_session, engine

# Environment variables
import os
from dotenv import load_dotenv

# Password hashing
from passlib.context import CryptContext


# PASSWORD HASHING SETUP
# Configure hashing algorithm (bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class Hasher:
    """
    Utility class for password hashing and verification.
    """

    @staticmethod
    def get_password_hash(password: str):
        # Hash a plain password
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str):
        # Verify plain password against hashed one
        return pwd_context.verify(plain_password, hashed_password)


# ENVIRONMENT CONFIGURATION
# Load variables from .env file
load_dotenv()

# Secret key used to sign JWT tokens
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY is not set in .env")

# JWT settings
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


# DATABASE DEPENDENCY
def get_db():
    """
    Provides a database session (used as dependency)
    """
    with Session(engine) as session:
        yield session


# JWT TOKEN CREATION
def create_access_token(data: dict):
    """
    Create a JWT access token with expiration.
    """
    to_encode = data.copy()

    # Set expiration time
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})


    # Encode token
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# SECURITY SCHEME (Bearer)
# Extracts Authorization: Bearer <token>
oauth2_scheme = HTTPBearer()


# JWT TOKEN DECODING
def decode_access_token(token: str):
    """
    Decode and validate JWT token.
    """
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )


# CURRENT USER DEPENDENCY
def get_current_user(
    token: HTTPAuthorizationCredentials = Depends(oauth2_scheme),
    session: Session = Depends(get_db)
):
    """
    Retrieve the currently authenticated user from JWT token.
    """

    # Decode token
    payload = decode_access_token(token.credentials)

    # Extract user ID from token payload
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )

    # Fetch user from database
    user = session.exec(
        select(User).where(User.id == int(user_id))
    ).first()

    # If user does not exist
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    # Return authenticated user
    return user