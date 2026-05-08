from sqlmodel import SQLModel
from typing import Optional, List

from app.schemas.post import PostRead


# =========================
# USER PROFILE RESPONSE
# =========================
class UserProfile(SQLModel):

    id: int

    username: str

    bio: Optional[str] = "No bio yet"

    posts: List[PostRead] = []