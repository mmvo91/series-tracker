from flask import Blueprint
from flask_cors import CORS
from flask_restful import Api

from . import resources

movies_bp = Blueprint('movies', __name__, url_prefix="/movies")
movies = Api(movies_bp)
CORS(movies_bp, supports_credentials=True)

movies.add_resource(resources.Movie, "", strict_slashes=False)
movies.add_resource(resources.MovieGroups, "/groups")
