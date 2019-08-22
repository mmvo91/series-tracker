from api.extensions import sql

universe_shows = sql.Table(
    'universe_shows',
    sql.Column('universe_id', sql.Integer, sql.ForeignKey('universe.id')),
    sql.Column('show_id', sql.Integer, sql.ForeignKey('shows.id'))
)


class Universe(sql.Model):
    __tablename__ = 'universe'

    id = sql.Column(sql.Integer, primary_key=True)
    name = sql.Column(sql.String)
    summary = sql.Column(sql.String)

    ModifiedDate = sql.Column(sql.DateTime, default=sql.func.now(), onupdate=sql.func.now())
    ModifiedBy = sql.Column(sql.String, default="sqlAlchemy")
    CreatedDate = sql.Column(sql.DateTime, default=sql.func.now())
    CreatedBy = sql.Column(sql.String, default="sqlAlchemy")

    shows = sql.relationship("Show", secondary=universe_shows)
