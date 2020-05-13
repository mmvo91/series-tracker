from flask import Blueprint
from flask_cors import CORS
from flask_restful import Api

from . import resources

token_bp = Blueprint('token', __name__, url_prefix="/token")
api = Api(token_bp)
CORS(token_bp, supports_credentials=True)

api.add_resource(resources.Token, "", strict_slashes=False)
