from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class ShowSchema(BaseModel):
    id: int
    name: Optional[str] = None
    premiered: Optional[date] = None
    status: Optional[bool] = None
    summary: Optional[str] = None
    image: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class SeasonSchema(BaseModel):
    id: int
    show_id: Optional[int] = None
    number: Optional[int] = None
    name: Optional[str] = None
    episodeOrder: Optional[int] = None
    premiereDate: Optional[date] = None
    endDate: Optional[date] = None
    image: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class EpisodesSchema(BaseModel):
    id: int
    air_date: Optional[datetime] = None
    name: Optional[str] = None
    number: Optional[int] = None
    season: Optional[int] = None
    summary: Optional[str] = None
    image: Optional[str] = None
    show_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)
