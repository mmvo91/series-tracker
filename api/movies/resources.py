import datetime
import requests

from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource

from api.extensions import sql
from api.config import config

from . import models, schemas


class Movie(Resource):
    @jwt_required
    def get(self):
        add_movie = models.AddedMovie.query.join(
            models.Movie
        ).order_by(
            models.AddedMovie.watched,
            models.Movie.title
        ).filter(
            models.AddedMovie.user_id == get_jwt_identity()
        ).all()

        schema = schemas.UserMovieSchema(many=True)

        return schema.dump(add_movie)

    @jwt_required
    def post(self):
        data = request.json

        user_movie = sql.session.query(models.AddedMovie).get((get_jwt_identity(), data['imdbID']))
        if user_movie is None:
            movie = sql.session.query(models.Movie).get(data['imdbID'])
            if movie is None:
                url = f"http://www.omdbapi.com/?apikey={config.OMDB_API_KEY}&i={data['imdbID']}&type=movie"
                data = requests.get(url).json()

                movie = models.Movie(
                    id=data['imdbID'],
                    title=data['Title'],
                    release=datetime.datetime.strptime(data['Released'], '%d %b %Y'),
                    rating=data['Rated'],
                    runtime=data['Runtime'].split()[0],
                    summary=data['Plot'],
                    image=data['Poster']
                )

            user_movie = models.AddedMovie()

            user_movie.user_id = get_jwt_identity()
            user_movie.movie = movie

            sql.session.add(user_movie)

            sql.session.commit()

            return {
                'msg': f"Successfully subscribed to {movie.title}"
            }
        else:
            return {
                'msg': f"{user_movie.movie.title} already added."
            }

    @jwt_required
    def put(self):
        data = request.json

        user_movie = sql.session.query(models.AddedMovie).get((get_jwt_identity(), data['movie_id']))
        if user_movie is not None:
            user_movie.watched = data['watched']
            sql.session.commit()
            return {'msg': f"Movie {user_movie.movie.title} now {user_movie.watched}"}
        else:
            return {'msg': 'Unable to find movie for user'}


class MovieGroups(Resource):
    def put(self):
        data = request.json

        movie_group = models.MovieGroup.query.get(data['movie_group_id'])
        if movie_group is not None:
            movie = models.Movie.query.get(data['movie_id'])
            if movie is not None:
                if movie not in movie_group.movies:
                    movie_group.movies.append(movie)
                    sql.session.commit()
                    return {'msg': f'Added movie {movie.title} to {movie_group.name}'}
                else:
                    return {'msg': f'Movie {movie.title} already in {movie_group.name}'}
            else:
                return {'msg': 'Could not find movie'}
        else:
            return {'msg': 'Could not find movie group'}

    def get(self):
        movie_groups = models.MovieGroup.query.all()

        return schemas.MovieGroupSchema(many=True).dump(movie_groups)

    @jwt_required
    def post(self):
        data = request.json

        print(data)

        if data['name'] is not None and data['name'] != "":
            movie_group = models.MovieGroup.query.filter_by(name=data['name']).first()
            if movie_group is None:
                movie_group = models.MovieGroup(
                    name=data['name'],
                    description=data['description'],
                    type=data['type']
                )

                sql.session.add(movie_group)
                sql.session.commit()

                return {'msg': f"Created movie group {movie_group.name}"}
            else:
                return {'msg': f"Movie group {movie_group.name} exists"}
        else:
            return {'msg': f"Unable to create movie group"}
