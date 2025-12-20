import datetime
from typing import Optional
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, func, select, and_, case
from sqlalchemy.orm import Mapped, mapped_column, relationship, column_property

from api.database import Base
from .show import Episode


def today():
    return datetime.datetime.today()


class Watched(Base):
    __tablename__ = 'watched'

    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), primary_key=True)
    show_id: Mapped[int] = mapped_column(Integer, ForeignKey('shows.id'), primary_key=True)
    season_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey('seasons.id'))
    episode_id: Mapped[int] = mapped_column(Integer, ForeignKey('episodes.id'), primary_key=True)
    watched: Mapped[bool] = mapped_column(Boolean, default=False)
    hidden: Mapped[bool] = mapped_column(Boolean, default=False)
    ModifiedDate: Mapped[datetime.datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())
    ModifiedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")
    CreatedDate: Mapped[datetime.datetime] = mapped_column(DateTime, default=func.now())
    CreatedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")

    show: Mapped["Show"] = relationship('Show')  # type: ignore
    episode: Mapped["Episode"] = relationship('Episode')


class SeasonWatched(Base):
    __tablename__ = 'season_watched'

    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), primary_key=True)
    show_id: Mapped[int] = mapped_column(Integer, ForeignKey('shows.id'), primary_key=True)
    season_id: Mapped[int] = mapped_column(Integer, ForeignKey('seasons.id'), primary_key=True)
    ModifiedDate: Mapped[datetime.datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())
    ModifiedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")
    CreatedDate: Mapped[datetime.datetime] = mapped_column(DateTime, default=func.now())
    CreatedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")

    season: Mapped["Season"] = relationship('Season')  # type: ignore

    watched: Mapped[bool] = column_property(
        select(
            case(
                (func.count(Watched.episode_id) == 0, True),
                else_=False
            )
        ).where(
            and_(
                Watched.episode.has(Episode.air_date < today()),
                Watched.show_id == show_id,
                Watched.user_id == user_id,
                Watched.season_id == season_id,
                Watched.watched.is_(False)
            )
        )
        .correlate_except(Watched)
        .scalar_subquery()
    )


class Subscription(Base):
    __tablename__ = 'subscribe'
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), primary_key=True)
    show_id: Mapped[int] = mapped_column(Integer, ForeignKey('shows.id'), primary_key=True)
    ModifiedDate: Mapped[datetime.datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())
    ModifiedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")
    CreatedDate: Mapped[datetime.datetime] = mapped_column(DateTime, default=func.now())
    CreatedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")

    show: Mapped["Show"] = relationship('Show')  # type: ignore

    watched: Mapped[bool] = column_property(
        select(
            case(
                (func.count(Watched.episode_id) == 0, True),
                else_=False
            )
        ).where(
            and_(
                Watched.episode.has(Episode.air_date < today()),
                Watched.show_id == show_id,
                Watched.user_id == user_id,
                Watched.watched.is_(False)
            )
        )
        .correlate_except(Watched)
        .scalar_subquery()
    )
