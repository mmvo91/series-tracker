from api import models
from extensions import ma
from .show import ShowSchema, SeasonSchema, EpisodesSchema


class SubscriptionSchema(ma.ModelSchema):
    watched = ma.Boolean(dump_only=True)

    class Meta:
        model = models.Subscription

    show = ma.Nested(ShowSchema)


class SeasonWatchSchema(ma.ModelSchema):
    watched = ma.Boolean(dump_only=True)

    class Meta:
        model = models.SeasonWatched

    season = ma.Nested(SeasonSchema)


class WatchSchema(ma.ModelSchema):
    class Meta:
        model = models.Watched

    episode = ma.Nested(EpisodesSchema)


class SubscriptionWatchSchema(ma.ModelSchema):
    class Meta:
        model = models.Watched

    episode = ma.Nested(EpisodesSchema)
    show = ma.Nested(ShowSchema)
