from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime


# COMMENT MODEL
# This model represents a comment made by a user on a post
# It is mapped to a database table via SQLModel
class Comment(SQLModel, table=True):
    """
    Database model for comments.

    Each comment:
    - belongs to a user (author)
    - belongs to a post
    - contains text content
    - has a creation timestamp
    """

    # PRIMARY KEY
    # Unique identifier for each comment
    id: Optional[int] = Field(default=None, primary_key=True)

    # CONTENT
    # The text/body of the comment
    content: str

    # RELATION: USER (AUTHOR)
    # Foreign key linking the comment to a user
    # References user.id in the User table
    author_id: int = Field(foreign_key="user.id")

    # TIMESTAMP
    # Automatically set when the comment is created
    # Uses UTC time to avoid timezone issues
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # RELATION: POST
    # Foreign key linking the comment to a post
    # References post.id in the Post table
    post_id: int = Field(foreign_key="post.id")