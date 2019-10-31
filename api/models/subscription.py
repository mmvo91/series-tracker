import datetime

from api.extensions import sql
from api.models import Episode


def today():
    return datetime.datetime.today()


class Watched(sql.Model):
    __tablename__ = 'watched'

    user_id = sql.Column(sql.Integer, sql.ForeignKey('users.id'), primary_key=True)
    show_id = sql.Column(sql.Integer, sql.ForeignKey('shows.id'), primary_key=True)
    season_id = sql.Column(sql.Integer, sql.ForeignKey('seasons.id'))
    episode_id = sql.Column(sql.Integer, sql.ForeignKey('episodes.id'), primary_key=True)
    watched = sql.Column(sql.Boolean, default=False)
    ModifiedDate = sql.Column(sql.DateTime, default=sql.func.now(), onupdate=sql.func.now())
    ModifiedBy = sql.Column(sql.String, default="sqlAlchemy")
    CreatedDate = sql.Column(sql.DateTime, default=sql.func.now())
    CreatedBy = sql.Column(sql.String, default="sqlAlchemy")

    show = sql.relationship('Show')
    episode = sql.relationship('Episode')


class SeasonWatched(sql.Model):
    user_id = sql.Column(sql.Integer, sql.ForeignKey('users.id'), primary_key=True)
    show_id = sql.Column(sql.Integer, sql.ForeignKey('shows.id'), primary_key=True)
    season_id = sql.Column(sql.Integer, sql.ForeignKey('seasons.id'), primary_key=True)
    ModifiedDate = sql.Column(sql.DateTime, default=sql.func.now(), onupdate=sql.func.now())
    ModifiedBy = sql.Column(sql.String, default="sqlAlchemy")
    CreatedDate = sql.Column(sql.DateTime, default=sql.func.now())
    CreatedBy = sql.Column(sql.String, default="sqlAlchemy")

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
                Watched.episode.has(Episode.air_date < today()),
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
    ModifiedDate = sql.Column(sql.DateTime, default=sql.func.now(), onupdate=sql.func.now())
    ModifiedBy = sql.Column(sql.String, default="sqlAlchemy")
    CreatedDate = sql.Column(sql.DateTime, default=sql.func.now())
    CreatedBy = sql.Column(sql.String, default="sqlAlchemy")

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
                Watched.episode.has(Episode.air_date < today()),
                Watched.show_id == show_id,
                Watched.user_id == user_id,
                Watched.watched.is_(False)
            )
        )
    )
