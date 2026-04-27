# FastAPI imports for routing, dependency injection, and error handling
from fastapi import APIRouter, Depends, HTTPException

# SQLModel for database operations
from sqlmodel import Session, select

# Typing utilities
from typing import Annotated, List

# Database models
from app.models.post import Post
from app.models.user import User

# Schemas for request/response validation
from app.schemas.post import PostCreate, PostRead, PostUpdate

# Database session dependency
from app.db.database import get_session

# Auth dependency to get current authenticated user
from app.services.auth import get_current_user

# Reusable DB session dependency
SessionDep = Annotated[Session, Depends(get_session)]


# Router for post-related endpoints
router = APIRouter(
    prefix="/posts", # Base route
    tags=["posts"]   # Swagger grouping
)

# CREATE POST
@router.post("/", response_model=PostRead, status_code=201)
def create_post(post_create: PostCreate, session: SessionDep,
                current_user: User = Depends(get_current_user)):
    
    # Validate that title is not empty or just whitespace
    if not post_create.title.strip():
        raise HTTPException(
            status_code=400,
            detail="Title cannot be empty"
        )

    # Create new post linked to current user
    new_post = Post(
        title=post_create.title,
        content=post_create.content,
        author_id=current_user.id
    )

    # Save to database
    session.add(new_post)
    session.commit()

    # Refresh to get DB-generated values (e.g., ID)
    session.refresh(new_post)

    # Return created post
    return new_post


# GET ALL POSTS
@router.get("/", response_model=List[PostRead])
def read_posts(session: SessionDep):

    # Query all posts
    statement = select(Post)
    posts = session.exec(statement).all()

    # Return list of posts
    return posts


# GET SINGLE POST
@router.get("/{post_id}", response_model=PostRead)
def read_post(post_id: int, session: SessionDep):

    # Retrieve post by ID
    post = session.get(Post, post_id)


    # If not found error 404
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    # Return post
    return post


# UPDATE POST
@router.patch("/{post_id}", response_model=PostRead)
def update_post(
    post_id: int,
    post_update: PostUpdate,
    session: SessionDep,
    current_user: User = Depends(get_current_user)
):
    # 1. Retrieve post
    post = session.get(Post, post_id)

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    # 2. Authorization check (only author can update)
    if post.author_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized"
        )

    # 3. Extract only provided fields (partial update)
    update_data = post_update.model_dump(exclude_unset=True)

    # 4. Validate title if provided
    if "title" in update_data and not update_data["title"].strip():
        raise HTTPException(
            status_code=400,
            detail="Title cannot be empty"
        )

    # 5. Apply updates dynamically
    for key, value in update_data.items():
        setattr(post, key, value)

    # 6. Save changes
    session.add(post)
    session.commit()
    session.refresh(post)

    # Return updated post
    return post


# DELETE POST
@router.delete("/{post_id}",status_code=200)
def delete_post(post_id: int, session: SessionDep, current_user: User = Depends(get_current_user)):

    # Retrieve post
    post = session.get(Post, post_id)

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    # Authorization check (only author can delete)
    if post.author_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized"
        )

    # Delete post
    session.delete(post)
    session.commit()

    # Return confirmation
    return {
    "message": "Deleted successfully",
    "id": post.id
}