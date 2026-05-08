from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship


# USER MODEL
# Represents a registered user in the system
# Each user can create posts and comments

class User(SQLModel, table=True):

    """
    Database model for users

    Stores authentication and identification data
    Passwords are stored as hashes for security
    """
    
    __tablename__ = "user"


    # PRIMARY KEY
    # Unique identifier for each user
    id: Optional[int] = Field(default=None, primary_key=True)

    # USERNAME
    # Public identifier used for login and display
    # Indexed for fast lookup during authentication
    username: str = Field(index=True)

    # EMAIL
    # User email address (also indexed for quick lookup)
    email: str = Field(index=True)

    # PASSWORD HASH
    # Secure hashed password
    password_hash: str

    bio: Optional[str] = "Fullstack developer 🚀"

    posts: List["Post"] = Relationship(back_populates="author")

    likes: list["Like"] = Relationship(back_populates="user")

from app.models.like import Like
from app.models.post import Post