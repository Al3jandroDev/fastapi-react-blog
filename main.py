# FastAPI core
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

# DB
from app.db.database import create_db_and_tables

# Routes
from app.routes import posts, comments, auth, likes, users, follow, upload

# =========================
# APP
# =========================
app = FastAPI()

# Static files (avatars, banners, uploads)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# =========================
# CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# STARTUP
# =========================
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# =========================
# ROUTES
# =========================
app.include_router(posts.router)
app.include_router(comments.router)
app.include_router(auth.router)
app.include_router(likes.router)
app.include_router(users.router)
app.include_router(follow.router)
app.include_router(upload.router)

# =========================
# HEALTH CHECK
# =========================
@app.get("/")
def read_root():
    return {
        "message": "API is running",
        "docs": "/docs"
    }