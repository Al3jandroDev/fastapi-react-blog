from sqlmodel import SQLModel
from datetime import datetime


# COMMENT SCHEMAS (DTOs)
# These classes define how comment data is sent and received through the API
# They are NOT database models
# Used for validation, serialization, and controlling exposed data


# COMMENT CREATE SCHEMA
# Used when creating a new comment
# Only requires the comment content from the user
class CommentCreate(SQLModel):
    content: str


# COMMENT READ SCHEMA
# Used when returning comment data from the API
# Includes metadata like author and post relations
class CommentRead(SQLModel):
    id: int
    content: str
    post_id: int
    author_id: int


# COMMENT UPDATE SCHEMA
# Used when updating a comment
# content is optional to allow partial updates (PATCH behavior)
class CommentUpdate(SQLModel):
    content: str | None = None