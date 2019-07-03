from api import models
from extensions import ma
from .show import ShowSchema, SeasonSchema, EpisodesSchema


class SubscriptionSchema(ma.ModelSchema):
    watched = ma.Boolean(dump_only=True)

    class Meta:
        model = models.Subscription
        exclude = [
            'ModifiedDate',
            'ModifiedBy',
            'CreatedDate',
            'CreatedBy'
        ]

    show = ma.Nested(ShowSchema)


class SeasonWatchSchema(ma.ModelSchema):
    watched = ma.Boolean(dump_only=True)

    class Meta:
        model = models.SeasonWatched
        exclude = [
            'ModifiedDate',
            'ModifiedBy',
            'CreatedDate',
            'CreatedBy'
        ]

    season = ma.Nested(SeasonSchema)


class WatchSchema(ma.ModelSchema):
    class Meta:
        model = models.Watched
        exclude = [
            'ModifiedDate',
            'ModifiedBy',
            'CreatedDate',
            'CreatedBy'
        ]

    episode = ma.Nested(EpisodesSchema)


class SubscriptionWatchSchema(ma.ModelSchema):
    class Meta:
        model = models.Watched
        exclude = [
            'ModifiedDate',
            'ModifiedBy',
            'CreatedDate',
            'CreatedBy'
        ]

    episode = ma.Nested(EpisodesSchema)
    show = ma.Nested(ShowSchema)
