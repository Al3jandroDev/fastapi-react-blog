from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from sqlalchemy import func
from typing import Annotated

from app.db.database import get_session
from app.models.user import User
from app.models.post import Post
from app.models.follow import Follow
from app.models.like import Like

from app.services.auth import get_current_user

SessionDep = Annotated[Session, Depends(get_session)]

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

DEFAULT_AVATAR = "/uploads/default-avatar.jpg"
DEFAULT_BANNER = "/uploads/default-banner.jpg"


@router.get("/{user_id}")
def get_user(
    user_id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):

    # =========================
    # USER
    # =========================
    user = session.get(User, user_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # =========================
    # POSTS + LIKES COUNT
    # =========================
    posts_query = (
        select(
            Post,
            func.count(Like.id).label("likes_count")
        )
        .outerjoin(Like, Like.post_id == Post.id)
        .where(Post.author_id == user_id)
        .group_by(Post.id)
        .order_by(Post.created_at.desc())
    )

    posts_result = session.exec(posts_query).all()

    # =========================
    # FOLLOWERS COUNT
    # =========================
    followers_count = session.exec(
        select(func.count(Follow.id)).where(
            Follow.following_id == user.id
        )
    ).one()

    # =========================
    # FOLLOWING COUNT
    # =========================
    following_count = session.exec(
        select(func.count(Follow.id)).where(
            Follow.follower_id == user.id
        )
    ).one()

    # =========================
    # RESPONSE
    # =========================
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
                "id": post.id,
                "title": post.title,
                "content": post.content,
                "image_url": post.image_url,
                "created_at": post.created_at,

                "likes_count": likes_count,

                "liked_by_me": session.exec(
                    select(Like).where(
                        Like.post_id == post.id,
                        Like.user_id == current_user.id
                    )
                ).first() is not None
            }
            for post, likes_count in posts_result
        ]
    }