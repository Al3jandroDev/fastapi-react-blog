from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime


class User(SQLModel, table=True):

    __tablename__ = "user"

    # =========================
    # PRIMARY KEY
    # =========================
    id: Optional[int] = Field(
        default=None,
        primary_key=True
    )

    # =========================
    # USERNAME
    # =========================
    username: str = Field(
        index=True,
        unique=True
    )

    # =========================
    # EMAIL
    # =========================
    email: str = Field(
        index=True,
        unique=True
    )

    # =========================
    # PASSWORD
    # =========================
    password_hash: str

    # =========================
    # PROFILE
    # =========================
    bio: Optional[str] = Field(
        default="Fullstack developer 🚀"
    )

    # =========================
    # RELATIONSHIPS
    # =========================

    posts: List["Post"] = Relationship(
        back_populates="author"
    )

    likes: List["Like"] = Relationship(
        back_populates="user"
    )

    comments: List["Comment"] = Relationship(
        back_populates="user"
    )

    # =========================
    # FOLLOW SYSTEM
    # =========================

    # usuarios que YO sigo
    following: List["Follow"] = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[Follow.follower_id]",
            "cascade": "all, delete-orphan"
        }
    )

    # usuarios que ME siguen
    followers: List["Follow"] = Relationship(
        sa_relationship_kwargs={
            "foreign_keys": "[Follow.following_id]",
            "cascade": "all, delete-orphan"
        }
    )

    avatar_url: str = Field(default="/uploads/default-avatar.jpg")
    banner_url: str = Field(default="/uploads/default-banner.jpg")
    created_at: datetime = Field(default_factory=datetime.utcnow)


from app.models.post import Post
from app.models.like import Like
from app.models.comment import Comment
from app.models.follow import Follow