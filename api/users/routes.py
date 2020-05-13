from flask import Blueprint
from flask_cors import CORS
from flask_restful import Api

from . import resources

users_bp = Blueprint('users', __name__, url_prefix="/users")
api = Api(users_bp)
CORS(users_bp, supports_credentials=True)

api.add_resource(resources.Users, "", strict_slashes=False)
api.add_resource(resources.User, "/<user_id>")
