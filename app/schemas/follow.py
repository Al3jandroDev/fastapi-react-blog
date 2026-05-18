from sqlmodel import SQLModel


class FollowRead(SQLModel):
    follower_id: int
    following_id: int