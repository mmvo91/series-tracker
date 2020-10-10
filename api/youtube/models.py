from api.extensions import sql


class Channel(sql.Model):
    __tablename__ = 'channels'

    id = sql.Column(sql.String, primary_key=True)
    title = sql.Column(sql.String)
    description = sql.Column(sql.String)
    image = sql.Column(sql.String)

    videos = sql.relationship('Video')

    ModifiedDate = sql.Column(sql.DateTime, default=sql.func.now(), onupdate=sql.func.now())
    ModifiedBy = sql.Column(sql.String, default="sqlAlchemy")
    CreatedDate = sql.Column(sql.DateTime, default=sql.func.now())
    CreatedBy = sql.Column(sql.String, default="sqlAlchemy")


class Video(sql.Model):
    __tablename__ = 'videos'

    id = sql.Column(sql.String, primary_key=True)
    channel_id = sql.Column(sql.String, sql.ForeignKey('channels.id'))
    title = sql.Column(sql.String)
    description = sql.Column(sql.String)
    image = sql.Column(sql.String)
    publish_date = sql.Column(sql.DateTime)
    duration = sql.Column(sql.Integer)

    ModifiedDate = sql.Column(sql.DateTime, default=sql.func.now(), onupdate=sql.func.now())
    ModifiedBy = sql.Column(sql.String, default="sqlAlchemy")
    CreatedDate = sql.Column(sql.DateTime, default=sql.func.now())
    CreatedBy = sql.Column(sql.String, default="sqlAlchemy")


class SubscribedVideo(sql.Model):
    __tablename__ = 'subscribed_videos'

    user_id = sql.Column(sql.Integer, sql.ForeignKey('users.id'), primary_key=True)
    channel_id = sql.Column(sql.String, sql.ForeignKey('channels.id'), primary_key=True)
    video_id = sql.Column(sql.String, sql.ForeignKey('videos.id'), primary_key=True)
    watched = sql.Column(sql.Boolean, default=False)

    video = sql.relationship('Video')

    ModifiedDate = sql.Column(sql.DateTime, default=sql.func.now(), onupdate=sql.func.now())
    ModifiedBy = sql.Column(sql.String, default="sqlAlchemy")
    CreatedDate = sql.Column(sql.DateTime, default=sql.func.now())
    CreatedBy = sql.Column(sql.String, default="sqlAlchemy")


class SubscribedChannel(sql.Model):
    __tablename__ = "subscribed_channels"

    user_id = sql.Column(sql.Integer, sql.ForeignKey('users.id'), primary_key=True)
    channel_id = sql.Column(sql.String, sql.ForeignKey('channels.id'), primary_key=True)

    channel = sql.relationship('Channel')
    videos = sql.relationship(
        'SubscribedVideo',
        primaryjoin="and_(SubscribedChannel.user_id==SubscribedVideo.user_id, SubscribedChannel.channel_id==SubscribedVideo.channel_id)",
        foreign_keys="[SubscribedVideo.user_id, SubscribedVideo.channel_id]"
    )

    watched = sql.column_property(
        sql.select(
            [sql.func.count(SubscribedVideo.channel_id)]
        ).where(
            sql.and_(
                user_id == SubscribedVideo.user_id,
                channel_id == SubscribedVideo.channel_id,
                SubscribedVideo.watched.is_(True)
            )
        )
    )

    unwatched = sql.column_property(
        sql.select(
            [sql.func.count(SubscribedVideo.channel_id)]
        ).where(
            sql.and_(
                user_id == SubscribedVideo.user_id,
                channel_id == SubscribedVideo.channel_id,
                SubscribedVideo.watched.is_(False)
            )
        )
    )

    ModifiedDate = sql.Column(sql.DateTime, default=sql.func.now(), onupdate=sql.func.now())
    ModifiedBy = sql.Column(sql.String, default="sqlAlchemy")
    CreatedDate = sql.Column(sql.DateTime, default=sql.func.now())
    CreatedBy = sql.Column(sql.String, default="sqlAlchemy")
