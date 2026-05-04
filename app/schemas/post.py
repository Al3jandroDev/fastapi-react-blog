from pydantic import field_validator
from sqlmodel import SQLModel


# POST SCHEMAS (DTOs)
# These classes define how post data is sent and received via the API
# They are NOT database models
# Used for validation, serialization, and controlling exposed fields


# POST CREATE SCHEMA
# Used when creating a new post
# Only includes fields provided by the client
class PostCreate(SQLModel):
    title: str
    content: str

    @field_validator("title", "content")
    @classmethod
    def not_empty(cls, value):
        if not value.strip():
            raise ValueError("Field cannot be empty")
        return value

# POST READ SCHEMA
# Used when returning post data from the API
# Includes database-generated and relational fields
class PostRead(SQLModel):
    id: int
    title: str
    content: str
    author_id: int
    author_username: str


# POST UPDATE SCHEMA
# Used for partial updates (PATCH requests)
# Fields are optional to allow updating only specific values
class PostUpdate(SQLModel):
    title: str | None = None
    content: str | None = None

    @field_validator("title", "content")
    @classmethod
    def not_empty(cls, value):
        if value is not None and not value.strip():
            raise ValueError("Field cannot be empty")
        return value