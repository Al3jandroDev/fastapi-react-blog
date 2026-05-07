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
        raise HTTPException(status_code=404, detail="User not found")

    # traer posts del usuario
    statement = select(Post).where(Post.author_id == user.id)
    posts = session.exec(statement).all()

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