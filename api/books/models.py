from datetime import date, datetime
from typing import Optional
from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api.database import Base


class Book(Base):
    __tablename__ = "books"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    title: Mapped[Optional[str]] = mapped_column(String)
    subtitle: Mapped[Optional[str]] = mapped_column(String)
    description: Mapped[Optional[str]] = mapped_column(String)
    publish_date: Mapped[Optional[date]] = mapped_column(Date)
    image: Mapped[Optional[str]] = mapped_column(String)

    author: Mapped[Optional[str]] = mapped_column(String)
    publisher: Mapped[Optional[str]] = mapped_column(String)

    ModifiedDate: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())
    ModifiedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")
    CreatedDate: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    CreatedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")


class UserBook(Base):
    __tablename__ = "user_books"

    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), primary_key=True)
    book_id: Mapped[str] = mapped_column(String, ForeignKey('books.id'), primary_key=True)
    read: Mapped[bool] = mapped_column(Boolean, default=False)

    ModifiedDate: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())
    ModifiedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")
    CreatedDate: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    CreatedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")

    book: Mapped["Book"] = relationship('Book')
