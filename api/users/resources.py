from flask import request
from flask_jwt_extended import (
    jwt_required
)
from flask_restful import Resource

from api import extensions
from . import models, schemas


class Users(Resource):
    def post(self):
        data = request.json
        username = data['username']
        password = data['password']

        current = models.User.query.filter_by(username=username).first()
        if current is not None:
            return {'msg': f'Username {current.username} is already taken. Please try another name'}
        else:
            hashed = extensions.bcrypt.generate_password_hash(password)
            new = models.User(username=username, password=hashed.decode('utf-8'))
            extensions.sql.session.add(new)
            extensions.sql.session.commit()
            return {'msg': 'User Created'}

    @jwt_required
    def put(self):
        data = request.json
        username = data['username']
        password = data['password']
        new_password = data['new_password']

        user = models.User.query.filter_by(username=username).first()

        if extensions.bcrypt.check_password_hash(user.password, password):
            hashed = extensions.bcrypt.generate_password_hash(new_password)

            user.password = hashed

            extensions.sql.session.add(user)
            extensions.sql.session.commit()

            return {'msg': 'Password updated'}
        else:
            return {'msg': 'Current password is incorrect'}


class User(Resource):
    @jwt_required
    def get(self, user_id):
        user = models.User.query.get(user_id)
        schema = schemas.UserSchema()
        return schema.dump(user)
