from . import models
from api.extensions import ma


class MovieSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = models.Movie
        fields = [
            'id',
            'title',
            'release',
            'rating',
            'rating',
            'summary',
            'image'
        ]


class UserMovieSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = models.AddedMovie
        exclude = [
            'ModifiedDate',
            'ModifiedBy',
            'CreatedDate',
            'CreatedBy'
        ]

    movie = ma.Nested(MovieSchema)


class MovieGroupSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = models.MovieGroup
        exclude = [
            'ModifiedDate',
            'ModifiedBy',
            'CreatedDate',
            'CreatedBy'
        ]

    movies = ma.Nested(MovieSchema, many=True)


class UserMovieGroupSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = models.AddedMovieGroup

    movie_group = ma.Nested(MovieGroupSchema, exclude=('movies',))
    movies = ma.Nested(UserMovieSchema, many=True)
