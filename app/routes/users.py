from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import Annotated

from app.db.database import get_session
from app.models.user import User
from app.models.post import Post
from app.models.follow import Follow

SessionDep = Annotated[Session, Depends(get_session)]




router = APIRouter(
    prefix="/users",
    tags=["users"]
)


DEFAULT_AVATAR = "/uploads/default-avatar.jpg"
DEFAULT_BANNER = "/uploads/default-banner.jpg"

@router.get("/{user_id}")
def get_user(user_id: int, session: SessionDep):

    user = session.get(User, user_id)

    if not user:
        raise HTTPException(404)

    posts = session.exec(
        select(Post).where(Post.author_id == user_id)
    ).all()

    followers_count = len(
        session.exec(
            select(Follow).where(
                Follow.following_id == user.id
            )
        ).all()
    )

    following_count = len(
        session.exec(
            select(Follow).where(
                Follow.follower_id == user.id
            )
        ).all()
    )

    return {
        "id": user.id,
        "username": user.username,
        "bio": user.bio,

        "avatar_url": user.avatar_url or DEFAULT_AVATAR,
        "banner_url": user.banner_url or DEFAULT_BANNER,
        "followers_count": followers_count,
        "following_count": following_count,

        "created_at": user.created_at,

        "posts": [
            {
                "id": p.id,
                "title": p.title,
                "content": p.content,
                "image_url": p.image_url,
                "created_at": p.created_at
            }
            for p in posts
        ]
    }