# FastAPI imports for routing, dependency injection, and HTTP error handling
from fastapi import APIRouter, Depends, HTTPException, status

# SQLModel for database interaction
from sqlmodel import Session, select

# Modern typing for dependency injection
from typing import Annotated

# Schemas: define request/response structure
from app.schemas.auth import UserCreate, UserLogin, UserRead, Token

# Database model
from app.models.user import User

# Auth utilities: password hashing and JWT creation
from app.services.auth import Hasher, create_access_token

# Dependency to get DB session
from app.db.database import get_session

# Create a router for authentication endpoints
router = APIRouter(
    prefix="/auth",  # All routes will start with /auth
    tags=["auth"]    # Group name in Swagger docs
)


# Reusable dependency for injecting DB session
SessionDep = Annotated[Session, Depends(get_session)]


# REGISTER ENDPOINT
@router.post("/register", response_model=UserRead)
def register(user_create: UserCreate, session: SessionDep):


    # Check if a user with same username OR email already exists
    statement = select(User).where(
        (User.username == user_create.username) |
        (User.email == user_create.email)
    )
    existing_user = session.exec(statement).first()


    # If user exists, return 400 error
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )


    # Hash the password before storing it in the database
    hashed_password = Hasher.get_password_hash(user_create.password)


    # Create new user instance
    new_user = User(
        username=user_create.username,
        email=user_create.email,
        password_hash=hashed_password
    )


    # Save to database
    session.add(new_user)
    session.commit()

    # Refresh instance to get generated fields (e.g., ID)
    session.refresh(new_user)

    # Return user (password is excluded thanks to response_model)
    return new_user


# LOGIN ENDPOINT
@router.post("/login", response_model=Token)
def login(user_login: UserLogin, session: SessionDep):


    # Find user by username
    statement = select(User).where(User.username == user_login.username)
    user = session.exec(statement).first()

    # Validate credentials:
    # - user does not exist
    # - password is incorrect
    if not user or not Hasher.verify_password(user_login.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    # Create token payload (subject = user ID)
    token_data = {"sub": str(user.id)}

    # Generate JWT access token
    access_token = create_access_token(data=token_data)


    # Return token to client
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }