from flask import request, jsonify
from flask_jwt_extended import (
    jwt_refresh_token_required, create_access_token, create_refresh_token, set_access_cookies, set_refresh_cookies,
    get_jwt_identity, unset_jwt_cookies
)
from flask_restful import Resource

from api import extensions
from api.users import models


class Token(Resource):
    @jwt_refresh_token_required
    def get(self):
        current_user = get_jwt_identity()
        access_token = create_access_token(identity=current_user)

        response = {'id': current_user, 'msg': 'Valid token'}
        response = jsonify(response)
        set_access_cookies(response, access_token)

        return response

    def post(self):
        data = request.json
        username = data['username']
        password = data['password']

        current = models.User.query.filter_by(username=username).first()
        if current is None:
            return {'msg': 'Error logging in'}
        else:
            if extensions.bcrypt.check_password_hash(current.password, password):

                access_token = create_access_token(identity=current.id)
                refresh_token = create_refresh_token(identity=current.id)

                response = jsonify({'id': current.id, 'msg': 'Logged in successfully'})

                set_access_cookies(response, access_token)
                set_refresh_cookies(response, refresh_token)

                return response
            else:
                return {'msg': 'Error logging in'}

    def delete(self):
        response = jsonify({'logout': True})
        unset_jwt_cookies(response)
        return response
