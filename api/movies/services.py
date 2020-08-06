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
