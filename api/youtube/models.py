from datetime import datetime
from typing import Optional, List
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, func, select, and_
from sqlalchemy.orm import Mapped, mapped_column, relationship, column_property

from api.database import Base


class Channel(Base):
    __tablename__ = 'channels'

    id: Mapped[str] = mapped_column(String, primary_key=True)
    title: Mapped[Optional[str]] = mapped_column(String)
    description: Mapped[Optional[str]] = mapped_column(String)
    image: Mapped[Optional[str]] = mapped_column(String)

    videos: Mapped[List["Video"]] = relationship('Video', back_populates='channel')

    ModifiedDate: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())
    ModifiedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")
    CreatedDate: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    CreatedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")


class Video(Base):
    __tablename__ = 'videos'

    id: Mapped[str] = mapped_column(String, primary_key=True)
    channel_id: Mapped[Optional[str]] = mapped_column(String, ForeignKey('channels.id'))
    title: Mapped[Optional[str]] = mapped_column(String)
    description: Mapped[Optional[str]] = mapped_column(String)
    image: Mapped[Optional[str]] = mapped_column(String)
    publish_date: Mapped[Optional[datetime]] = mapped_column(DateTime)
    duration: Mapped[Optional[int]] = mapped_column(Integer)

    channel: Mapped[Optional["Channel"]] = relationship('Channel', back_populates='videos')

    ModifiedDate: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())
    ModifiedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")
    CreatedDate: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    CreatedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")


class SubscribedVideo(Base):
    __tablename__ = 'subscribed_videos'

    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), primary_key=True)
    channel_id: Mapped[str] = mapped_column(String, ForeignKey('channels.id'), primary_key=True)
    video_id: Mapped[str] = mapped_column(String, ForeignKey('videos.id'), primary_key=True)
    watched: Mapped[bool] = mapped_column(Boolean, default=False)

    video: Mapped["Video"] = relationship('Video')

    ModifiedDate: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())
    ModifiedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")
    CreatedDate: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    CreatedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")


class SubscribedChannel(Base):
    __tablename__ = "subscribed_channels"

    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id'), primary_key=True)
    channel_id: Mapped[str] = mapped_column(String, ForeignKey('channels.id'), primary_key=True)

    channel: Mapped["Channel"] = relationship('Channel')
    videos: Mapped[List["SubscribedVideo"]] = relationship(
        'SubscribedVideo',
        primaryjoin="and_(SubscribedChannel.user_id==SubscribedVideo.user_id, SubscribedChannel.channel_id==SubscribedVideo.channel_id)",
        foreign_keys="[SubscribedVideo.user_id, SubscribedVideo.channel_id]",
        viewonly=True
    )

    watched: Mapped[int] = column_property(
        select(func.count(SubscribedVideo.channel_id))
        .where(
            and_(
                user_id == SubscribedVideo.user_id,
                channel_id == SubscribedVideo.channel_id,
                SubscribedVideo.watched.is_(True)
            )
        )
        .correlate_except(SubscribedVideo)
        .scalar_subquery()
    )

    unwatched: Mapped[int] = column_property(
        select(func.count(SubscribedVideo.channel_id))
        .where(
            and_(
                user_id == SubscribedVideo.user_id,
                channel_id == SubscribedVideo.channel_id,
                SubscribedVideo.watched.is_(False)
            )
        )
        .correlate_except(SubscribedVideo)
        .scalar_subquery()
    )

    ModifiedDate: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())
    ModifiedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")
    CreatedDate: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    CreatedBy: Mapped[str] = mapped_column(String, default="sqlAlchemy")
