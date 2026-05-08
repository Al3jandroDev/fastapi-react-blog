from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import Annotated

from app.db.database import get_session
from app.models.like import Like
from app.models.post import Post
from app.models.user import User

from app.routes.posts import get_post_or_404
from app.services.auth import get_current_user


SessionDep = Annotated[Session, Depends(get_session)]

router = APIRouter(
    prefix="/likes",
    tags=["likes"]
)


# =========================
# TOGGLE LIKE (LIKE / UNLIKE)
# =========================
@router.post("/{post_id}")
def toggle_like(
    post_id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):

    # 🔥 asegura que el post exista
    _ = get_post_or_404(session, post_id)

    # 🔍 buscar like existente
    existing = session.exec(
        select(Like).where(
            Like.post_id == post_id,
            Like.user_id == current_user.id
        )
    ).first()

    # ❤️ si existe → unlike
    if existing:
        session.delete(existing)
        session.commit()
        return {"liked": False}

    # 💙 si no existe → like
    new_like = Like(
        post_id=post_id,
        user_id=current_user.id
    )

    session.add(new_like)
    session.commit()

    return {"liked": True}


# =========================
# DELETE LIKE (OPCIONAL)
# =========================
@router.delete("/{post_id}")
def unlike_post(
    post_id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):

    like = session.exec(
        select(Like).where(
            Like.user_id == current_user.id,
            Like.post_id == post_id
        )
    ).first()

    if not like:
        raise HTTPException(
            status_code=404,
            detail="Like not found"
        )

    session.delete(like)
    session.commit()

    return {"message": "Post unliked"}