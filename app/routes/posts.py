from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import Annotated, List

from app.models.post import Post
from app.models.user import User
from app.models.like import Like
from app.schemas.post import PostCreate, PostRead, PostUpdate
from app.db.database import get_session
from app.services.auth import get_current_user

SessionDep = Annotated[Session, Depends(get_session)]

router = APIRouter(
    prefix="/posts",
    tags=["posts"]
)


# =========================
# HELPER
# =========================
def get_post_or_404(session: Session, post_id: int) -> Post:
    post = session.get(Post, post_id)

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    return post


# =========================
# CREATE POST
# =========================
@router.post("/", response_model=PostRead, status_code=201)
def create_post(
    post_create: PostCreate,
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):

    new_post = Post(
        title=post_create.title,
        content=post_create.content,
        image_url=post_create.image_url,
        author_id=current_user.id
    )

    session.add(new_post)
    session.commit()
    session.refresh(new_post)

    return PostRead(
        id=new_post.id,
        title=new_post.title,
        content=new_post.content,
        image_url=new_post.image_url,
        author_id=new_post.author_id,
        author_username=current_user.username,
        likes_count=0,
        liked_by_me=False
    )


# =========================
# GET ALL POSTS (🔥 FIX PRINCIPAL)
# =========================
@router.get("/", response_model=List[PostRead])
def read_posts(
    session: SessionDep,
    current_user: User = Depends(get_current_user)   # 🔥 IMPORTANTE
):

    statement = (
        select(Post, User)
        .join(User, Post.author_id == User.id)
        .order_by(Post.created_at.desc())
    )

    results = session.exec(statement).all()

    posts = []

    for post, user in results:

        liked = session.exec(
            select(Like).where(
                Like.post_id == post.id,
                Like.user_id == current_user.id
            )
        ).first() is not None

        posts.append(
            PostRead(
                id=post.id,
                title=post.title,
                content=post.content,
                image_url=post.image_url,
                author_id=post.author_id,
                author_username=user.username,

                likes_count=len(post.likes),
                liked_by_me=liked
            )
        )

    return posts


# =========================
# GET SINGLE POST
# =========================
@router.get("/{post_id}", response_model=PostRead)
def read_post(post_id: int, session: SessionDep):

    statement = (
        select(Post, User)
        .join(User, Post.author_id == User.id)
        .where(Post.id == post_id)
    )

    result = session.exec(statement).first()

    if not result:
        raise HTTPException(status_code=404, detail="Post not found")

    post, user = result

    return PostRead(
        id=post.id,
        title=post.title,
        content=post.content,
        image_url=post.image_url,
        author_id=post.author_id,
        author_username=user.username,
        likes_count=len(post.likes),
        liked_by_me=False
    )


# =========================
# UPDATE POST
# =========================
@router.patch("/{post_id}", response_model=PostRead)
def update_post(
    post_id: int,
    post_update: PostUpdate,
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):

    post = get_post_or_404(session, post_id)

    if post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    for key, value in post_update.model_dump(exclude_unset=True).items():
        setattr(post, key, value)

    session.add(post)
    session.commit()
    session.refresh(post)

    return PostRead(
        id=post.id,
        title=post.title,
        content=post.content,
        image_url=post.image_url,
        author_id=post.author_id,
        author_username=post.author.username,
        likes_count=len(post.likes),
        liked_by_me=any(
            like.user_id == current_user.id
            for like in post.likes
        )
    )


# =========================
# DELETE POST
# =========================
@router.delete("/{post_id}", status_code=204)
def delete_post(
    post_id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):

    post = get_post_or_404(session, post_id)

    if post.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    session.delete(post)
    session.commit()
    return