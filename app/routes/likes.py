from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import Annotated

from app.db.database import get_session

from app.models.like import Like
from app.models.post import Post
from app.models.user import User

from app.services.auth import get_current_user

SessionDep = Annotated[Session, Depends(get_session)]

router = APIRouter(
    prefix="/posts",
    tags=["likes"]
)


# =========================
# LIKE POST
# =========================
@router.post("/{post_id}/like", status_code=201)
def like_post(
    post_id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):

    # Check post exists
    post = session.get(Post, post_id)

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    # Prevent duplicate likes
    statement = select(Like).where(
        Like.user_id == current_user.id,
        Like.post_id == post_id
    )

    existing_like = session.exec(statement).first()

    if existing_like:
        raise HTTPException(
            status_code=400,
            detail="Post already liked"
        )

    # Create like
    new_like = Like(
        user_id=current_user.id,
        post_id=post_id
    )

    session.add(new_like)
    session.commit()

    return {
        "message": "Post liked"
    }


# =========================
# UNLIKE POST
# =========================
@router.delete("/{post_id}/like")
def unlike_post(
    post_id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):

    statement = select(Like).where(
        Like.user_id == current_user.id,
        Like.post_id == post_id
    )

    like = session.exec(statement).first()

    if not like:
        raise HTTPException(
            status_code=404,
            detail="Like not found"
        )

    session.delete(like)
    session.commit()

    return {
        "message": "Post unliked"
    }