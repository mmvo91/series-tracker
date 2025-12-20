from datetime import date, datetime
from typing import Optional, List
from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api.database import Base


class Show(Base):
    __tablename__ = 'shows'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[Optional[str]] = mapped_column(String)
    premiered: Mapped[Optional[date]] = mapped_column(Date)
    status: Mapped[Optional[bool]] = mapped_column(Boolean)
    summary: Mapped[Optional[str]] = mapped_column(String)
    image: Mapped[Optional[str]] = mapped_column(String)
    ModifiedDate: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())
    ModifiedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")
    CreatedDate: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    CreatedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")

    episodes: Mapped[List["Episode"]] = relationship("Episode", back_populates="show")


class Season(Base):
    __tablename__ = 'seasons'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    show_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey('shows.id'))
    number: Mapped[Optional[int]] = mapped_column(Integer)
    name: Mapped[Optional[str]] = mapped_column(String)
    episodeOrder: Mapped[Optional[int]] = mapped_column(Integer)
    premiereDate: Mapped[Optional[date]] = mapped_column(Date)
    endDate: Mapped[Optional[date]] = mapped_column(Date)
    image: Mapped[Optional[str]] = mapped_column(String)
    ModifiedDate: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())
    ModifiedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")
    CreatedDate: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    CreatedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")


class Episode(Base):
    __tablename__ = 'episodes'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    air_date: Mapped[Optional[datetime]] = mapped_column(DateTime)
    name: Mapped[Optional[str]] = mapped_column(String)
    number: Mapped[Optional[int]] = mapped_column(Integer)
    season: Mapped[Optional[int]] = mapped_column(Integer)
    summary: Mapped[Optional[str]] = mapped_column(String)
    run_time: Mapped[Optional[int]] = mapped_column(Integer)
    image: Mapped[Optional[str]] = mapped_column(String)
    show_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey('shows.id'))
    ModifiedDate: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())
    ModifiedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")
    CreatedDate: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    CreatedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")

    show: Mapped[Optional["Show"]] = relationship("Show", back_populates="episodes")
