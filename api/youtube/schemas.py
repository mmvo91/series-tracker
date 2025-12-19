from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

from api.utils.pydantic_utils import CamelCaseModel


class VideoSchema(CamelCaseModel):
    id: str
    channel_id: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    publish_date: Optional[datetime] = None
    duration: Optional[int] = None


class ChannelSchema(CamelCaseModel):
    id: str
    title: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None


class SubscribedChannelSchema(CamelCaseModel):
    user_id: int
    channel_id: str
    watched: int = 0
    unwatched: int = 0
    channel: Optional[ChannelSchema] = None


class SubscribedVideoSchema(CamelCaseModel):
    user_id: int
    channel_id: str
    video_id: str
    watched: bool = False
    video: Optional[VideoSchema] = None
