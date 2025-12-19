# FastAPI and SQLAlchemy 2.0 Migration

This document outlines the migration from Flask + SQLAlchemy 1.x to FastAPI + SQLAlchemy 2.0.

## Changes Made

### 1. Dependencies (Pipfile)
- **Removed**: Flask, Flask-RESTful, Flask-SQLAlchemy, Flask-Marshmallow, Flask-JWT-Extended, Flask-Bcrypt, Flask-Migrate, Flask-CORS
- **Added**: FastAPI, Uvicorn, SQLAlchemy 2.0+, Alembic, Pydantic 2.0+, python-jose, passlib
- **Updated**: Python version requirement from 3.7 to 3.10+

### 2. Configuration (api/config.py)
- Migrated from Flask config classes to Pydantic Settings
- Uses `pydantic-settings` for environment-based configuration
- Maintains backward compatibility with existing environment variables

### 3. Database (api/database.py)
- New file replacing Flask-SQLAlchemy extensions
- Uses SQLAlchemy 2.0 with declarative_base
- Implements FastAPI dependency injection pattern for database sessions
- Added `get_db()` dependency for route handlers

### 4. Models
All models migrated to SQLAlchemy 2.0 syntax with typed annotations:
- **api/users/models.py**: User model
- **api/books/models.py**: Book, UserBook models
- **api/movies/models.py**: Movie, AddedMovie, MovieGroup, AddedMovieGroup models
- **api/youtube/models.py**: Channel, Video, SubscribedChannel, SubscribedVideo models
- **api/shows/models/show.py**: Show, Season, Episode models
- **api/shows/models/subscription.py**: Watched, SeasonWatched, Subscription models
- **api/shows/models/universe.py**: Universe model

Key changes in models:
- Use `Mapped[]` type hints instead of `Column()`
- Use `mapped_column()` for column definitions
- Use `relationship()` with proper type hints
- Table metadata attached to Base.metadata for association tables
- Updated `column_property` for SQLAlchemy 2.0 syntax with `scalar_subquery()`

### 5. Authentication (api/auth.py)
- New authentication module replacing Flask-JWT-Extended
- Uses `python-jose` for JWT token handling
- Uses `passlib` with bcrypt for password hashing
- Implements FastAPI dependency injection for current user
- OAuth2 password bearer token scheme

### 6. Schemas
All Marshmallow schemas converted to Pydantic models:
- **api/utils/pydantic_utils.py**: CamelCase utility for field aliases
- **api/users/schemas.py**: UserBase, UserCreate, UserResponse, UserLogin
- **api/books/schemas.py**: BookSchema, UserBookSchema
- **api/movies/schemas.py**: MovieSchema, UserMovieSchema, MovieGroupSchema, UserMovieGroupSchema
- **api/youtube/schemas.py**: VideoSchema, ChannelSchema, SubscribedChannelSchema, SubscribedVideoSchema
- **api/shows/schemas/**: ShowSchema, SeasonSchema, EpisodesSchema, SubscriptionSchema, etc.

Key changes:
- Pydantic models with `model_config = ConfigDict(from_attributes=True)`
- CamelCase alias generator for API compatibility
- Type hints with Optional for nullable fields

### 7. Application Entry Point (api/main.py)
- New FastAPI application replacing Flask app
- CORS middleware configuration
- Router registration for all modules
- Health check and root endpoints
- Database table creation on startup

## Incomplete Items

The following routes need to be migrated to FastAPI routers:

1. **api/users/routes.py** - User CRUD operations
2. **api/token/routes.py** - Authentication endpoints (login, logout, refresh)
3. **api/books/routes.py** - Book management endpoints
4. **api/movies/routes.py** - Movie and movie group endpoints
5. **api/shows/routes.py** - Show, season, episode, subscription endpoints
6. **api/youtube/routes.py** - YouTube channel and video endpoints

Each route file needs to:
- Use FastAPI's `APIRouter`
- Implement dependency injection for database sessions
- Use Pydantic schemas for request/response validation
- Implement proper error handling with HTTPException
- Use the `get_current_user` dependency for authentication

## Running the Application

### Install Dependencies
```bash
pipenv install
```

### Set Environment Variables
```bash
export JWT_SECRET_KEY="your-secret-key"
export SQLALCHEMY_USERNAME="your-db-username"
export SQLALCHEMY_PASSWORD="your-db-password"
export ENVIRONMENT="development"
```

### Run the Application
```bash
# Development
uvicorn api.main:app --reload

# Production
uvicorn api.main:app --host 0.0.0.0 --port 8000
```

### Run Database Migrations
```bash
alembic upgrade head
```

## API Documentation

Once running, FastAPI provides automatic interactive API documentation:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Breaking Changes

1. **Route patterns**: Routes now follow FastAPI patterns (no Flask blueprints)
2. **Authentication**: Tokens are handled via OAuth2 bearer tokens (still compatible with cookies)
3. **Database sessions**: Use dependency injection instead of global `db` object
4. **Validation**: Pydantic handles all request/response validation automatically
5. **Error responses**: FastAPI's exception handlers provide consistent error formatting

## Migration Checklist

- [x] Update dependencies
- [x] Migrate configuration
- [x] Create database utilities
- [x] Migrate all models to SQLAlchemy 2.0
- [x] Implement authentication system
- [x] Convert all schemas to Pydantic
- [x] Create main FastAPI application
- [ ] Migrate users routes
- [ ] Migrate token routes
- [ ] Migrate books routes
- [ ] Migrate shows routes
- [ ] Migrate movies routes
- [ ] Migrate YouTube routes
- [ ] Update database migrations for SQLAlchemy 2.0
- [ ] Test all endpoints
- [ ] Update frontend to work with new API

## Notes

- The migration maintains the same database schema, so existing data should work without changes
- The API responses should be compatible with the existing frontend (camelCase fields preserved)
- Cookie-based authentication is still supported alongside bearer tokens
- All timestamps and dates are handled consistently across the application
