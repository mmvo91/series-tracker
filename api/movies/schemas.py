from datetime import date
from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class MovieSchema(BaseModel):
    id: str
    title: Optional[str] = None
    release: Optional[date] = None
    rating: Optional[str] = None
    summary: Optional[str] = None
    image: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class UserMovieSchema(BaseModel):
    user_id: int
    movie_id: str
    watched: bool = False
    movie: Optional[MovieSchema] = None

    model_config = ConfigDict(from_attributes=True)


class MovieGroupSchema(BaseModel):
    id: int
    name: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    movies: List[MovieSchema] = []

    model_config = ConfigDict(from_attributes=True)


class UserMovieGroupSchema(BaseModel):
    user_id: int
    movie_group_id: int
    movie_group: Optional[MovieGroupSchema] = None
    movies: List[UserMovieSchema] = []

    model_config = ConfigDict(from_attributes=True)
