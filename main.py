# FastAPI core
from fastapi import FastAPI

# Database initialization
from app.db.database import create_db_and_tables

# Routers (modular API structure)
from app.routes import posts, comments, auth

# Create FastAPI app instance
app = FastAPI()

# STARTUP EVENT
@app.on_event("startup")
def on_startup():
    """
    Runs when the application starts
    Used here to initialize the database
    """

    # Automatically create database tables (useful for development)
    # In production, this should be handled by migrations (e.g., Alembic)
    create_db_and_tables()


# ROUTERS
# Register API route modules
app.include_router(posts.router)
app.include_router(comments.router)
app.include_router(auth.router)


# ROOT ENDPOINT
@app.get("/")
def read_root():
    """
    Basic health check endpoint
    """
    return {
        "message": "API is running",
        "docs": "/docs"
    }


# CORS CONFIGURATION
# Enables communication between frontend (React) and backend
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    # Allow requests from React (Vite dev server)
    allow_origins=["http://localhost:5173"],

    # Allow cookies / auth headers
    allow_credentials=True,

    # Allow all HTTP methods (GET, POST, etc.)
    allow_methods=["*"],

    # Allow all headers (Authorization, Content-Type, etc.)
    allow_headers=["*"],
)