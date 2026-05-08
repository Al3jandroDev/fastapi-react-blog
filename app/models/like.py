from sqlmodel import Field, Relationship, SQLModel
from typing import Optional

class Like(SQLModel, table=True):

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", nullable=False)
    post_id: int = Field(foreign_key="post.id", nullable=False)

    user: Optional["User"] = Relationship(back_populates="likes")
    post: Optional["Post"] = Relationship(back_populates="likes")


from app.models.user import User
from app.models.post import Post


