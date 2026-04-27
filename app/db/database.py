from sqlmodel import Session, SQLModel, create_engine, select
import os
from dotenv import load_dotenv


# LOAD ENV VARIABLES
# Load environment variables from .env file
# This allows you to store sensitive data (like DB credentials) outside the code
load_dotenv()


# DATABASE CONFIGURATION
# Read the database URL from environment variables
# Example: postgresql://user:password@localhost/dbname
DATABASE_URL = os.getenv("DATABASE_URL")


# Raise an error if the environment variable is missing
# This prevents the app from running with an invalid configuration
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set")


# ENGINE CREATION
# Create the SQLAlchemy/SQLModel engine
# This is the core connection to the database
engine = create_engine(DATABASE_URL)


# CREATE TABLES
def create_db_and_tables():
    """
    Create all database tables based on SQLModel metadata

    This will generate tables for all models that inherit from SQLModel
    It should be called once at application startup
    """
    SQLModel.metadata.create_all(engine)


# DATABASE SESSION
def get_session():
    """
    Dependency that provides a database session

    This function is used with FastAPI Depends() to inject
    a database session into route handlers

    The session is automatically closed after the request finishes
    """
    with Session(engine) as session:
        yield session
