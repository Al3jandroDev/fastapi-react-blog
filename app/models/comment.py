from datetime import datetime
from typing import Optional, TYPE_CHECKING

from sqlmodel import Column, ForeignKey, SQLModel, Field, Relationship

from sqlalchemy import Column, Integer, ForeignKey


if TYPE_CHECKING:
    from app.models.user import User
    from app.models.post import Post


class Comment(SQLModel, table=True):

    __tablename__ = "comment"

    id: Optional[int] = Field(default=None,primary_key=True)

    content: str

    created_at: datetime = Field(default_factory=datetime.utcnow)

    # FK
    user_id: int = Field(foreign_key="user.id")

    post_id: int = Field(
    sa_column=Column(
        Integer,
        ForeignKey("post.id", ondelete="CASCADE"),
        nullable=False
    )
)
    
    # relationships
    user: "User" = Relationship(back_populates="comments")

    post: "Post" = Relationship(back_populates="comments")

