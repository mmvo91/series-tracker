import datetime

import pytz
from flask import request
from flask_jwt_extended import (
    jwt_required
)
from flask_restful import Resource

from api import models, schemas, extensions
from api.extensions import sql
from api.logic import logic, wrapper


def today():
    hst = pytz.timezone('US/Hawaii')
    now = datetime.datetime.today()
    return now.astimezone(hst)


class Completions(Resource):
    @jwt_required
    def get(self, user_id):
        subscriptions = sql.session.query(
            models.Watched.show_id,
            sql.case([(sql.func.count(models.Watched.watched).filter(models.Watched.watched.is_(False)) == 0, True)],
                     else_=False).label('watched_subscriptions')
        ).group_by(
            models.Watched.show_id,
        ).subquery()

        seasons = sql.session.query(
            models.Watched.show_id,
            models.Watched.season_id,
            sql.case([(sql.func.count(models.Watched.watched).filter(models.Watched.watched.is_(False)) == 0, True)],
                     else_=False).label('watched_season')
        ).group_by(
            models.Watched.show_id,
            models.Watched.season_id
        ).subquery()

        overall = sql.session.query(
            sql.func.count(subscriptions.c.show_id.distinct()).filter(
                subscriptions.c.watched_subscriptions.is_(True)).label('watched_subscriptions'),
            sql.func.count(models.Watched.show_id.distinct()).label('subscriptions'),
            sql.func.count(seasons.c.season_id.distinct()).filter(seasons.c.watched_season.is_(True)).label(
                'watched_seasons'),
            sql.func.count(models.Watched.season_id.distinct()).label('seasons'),
            sql.func.count(models.Episode.id.distinct()).filter(models.Watched.watched.is_(True)).label(
                'watched_episodes'),
            sql.func.count(models.Episode.id.distinct()).label('episodes'),
            sql.func.sum(models.Episode.run_time).filter(models.Watched.watched.is_(False)).label('unwatched_run_time')
        ).filter(
            models.Watched.user_id == user_id,
            models.Show.premiered <= today(),
            models.Season.premiereDate <= today(),
            models.Episode.air_date <= today(),
        ).join(
            (models.Show, models.Show.id == models.Watched.show_id),
            (models.Subscription, models.Subscription.show_id == models.Watched.show_id),
            (models.Season, models.Season.id == models.Watched.season_id),
            (seasons, seasons.c.season_id == models.Watched.season_id),
            (models.Episode, models.Episode.id == models.Watched.episode_id)
        ).first()

        shows = sql.session.query(
            models.Watched.show_id,
            models.Show.name,
            models.Show.image,
            sql.func.count(seasons.c.season_id.distinct()).filter(seasons.c.watched_season.is_(True)).label(
                'watched_seasons'),
            sql.func.count(models.Watched.season_id.distinct()).label('seasons'),
            sql.func.count(models.Episode.id).filter(models.Watched.watched.is_(True)).label('watched_episodes'),
            sql.func.count(models.Episode.id).label('episodes'),
            sql.func.sum(models.Episode.run_time).filter(models.Watched.watched.is_(False)).label('unwatched_run_time')
        ).filter(
            models.Watched.user_id == user_id,
            models.Show.premiered <= today(),
            models.Season.premiereDate <= today(),
            models.Episode.air_date <= today(),
        ).join(
            (models.Subscription, (models.Subscription.show_id == models.Watched.show_id) & (
                        models.Subscription.user_id == models.Watched.user_id)),
            (models.Show, models.Show.id == models.Watched.show_id),
            (models.Season, models.Season.id == models.Watched.season_id),
            (seasons, seasons.c.season_id == models.Watched.season_id),
            (models.Episode, models.Episode.id == models.Watched.episode_id)
        ).group_by(
            models.Watched.show_id,
            models.Show.name,
            models.Show.image
        ).having(
            sql.func.sum(models.Episode.run_time).filter(models.Watched.watched.is_(False)) > 0
        ).order_by(
            sql.text('unwatched_run_time')
        ).all()

        schema = schemas.CompletionSchema()

        return {
            'overall': schema.dump(overall),
            'show': schema.dump(shows, many=True)
        }


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
        show_id = data['show_id']

        show = models.Show.query.get(show_id)
        if show is None:
            # data = wrapper.Wrapper().query_show(new_subscription)
            data = wrapper.Wrapper().show(show_id)
            id_ = data['id']
            new_subscription = data['name']
            show = models.Show.query.get(id_)

            if show is None:
                logic.add_show(id_)
                show = models.Show.query.get(show_id)

                if show is None:
                    return {'msg': f"Was not able to subscribe to {new_subscription}"}
        else:
            x = models.Subscription.query.get((user_id, show.id))
            if x is not None:
                return {'msg': f'Already subscribed to {new_subscription}'}

        extensions.sql.session.commit()

        logic.subscribe(user_id, show.id)

        return {'msg': f"Successfully subscribed to {new_subscription}"}

    @jwt_required
    def put(self, user_id):
        show_id = request.json['show_id']
        watched = request.json['watched']

        episodes = models.Watched.query.filter(
            models.Watched.user_id == user_id,
            models.Watched.show_id == show_id,
            models.Watched.episode.has(models.Episode.air_date <= today())
        ).all()

        for episode in episodes:
            logic.watched(user_id, show_id, episode.episode_id, watched)

        return {'msg': 'Updated Show'}


