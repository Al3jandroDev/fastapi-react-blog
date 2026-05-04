# FastAPI imports
from fastapi import APIRouter, Depends, HTTPException

# SQLModel
from sqlmodel import Session, select

# Typing
from typing import Annotated, List

# Models
from app.models.post import Post
from app.models.user import User

# Schemas
from app.schemas.post import PostCreate, PostRead, PostUpdate

# DB
from app.db.database import get_session

# Auth
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
        raise HTTPException(status_code=404, detail="Post not found")
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
        author_id=current_user.id
    )

    session.add(new_post)
    session.commit()
    session.refresh(new_post)

    # 🔥 IMPORTANTE: devolver schema completo
    return PostRead(
        id=new_post.id,
        title=new_post.title,
        content=new_post.content,
        author_id=new_post.author_id,
        author_username=current_user.username
    )


# =========================
# GET ALL POSTS
# =========================
@router.get("/", response_model=List[PostRead])
def read_posts(session: SessionDep):

    statement = (
        select(Post, User)
        .join(User, Post.author_id == User.id)
        .order_by(Post.id.desc())  # 🔥 importante
    )

    results = session.exec(statement).all()

    return [
        PostRead(
            id=post.id,
            title=post.title,
            content=post.content,
            author_id=post.author_id,
            author_username=user.username
        )
        for post, user in results
    ]


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
        author_id=post.author_id,
        author_username=user.username
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

    update_data = post_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(post, key, value)

    session.add(post)
    session.commit()
    session.refresh(post)

    return PostRead(
        id=post.id,
        title=post.title,
        content=post.content,
        author_id=post.author_id,
        author_username=current_user.username
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