from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource

from api import extensions
from api.youtube import models, schemas, services


class Channels(Resource):
    @jwt_required
    def get(self):
        channels = models.SubscribedChannel.query.filter_by(
            user_id=get_jwt_identity()
        ).all()

        schema = schemas.SubscribedChannelSchema()

        return schema.dump(channels, many=True)

    @jwt_required
    def post(self):
        data = request.json

        link = data['link']

        channel_id = link.split('/')[-1]

        x = services.ChannelService(get_jwt_identity(), channel_id).get_by_id()

        if x is not None:
            return {'msg': 'Successfully created'}
        else:
            return {'msg': 'Not successfully created'}


class Channel(Resource):
    @jwt_required
    def get(self, channel_id):
        subscribed_channel = models.SubscribedChannel.query.get((get_jwt_identity(), channel_id))

        schema = schemas.SubscribedChannelSchema()

        return schema.dump(subscribed_channel)


class Videos(Resource):
    @jwt_required
    def get(self, channel_id):
        subscribed_video = models.SubscribedVideo.query.filter_by(
            user_id=get_jwt_identity(),
            channel_id=channel_id
        ).order_by(
            models.SubscribedVideo.watched
        )

        schema = schemas.SubscribedVideoSchema()

        return extensions.pagination.paginate(subscribed_video, schema, True)

    @jwt_required
    def put(self, channel_id):
        data = request.json

        subscribed_video = models.SubscribedVideo.query.get((get_jwt_identity(), channel_id, data['video_id']))

        if subscribed_video is not None:
            subscribed_video.watched = data['watched']

            extensions.sql.session.commit()

            return {'msg': 'Video watched'}

        return {'msg': 'Video not found'}
