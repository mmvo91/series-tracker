import datetime

from flask import request, jsonify
from flask_jwt_extended import (
    create_access_token, create_refresh_token, set_access_cookies, set_refresh_cookies,
    jwt_required, get_jwt_identity
)
from flask_restful import Resource

import extensions
from api import models, schemas
from logic import logic, wrapper

TODAY = datetime.datetime.today()


class Token(Resource):
    @jwt_required
    def get(self):
        x = get_jwt_identity()
        return {'id': x, 'msg': 'Valid token'}

    def post(self):
        data = request.json
        username = data['username']
        password = data['password']

        current = models.User.query.filter_by(username=username).first()
        if current is None:
            return {'msg': 'Error logging in'}
        else:
            if extensions.bcrypt.check_password_hash(current.password, password):

                access_token = create_access_token(identity=current.id)
                refresh_token = create_refresh_token(identity=current.id)

                response = jsonify({'id': current.id, 'msg': 'Logged in successfully'})

                set_access_cookies(response, access_token)
                set_refresh_cookies(response, refresh_token)

                return response
            else:
                return {'msg': 'Error logging in'}


class Users(Resource):
    @jwt_required
    def post(self):
        data = request.json
        username = data['username']
        password = data['password']

        current = models.User.query.filter_by(username=username).first()
        if current is not None:
            return {'msg': f'Username {current.username} is already taken. Please try another name'}
        else:
            hashed = extensions.bcrypt.generate_password_hash(password)
            new = models.User(username=username, password=hashed.decode('utf-8'))
            extensions.sql.session.add(new)
            extensions.sql.session.commit()
            return {'msg': 'User Created'}

    @jwt_required
    def put(self):
        data = request.json
        username = data['username']
        password = data['password']
        new_password = data['new_password']

        user = models.User.query.filter_by(username=username).first()

        if extensions.bcrypt.check_password_hash(user.password, password):
            hashed = extensions.bcrypt.generate_password_hash(new_password)

            user.password = hashed

            extensions.sql.session.add(user)
            extensions.sql.session.commit()

            return {'msg': 'Password updated'}
        else:
            return {'msg': 'Current password is incorrect'}


class User(Resource):
    @jwt_required
    def get(self, user_id):
        user = models.User.query.get(user_id)
        schema = schemas.UserSchema()
        return schema.dump(user)


class Subscriptions(Resource):
    @jwt_required
    def get(self, user_id):
        subscription = models.Subscription.query.join(
            models.Show
        ).order_by(
            models.Subscription.watched,
            models.Show.name
        ).filter(
            models.Subscription.user_id == user_id
        ).all()

        schema = schemas.SubscriptionSchema(many=True)

        return schema.dump(subscription)

    @jwt_required
    def post(self, user_id):
        data = request.json

        new_subscription = data['show']

        show = models.Show.query.filter_by(name=new_subscription).first()

        if show is None:
            data = wrapper.Wrapper().query_show(new_subscription)
            id_ = data['id']
            new_subscription = data['name']
            show = models.Show.query.get(id_)

            if show is None:
                logic.add_show(new_subscription)
                show = models.Show.query.filter_by(name=new_subscription).first()

                if show is None:
                    return {'msg': f"Was not able to subscribe to {new_subscription}"}

        extensions.sql.session.commit()

        logic.subscribe(user_id, show.id)

        return {'msg': f"Successfully subscribed to {new_subscription}"}

    @jwt_required
    def put(self, user_id):
        show_id = request.json['show_id']
        watched = request.json['watched']

        episodes = models.Watched.query.filter_by(user_id=user_id, show_id=show_id).all()

        for episode in episodes:
            logic.watched(user_id, show_id, episode.episode_id, watched)

        return {'msg': 'Updated Show'}


class Subscription(Resource):
    @jwt_required
    def delete(self, user_id, show_id):
        subscription = models.Subscription.query.get((user_id, show_id))

        extensions.sql.session.delete(subscription)
        extensions.sql.session.commit()

        return {'msg': 'Unsubscribed'}


class Seasons(Resource):
    @jwt_required
    def get(self, user_id, show_id):
        seasons = models.SeasonWatched.query.join(
            models.Season
        ).order_by(
            models.Season.number.desc()
        ).filter(
            models.SeasonWatched.season.has(models.Season.premiereDate < TODAY),
            models.SeasonWatched.user_id == user_id,
            models.SeasonWatched.show_id == show_id
        ).all()
        schema = schemas.SeasonWatchSchema(many=True)

        return schema.dump(seasons)

    @jwt_required
    def put(self, user_id, show_id):
        season = request.json['season']
        watched = request.json['watched']

        episodes = models.Episode.query.filter_by(show_id=show_id, season=season).all()
        for episode in episodes:
            logic.watched(user_id, show_id, episode.id, watched)

        return {'msg': 'Updated Season'}


class Episodes(Resource):
    @jwt_required
    def get(self, user_id, show_id):
        params = request.args

        watched = models.Watched.query.join(models.Episode).order_by(
            models.Episode.number.desc()
        ).filter(
            models.Watched.episode.has(models.Episode.air_date < TODAY),
            models.Watched.user_id == user_id,
            models.Watched.show_id == show_id
        )

        for param in params:
            d = {param: params[param]}
            watched = watched.filter(models.Watched.episode.has(**d))

        watched.all()

        schema = schemas.WatchSchema(many=True)
        data = schema.dump(watched)

        return data

    @jwt_required
    def put(self, user_id, show_id):
        episode_id = request.json['id']
        watch_state = request.json['watched']

        watched = models.Watched.query.get((user_id, show_id, episode_id))

        watched.watched = watch_state

        extensions.sql.session.add(watched)
        extensions.sql.session.commit()

        return {'msg': 'Updated'}


class Queue(Resource):
    @jwt_required
    def get(self, user_id):
        queue = models.Watched.query.join(models.Episode).order_by(
            models.Episode.air_date
        ).filter(
            models.Watched.episode.has(models.Episode.air_date < TODAY),
            models.Watched.user_id == user_id,
            models.Watched.watched.is_(False)
        ).all()

        schema = schemas.SubscriptionWatchSchema(many=True)

        return schema.dump(queue)


class New(Resource):
    @jwt_required
    def get(self, user_id):
        under_two_weeks_ago = TODAY - datetime.timedelta(days=13)

        new = models.Watched.query.join(models.Episode).order_by(
            models.Episode.air_date.desc()
        ).filter(
            models.Watched.episode.has(models.Episode.air_date < TODAY),
            models.Watched.episode.has(models.Episode.air_date > under_two_weeks_ago),
            models.Watched.user_id == user_id,
            models.Watched.watched.is_(False)
        ).all()

        schema = schemas.SubscriptionWatchSchema(many=True)

        return schema.dump(new)


class Upcoming(Resource):
    def get(self, user_id):
        new = models.Watched.query.join(models.Episode).order_by(
            models.Episode.air_date
        ).filter(
            models.Watched.episode.has(models.Episode.air_date > TODAY),
            models.Watched.user_id == user_id,
            models.Watched.watched.is_(False)
        ).all()

        schema = schemas.SubscriptionWatchSchema(many=True)

        return schema.dump(new)
