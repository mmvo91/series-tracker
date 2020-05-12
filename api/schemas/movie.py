from api import models
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
