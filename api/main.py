from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.config import settings
from api.database import Base, engine
from api.users import routes as user_routes
from api.token import routes as token_routes
from api.books import routes as book_routes
from api.shows import routes as show_routes
from api.movies import routes as movie_routes
from api.youtube import routes as youtube_routes

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="Series Tracker API",
    description="API for tracking TV series, movies, books, and YouTube content",
    version="2.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(user_routes.router, prefix="/users", tags=["users"])
app.include_router(token_routes.router, prefix="/token", tags=["token"])
app.include_router(book_routes.router, prefix="/books", tags=["books"])
app.include_router(show_routes.router, prefix="/shows", tags=["shows"])
app.include_router(movie_routes.router, prefix="/movies", tags=["movies"])
app.include_router(youtube_routes.router, prefix="/youtube", tags=["youtube"])


@app.get("/")
async def root():
    return {"message": "Series Tracker API v2.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
