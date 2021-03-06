import datetime
import requests

from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource

from api.extensions import sql, pagination
from api.config import config

from . import models, schemas, services


class Movie(Resource):
    @jwt_required
    def get(self):
        s = request.args.get('s')

        add_movie = models.AddedMovie.query.join(
            models.Movie
        ).order_by(
            models.AddedMovie.watched,
            models.Movie.title
        ).filter(
            models.AddedMovie.user_id == get_jwt_identity()
        )

        if s is not None:
            add_movie = add_movie.filter(models.Movie.title.ilike(f'%{s}%'))

        schema = schemas.UserMovieSchema(many=True)

        return pagination.paginate(add_movie, schema, True)

    @jwt_required
    def post(self):
        data = request.json

        user_movie = sql.session.query(models.AddedMovie).get((get_jwt_identity(), data['imdbID']))
        if user_movie is None:
            movie = sql.session.query(models.Movie).get(data['imdbID'])
            service = services.MovieService()
            if movie is None:
                movie = service.create_movie(data['imdbID'])

            service.add_movie_to_user(movie, user_id=get_jwt_identity())

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
            if movie is None:
                service = services.MovieService()
                movie = service.create_movie(data['movie_id'])

            if movie not in movie_group.movies:
                movie_group.movies.append(movie)
                sql.session.commit()
                return {'msg': f'Added movie {movie.title} to {movie_group.name}'}
            else:
                return {'msg': f'Movie {movie.title} already in {movie_group.name}'}

        else:
            return {'msg': 'Could not find movie group'}

    def get(self):
        movie_groups = models.MovieGroup.query.all()

        return schemas.MovieGroupSchema(many=True).dump(movie_groups)

    @jwt_required
    def post(self):
        data = request.json

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


class UserMovieGroup(Resource):
    def get(self):
        user_movie_groups = models.AddedMovieGroup.query

        user_movie_groups = user_movie_groups.all()

        return schemas.UserMovieGroupSchema(many=True).dump(user_movie_groups)

    @jwt_required
    def post(self):
        data = request.json

        if models.AddedMovieGroup.query.get((get_jwt_identity(), data['movie_group_id'])) is None:
            user_movie_groups = models.AddedMovieGroup(
                user_id=get_jwt_identity(),
                movie_group_id=data['movie_group_id']
            )

            sql.session.add(user_movie_groups)
            sql.session.commit()

            return {'msg': "Successfully added movie group for user."}

        else:
            return {'msg': f"User/movie group combination already exists."}
