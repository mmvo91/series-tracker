from typing import Optional
from pydantic import BaseModel, ConfigDict

from .show import ShowSchema, SeasonSchema, EpisodesSchema


class SubscriptionSchema(BaseModel):
    user_id: int
    show_id: int
    watched: bool = False
    show: Optional[ShowSchema] = None

    model_config = ConfigDict(from_attributes=True)


class SeasonWatchSchema(BaseModel):
    user_id: int
    show_id: int
    season_id: int
    watched: bool = False
    season: Optional[SeasonSchema] = None

    model_config = ConfigDict(from_attributes=True)


class WatchSchema(BaseModel):
    user_id: int
    show_id: int
    season_id: Optional[int] = None
    episode_id: int
    watched: bool = False
    hidden: bool = False
    episode: Optional[EpisodesSchema] = None

    model_config = ConfigDict(from_attributes=True)


class SubscriptionWatchSchema(BaseModel):
    user_id: int
    show_id: int
    season_id: Optional[int] = None
    episode_id: int
    watched: bool = False
    hidden: bool = False
    episode: Optional[EpisodesSchema] = None
    show: Optional[ShowSchema] = None

    model_config = ConfigDict(from_attributes=True)


class CompletionSchema(BaseModel):
    show_id: Optional[int] = None
    name: Optional[str] = None
    image: Optional[str] = None
    watched_subscriptions: Optional[int] = None
    subscriptions: Optional[int] = None
    watched_seasons: Optional[int] = None
    seasons: Optional[int] = None
    watched_episodes: Optional[int] = None
    episodes: Optional[int] = None
    unwatched_run_time: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)
