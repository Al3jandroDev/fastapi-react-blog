from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class Follow(SQLModel, table=True):

    __tablename__ = "follow"

    id: Optional[int] = Field(default=None, primary_key=True)

    follower_id: int = Field(foreign_key="user.id")   
    following_id: int = Field(foreign_key="user.id") 

    created_at: datetime = Field(default_factory=datetime.utcnow)