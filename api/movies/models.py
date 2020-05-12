from api.extensions import sql

movie_group_movies = sql.Table(
    'movie_groups_movies',
    sql.Column('movie_group_id', sql.Integer, sql.ForeignKey('movie_groups.id')),
    sql.Column('movie_id', sql.String, sql.ForeignKey('movies.id')),
    sql.Column('sequence', sql.Integer)
)


class Movie(sql.Model):
    __tablename__ = 'movies'

    id = sql.Column(sql.String, primary_key=True)
    title = sql.Column(sql.String)
    release = sql.Column(sql.Date)
    rating = sql.Column(sql.String)
    runtime = sql.Column(sql.Integer)
    summary = sql.Column(sql.String)
    image = sql.Column(sql.String)

    ModifiedDate = sql.Column(sql.DateTime, default=sql.func.now(), onupdate=sql.func.now())
    ModifiedBy = sql.Column(sql.String, default="sqlAlchemy")
    CreatedDate = sql.Column(sql.DateTime, default=sql.func.now())
    CreatedBy = sql.Column(sql.String, default="sqlAlchemy")


class AddedMovie(sql.Model):
    __tablename__ = "added_movie"

    user_id = sql.Column(sql.Integer, sql.ForeignKey('users.id'), primary_key=True)
    movie_id = sql.Column(sql.String, sql.ForeignKey('movies.id'), primary_key=True)
    watched = sql.Column(sql.Boolean, default=False)

    movie = sql.relationship('Movie')

    ModifiedDate = sql.Column(sql.DateTime, default=sql.func.now(), onupdate=sql.func.now())
    ModifiedBy = sql.Column(sql.String, default="sqlAlchemy")
    CreatedDate = sql.Column(sql.DateTime, default=sql.func.now())
    CreatedBy = sql.Column(sql.String, default="sqlAlchemy")


class MovieGroup(sql.Model):
    __tablename__ = "movie_groups"

    id = sql.Column(sql.Integer, primary_key=True)
    name = sql.Column(sql.String)
    description = sql.Column(sql.String)
    type = sql.Column(sql.String)

    movies = sql.relationship(
        'Movie',
        secondary=movie_group_movies,
        order_by=[movie_group_movies.c.sequence, Movie.release]
    )

    ModifiedDate = sql.Column(sql.DateTime, default=sql.func.now(), onupdate=sql.func.now())
    ModifiedBy = sql.Column(sql.String, default="sqlAlchemy")
    CreatedDate = sql.Column(sql.DateTime, default=sql.func.now())
    CreatedBy = sql.Column(sql.String, default="sqlAlchemy")
