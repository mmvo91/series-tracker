import datetime

import requests

from api.config import config
from api.extensions import sql
from . import models


class MovieService(object):
    def __init__(self):
        self.url = f"http://www.omdbapi.com/?apikey={config.OMDB_API_KEY}"

    def get_movie(self, imdbID):
        return f"{self.url}&i={imdbID}&type=movie"

    def create_movie(self, imdbID):
        data = requests.get(self.get_movie(imdbID)).json()

        movie = models.Movie(
            id=data['imdbID'],
            title=data['Title'],
            release=datetime.datetime.strptime(data['Released'], '%d %b %Y'),
            rating=data['Rated'],
            runtime=data['Runtime'].split()[0],
            summary=data['Plot'],
            image=data['Poster']
        )

        return movie

    @staticmethod
    def add_movie_to_user(movie: models.Movie, user_id):
        user_movie = models.AddedMovie()

        user_movie.user_id = user_id
        user_movie.movie = movie

        sql.session.add(user_movie)

        sql.session.commit()

    @staticmethod
    def sync_user_movie_group(user_id):
        user_movie_groups = models.AddedMovieGroup.query.filter_by(user_id=user_id)

        for user_movie_group in user_movie_groups:
            movie_group = models.MovieGroup.query.get(user_movie_group.movie_group_id)

            for movie in movie_group.movies:
                user_movie = models.AddedMovie.query.get((user_id, movie.id))

                if user_movie is None:
                    user_movie = models.AddedMovie(
                        user_id=user_id,
                        movie_id=movie.id
                    )

                    sql.session.add(user_movie)
                    sql.session.commit()
