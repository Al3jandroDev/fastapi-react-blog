from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import Annotated, List

from app.db.database import get_session

from app.models.comment import Comment
from app.models.post import Post
from app.models.user import User

from app.schemas.comment import CommentCreate, CommentRead

from app.services.auth import get_current_user

SessionDep = Annotated[Session, Depends(get_session)]

router = APIRouter(
    prefix="/comments",
    tags=["comments"]
)


# =========================
# CREATE COMMENT
# =========================
@router.post("/{post_id}", response_model=CommentRead, status_code=201)
def create_comment(
    post_id: int,
    comment: CommentCreate,
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):

    post = session.get(Post, post_id)

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    if not comment.content.strip():
        raise HTTPException(
            status_code=400,
            detail="Comment cannot be empty"
        )

    new_comment = Comment(
        content=comment.content,
        post_id=post_id,
        user_id=current_user.id
    )

    session.add(new_comment)
    session.commit()
    session.refresh(new_comment)

    return CommentRead(
    id=new_comment.id,
    content=new_comment.content,
    post_id=new_comment.post_id,
    author_id=new_comment.author_id,
    username=current_user.username,
    created_at=new_comment.created_at,
    )


# =========================
# GET COMMENTS BY POST
# =========================
@router.get("/{post_id}", response_model=List[CommentRead])
def get_comments(
    post_id: int,
    session: SessionDep
):

    post = session.get(Post, post_id)

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    statement = (
        select(Comment)
        .where(Comment.post_id == post_id)
        .order_by(Comment.created_at.desc())
    )

    comments = session.exec(statement).all()

    result = []

    for c in comments:
        user = session.get(User, c.user_id)

        result.append(
    CommentRead.model_validate({
        "id": c.id,
        "content": c.content,
        "post_id": c.post_id,
        "author_id": c.user_id,
        "username": user.username if user else None,
        "created_at": c.created_at,
    })
)

    return result


# =========================
# DELETE COMMENT
# =========================
@router.delete("/{comment_id}")
def delete_comment(
    comment_id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):

    comment = session.get(Comment, comment_id)

    if not comment:
        raise HTTPException(
            status_code=404,
            detail="Comment not found"
        )

    if comment.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized"
        )

    session.delete(comment)
    session.commit()

    return {
        "message": "Comment deleted"
    }