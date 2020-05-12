from marshmallow import fields

from api import models
from api.extensions import ma
from api.schemas import ShowSchema, SeasonSchema, EpisodesSchema


class SubscriptionSchema(ma.SQLAlchemyAutoSchema):
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


class SeasonWatchSchema(ma.SQLAlchemyAutoSchema):
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


class WatchSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = models.Watched
        exclude = [
            'ModifiedDate',
            'ModifiedBy',
            'CreatedDate',
            'CreatedBy'
        ]

    episode = ma.Nested(EpisodesSchema)


class SubscriptionWatchSchema(ma.SQLAlchemyAutoSchema):
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


class CompletionSchema(ma.SQLAlchemySchema):
    show_id = fields.Int()
    name = fields.Str()
    image = fields.Str()
    watched_subscriptions = fields.Int()
    subscriptions = fields.Int()
    watched_seasons = fields.Int()
    seasons = fields.Int()
    watched_episodes = fields.Int()
    episodes = fields.Int()
    unwatched_run_time = fields.Int()