class Subscription(Resource):
    @jwt_required
    def get(self, user_id, show_id):
        subscription = models.Subscription.query.get((user_id, show_id))

        schema = schemas.SubscriptionSchema()

        return schema.dump(subscription)

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
            models.Season.number.asc()
        ).filter(
            # models.SeasonWatched.season.has(models.Season.premiereDate <= today()),
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
            models.Watched.watched,
            models.Episode.number
        ).filter(
            # models.Watched.episode.has(models.Episode.air_date <= today()),
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
        queue = models.Watched.query.join(
            models.Episode
        ).order_by(
            models.Episode.air_date,
            models.Episode.number
        ).filter(
            models.Watched.episode.has(models.Episode.air_date <= today()),
            models.Watched.user_id == user_id,
            models.Watched.watched.is_(False)
        ).limit(50).all()

        schema = schemas.SubscriptionWatchSchema(many=True)

        return schema.dump(queue)


class New(Resource):
    @jwt_required
    def get(self, user_id):
        under_two_weeks_ago = today() - datetime.timedelta(days=13)

        new = models.Watched.query.join(models.Episode).order_by(
            models.Episode.air_date
        ).filter(
            models.Watched.episode.has(models.Episode.air_date <= today()),
            models.Watched.episode.has(models.Episode.air_date >= under_two_weeks_ago),
            models.Watched.user_id == user_id,
            models.Watched.watched.is_(False)
        ).all()

        schema = schemas.SubscriptionWatchSchema(many=True)

        return schema.dump(new)


class Upcoming(Resource):
    @jwt_required
    def get(self, user_id):
        new = models.Watched.query.join(models.Episode).order_by(
            models.Episode.air_date
        ).filter(
            models.Watched.episode.has(models.Episode.air_date > today()),
            models.Watched.user_id == user_id,
            models.Watched.watched.is_(False)
        ).all()

        schema = schemas.SubscriptionWatchSchema(many=True)

        return schema.dump(new)


class Recent(Resource):
    def get(self, user_id):
        a_week_ago = today() - datetime.timedelta(days=7)

        recent = models.Subscription.query.order_by(
            models.Subscription.CreatedDate.desc()
        ).filter(
            models.Subscription.user_id == user_id,
            models.Subscription.CreatedDate > a_week_ago
        ).all()

        schema = schemas.SubscriptionSchema(many=True)

        return schema.dump(recent)


class Multiverse(Resource):
    def get(self, user_id):
        multiverse = models.Universe.query.all()

        schema = schemas.UniverseSchema(many=True)

        return schema.dump(multiverse)


class Universe(Resource):
    def get(self, user_id, universe_id):
        universe = models.Universe.query.get(universe_id)
        show_ids = [show.id for show in universe.shows]

        universe_episodes = models.Watched.query.join(
            models.Episode
        ).order_by(
            models.Episode.air_date,
            models.Episode.number
        ).filter(
            models.Watched.show_id.in_(show_ids),
            models.Watched.user_id == user_id,
            models.Watched.watched.is_(False)
        ).all()

        schema = schemas.SubscriptionWatchSchema(many=True)

        return schema.dump(universe_episodes)
