from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.db.database import get_session
from app.models.user import User
from app.models.follow import Follow
from app.services.auth import get_current_user

router = APIRouter(prefix="/follow", tags=["follow"])

SessionDep = Depends(get_session)


# =========================
# FOLLOW / UNFOLLOW TOGGLE
# =========================
@router.post("/{user_id}")
def follow_user(
    user_id: int,
    session: Session = SessionDep,
    current_user: User = Depends(get_current_user)
):

    print("FOLLOW REQUEST:", current_user.id, "->", user_id)

    if current_user.id == user_id:
        raise HTTPException(400, "You cannot follow yourself")

    user = session.get(User, user_id)

    if not user:
        raise HTTPException(404, "User not found")

    existing = session.exec(
        select(Follow).where(
            Follow.follower_id == current_user.id,
            Follow.following_id == user_id
        )
    ).first()

    # 🔥 TOGGLE LOGIC
    if existing:
        session.delete(existing)
        session.commit()
        return {"message": "Unfollowed"}

    follow = Follow(
        follower_id=current_user.id,
        following_id=user_id
    )

    session.add(follow)
    session.commit()

    return {"message": "Now following user"}


# =========================
# 🔥 CHECK FOLLOW (NUEVO)
# =========================
@router.get("/check/{user_id}")
def check_follow(
    user_id: int,
    session: Session = SessionDep,
    current_user: User = Depends(get_current_user)
):

    follow = session.exec(
        select(Follow).where(
            Follow.follower_id == current_user.id,
            Follow.following_id == user_id
        )
    ).first()

    return {"following": follow is not None}


# =========================
# FOLLOWERS
# =========================
@router.get("/{user_id}/followers")
def get_followers(
    user_id: int,
    session: Session = SessionDep
):

    followers = session.exec(
        select(Follow).where(Follow.following_id == user_id)
    ).all()

    return followers


# =========================
# FOLLOWING
# =========================
@router.get("/{user_id}/following")
def get_following(
    user_id: int,
    session: Session = SessionDep
):

    following = session.exec(
        select(Follow).where(Follow.follower_id == user_id)
    ).all()

    return following