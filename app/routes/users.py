from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import Annotated

from app.db.database import get_session
from app.models.user import User
from app.models.post import Post

SessionDep = Annotated[Session, Depends(get_session)]

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

# =========================
# GET USER PROFILE
# =========================
@router.get("/{user_id}")
def get_user(user_id: int, session: SessionDep):

    user = session.get(User, user_id)

    if not user:
        raise HTTPException(404)

    posts = session.exec(
        select(Post).where(Post.author_id == user_id)
    ).all()

    return {
    "id": user.id,
    "username": user.username,
    "bio": user.bio,
    "posts": [
        {
            "id": p.id,
            "title": p.title,
            "content": p.content,
            "created_at": p.created_at
        }
        for p in posts
    ]
}