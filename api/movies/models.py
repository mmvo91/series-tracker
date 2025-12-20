from datetime import date, datetime
from typing import Optional, List
from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, String, Table, Column, func, and_
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api.database import Base

movie_group_movies = Table(
    'movie_groups_movies',
    Base.metadata,
    Column('movie_group_id', Integer, ForeignKey('movie_groups.id')),
    Column('movie_id', String, ForeignKey('movies.id')),
    Column('sequence', Integer)
)


class Movie(Base):
    __tablename__ = 'movies'

    id: Mapped[str] = mapped_column(String, primary_key=True)
    title: Mapped[Optional[str]] = mapped_column(String)
    release: Mapped[Optional[date]] = mapped_column(Date)
    rating: Mapped[Optional[str]] = mapped_column(String)
    runtime: Mapped[Optional[int]] = mapped_column(Integer)
    summary: Mapped[Optional[str]] = mapped_column(String)
    image: Mapped[Optional[str]] = mapped_column(String)

    ModifiedDate: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())
    ModifiedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")
    CreatedDate: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    CreatedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")


class AddedMovie(Base):
    __tablename__ = "added_movie"

    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), primary_key=True)
    movie_id: Mapped[str] = mapped_column(String, ForeignKey('movies.id'), primary_key=True)
    watched: Mapped[bool] = mapped_column(Boolean, default=False)

    movie: Mapped["Movie"] = relationship('Movie')

    ModifiedDate: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())
    ModifiedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")
    CreatedDate: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    CreatedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")


class MovieGroup(Base):
    __tablename__ = "movie_groups"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[Optional[str]] = mapped_column(String)
    description: Mapped[Optional[str]] = mapped_column(String)
    type: Mapped[Optional[str]] = mapped_column(String)

    movies: Mapped[List["Movie"]] = relationship(
        'Movie',
        secondary=movie_group_movies,
        order_by=[movie_group_movies.c.sequence, Movie.release]
    )

    ModifiedDate: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())
    ModifiedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")
    CreatedDate: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    CreatedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")


class AddedMovieGroup(Base):
    __tablename__ = "added_movie_groups"

    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), primary_key=True)
    movie_group_id: Mapped[int] = mapped_column(Integer, ForeignKey('movie_groups.id'), primary_key=True)

    movie_group: Mapped["MovieGroup"] = relationship('MovieGroup')

    movies: Mapped[List["AddedMovie"]] = relationship(
        "AddedMovie",
        primaryjoin=and_(
            movie_group_id == movie_group_movies.c.movie_group_id,
            user_id == AddedMovie.user_id
        ),
        secondary=movie_group_movies,
        secondaryjoin=and_(
            user_id == AddedMovie.user_id,
            movie_group_id == movie_group_movies.c.movie_group_id,
            movie_group_movies.c.movie_id == AddedMovie.movie_id,
            AddedMovie.movie_id == Movie.id
        ),
        order_by=[movie_group_movies.c.sequence, Movie.release],
        viewonly=True
    )
