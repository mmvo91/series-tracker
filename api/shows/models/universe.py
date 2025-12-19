from datetime import datetime
from typing import Optional, List
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Table, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api.database import Base

universe_shows = Table(
    'universe_shows',
    Base.metadata,
    Column('universe_id', Integer, ForeignKey('universe.id')),
    Column('show_id', Integer, ForeignKey('shows.id'))
)


class Universe(Base):
    __tablename__ = 'universe'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[Optional[str]] = mapped_column(String)
    summary: Mapped[Optional[str]] = mapped_column(String)

    ModifiedDate: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())
    ModifiedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")
    CreatedDate: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    CreatedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")

    shows: Mapped[List["Show"]] = relationship("Show", secondary=universe_shows)  # type: ignore
