from sqlmodel import SQLModel
from typing import Optional, List
from datetime import datetime


from app.schemas.post import PostRead


# =========================
# USER PROFILE RESPONSE
# =========================
class UserProfile(SQLModel):

    id: int

    username: str

    bio: Optional[str] = "No bio yet"

    posts: List[PostRead] = []

    avatar_url: str | None = None
    banner_url: str | None = None 

    followers_count: int = 0  
    following_count: int = 0  
    
    created_at: datetime | None = None 