from . import models
from api.extensions import ma
from api.utils.schema import CamelCaseSchema


class VideoSchema(CamelCaseSchema):
    class Meta:
        model = models.Video
        exclude = [
            'ModifiedDate',
            'ModifiedBy',
            'CreatedDate',
            'CreatedBy'
        ]


class ChannelSchema(CamelCaseSchema):
    class Meta:
        model = models.Channel
        exclude = [
            'ModifiedDate',
            'ModifiedBy',
            'CreatedDate',
            'CreatedBy'
        ]


class SubscribedChannelSchema(CamelCaseSchema):
    watched = ma.Integer(dump_only=True)
    unwatched = ma.Integer(dump_only=True)

    class Meta:
        model = models.SubscribedChannel
        exclude = [
            'ModifiedDate',
            'ModifiedBy',
            'CreatedDate',
            'CreatedBy'
        ]

    channel = ma.Nested(ChannelSchema)


class SubscribedVideoSchema(CamelCaseSchema):
    class Meta:
        model = models.SubscribedVideo
        exclude = [
            'ModifiedDate',
            'ModifiedBy',
            'CreatedDate',
            'CreatedBy'
        ]

    video = ma.Nested(VideoSchema)
