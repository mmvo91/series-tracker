from api.extensions import sql


class Show(sql.Model):
    __tablename__ = 'shows'

    id = sql.Column(sql.Integer, primary_key=True)
    name = sql.Column(sql.String)
    premiered = sql.Column(sql.Date)
    status = sql.Column(sql.Boolean)
    summary = sql.Column(sql.String)
    image = sql.Column(sql.String)
    ModifiedDate = sql.Column(sql.DateTime, default=sql.func.now(), onupdate=sql.func.now())
    ModifiedBy = sql.Column(sql.String, default="sqlAlchemy")
    CreatedDate = sql.Column(sql.DateTime, default=sql.func.now())
    CreatedBy = sql.Column(sql.String, default="sqlAlchemy")

    episodes = sql.relationship("Episode")


class Season(sql.Model):
    __tablename__ = 'seasons'

    id = sql.Column(sql.Integer, primary_key=True)
    show_id = sql.Column(sql.Integer, sql.ForeignKey('shows.id'))
    number = sql.Column(sql.Integer)
    name = sql.Column(sql.String)
    episodeOrder = sql.Column(sql.Integer)
    premiereDate = sql.Column(sql.Date)
    endDate = sql.Column(sql.Date)
    image = sql.Column(sql.String)
    ModifiedDate = sql.Column(sql.DateTime, default=sql.func.now(), onupdate=sql.func.now())
    ModifiedBy = sql.Column(sql.String, default="sqlAlchemy")
    CreatedDate = sql.Column(sql.DateTime, default=sql.func.now())
    CreatedBy = sql.Column(sql.String, default="sqlAlchemy")


class Episode(sql.Model):
    __tablename__ = 'episodes'

    id = sql.Column(sql.Integer, primary_key=True)
    air_date = sql.Column(sql.DateTime)
    name = sql.Column(sql.String)
    number = sql.Column(sql.Integer)
    season = sql.Column(sql.Integer)
    summary = sql.Column(sql.String)
    run_time = sql.Column(sql.Integer)
    image = sql.Column(sql.String)
    show_id = sql.Column(sql.Integer, sql.ForeignKey('shows.id'))
    ModifiedDate = sql.Column(sql.DateTime, default=sql.func.now(), onupdate=sql.func.now())
    ModifiedBy = sql.Column(sql.String, default="sqlAlchemy")
    CreatedDate = sql.Column(sql.DateTime, default=sql.func.now())
    CreatedBy = sql.Column(sql.String, default="sqlAlchemy")
