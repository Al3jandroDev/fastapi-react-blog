from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime

# POST MODEL
# This model represents a blog post created by a user
# It is mapped to the "post" table in the database

class Post(SQLModel, table=True):

    """
    Database model for posts

    Each post:
    - has a title and content
    - belongs to a user (author)
    - is timestamped when created
    """

    __tablename__ = "post"

    # PRIMARY KEY
    # Unique identifier for each post
    id: Optional[int] = Field(default=None, primary_key=True)

    # TITLE
    # Title of the post
    # Indexed for faster search queries
    title: str = Field(index=True)

    # CONTENT
    # Main body of the post
    content: str

    # TIMESTAMP
    # Automatically set when the post is created
    # Uses UTC time to avoid timezone issues
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # RELATION: USER (AUTHOR)
    # Foreign key linking the post to a user
    # References user.id in the User table
    author_id: int = Field(foreign_key="user.id")