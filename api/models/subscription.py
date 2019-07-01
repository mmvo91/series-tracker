import datetime

from extensions import sql
from .show import Episode

TODAY = datetime.datetime.today()


class Watched(sql.Model):
    __tablename__ = 'watched'

    user_id = sql.Column(sql.Integer, sql.ForeignKey('users.id'), primary_key=True)
    show_id = sql.Column(sql.Integer, sql.ForeignKey('shows.id'), primary_key=True)
    season_id = sql.Column(sql.Integer, sql.ForeignKey('seasons.id'))
    episode_id = sql.Column(sql.Integer, sql.ForeignKey('episodes.id'), primary_key=True)
    watched = sql.Column(sql.Boolean, default=False)

    show = sql.relationship('Show')
    episode = sql.relationship('Episode')


class SeasonWatched(sql.Model):
    user_id = sql.Column(sql.Integer, sql.ForeignKey('users.id'), primary_key=True)
    show_id = sql.Column(sql.Integer, sql.ForeignKey('shows.id'), primary_key=True)
    season_id = sql.Column(sql.Integer, sql.ForeignKey('seasons.id'), primary_key=True)

    season = sql.relationship('Season')

    watched = sql.column_property(
        sql.select(
            [sql.case(
                [
                    (sql.func.count(Watched.episode_id) == 0, True)
                ],
                else_=False
            )]
        ).where(
            sql.and_(
                Watched.episode.has(Episode.air_date < TODAY),
                Watched.show_id == show_id,
                Watched.user_id == user_id,
                Watched.season_id == season_id,
                Watched.watched.is_(False)
            )
        )
    )


class Subscription(sql.Model):
    __tablename__ = 'subscribe'
    user_id = sql.Column(sql.Integer, sql.ForeignKey('users.id'), primary_key=True)
    show_id = sql.Column(sql.Integer, sql.ForeignKey('shows.id'), primary_key=True)

    show = sql.relationship('Show')

    watched = sql.column_property(
        sql.select([
            sql.case(
                [
                    (sql.func.count(Watched.episode_id) == 0, True)
                ],
                else_=False
            )]
        ).where(
            sql.and_(
                Watched.episode.has(Episode.air_date < TODAY),
                Watched.show_id == show_id,
                Watched.user_id == user_id,
                Watched.watched.is_(False)
            )
        )
    )
