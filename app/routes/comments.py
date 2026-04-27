# FastAPI imports for routing, dependency injection, and error handling
from fastapi import APIRouter, Depends, HTTPException, status

# SQLModel for database operations
from sqlmodel import Session, select

# Typing utilities
from typing import Annotated, List

# Database models
from app.models.comment import Comment
from app.models.post import Post
from app.models.user import User

# Schemas (request/response validation)
from app.schemas.comment import CommentCreate, CommentRead

# Database session dependency
from app.db.database import get_session

# Auth dependency to get current logged-in user
from app.services.auth import get_current_user

# Reusable DB session dependency
SessionDep = Annotated[Session, Depends(get_session)]

# Router for comment-related endpoints
router = APIRouter(
    prefix="/comments",  # Base route
    tags=["comments"]    # Swagger grouping
)


# CREATE COMMENT
@router.post("/{post_id}/comments", response_model=CommentRead, status_code=201)
def create_comment(
    post_id: int,
    comment: CommentCreate,
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):
    
    # Check if the post exists
    post = session.get(Post, post_id)

    if not post:
        raise HTTPException(404, "Post not found")

    # Optional validation: prevent empty comments
    if not comment.content.strip():
        raise HTTPException(
            status_code=400,
            detail="Comment cannot be empty"
        )

    # Create new comment linked to post and current user
    new_comment = Comment(
        content=comment.content,
        post_id=post_id,
        author_id=current_user.id
    )

    # Save to database
    session.add(new_comment)
    session.commit()

    # Refresh to get DB-generated fields (e.g., ID)
    session.refresh(new_comment)

    # Return created comment
    return new_comment


# GET COMMENTS FOR A POST
@router.get("/{post_id}/comments", response_model=List[CommentRead])
def get_comments(post_id: int, session: SessionDep):

    # Query all comments for a given post
    statement = select(Comment).where(Comment.post_id == post_id)
    comments = session.exec(statement).all()

    # Return list of comments
    return comments


# DELETE COMMENT
@router.delete("/{comment_id}", status_code=200)
def delete_comment(comment_id: int, session: SessionDep,
                current_user: User = Depends(get_current_user)):

    # 1. Retrieve comment by ID
    comment = session.get(Comment, comment_id)

    if not comment:
        raise HTTPException(
            status_code=404,
            detail="Comment not found"
        )

    # 2. Check ownership (only author can delete)
    if comment.author_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to delete this comment"
        )

    # 3. Delete comment from database
    session.delete(comment)
    session.commit()

    # Return confirmation
    return {
        "message": "Comment deleted successfully",
        "id": comment.id
    }