from flask import Blueprint
from flask_cors import CORS
from flask_restful import Api

from api import resources

api_bp = Blueprint('api', __name__)
api = Api(api_bp)
cors = CORS(api_bp)

api.add_resource(resources.Token, "/token")
api.add_resource(resources.Users, "/users")
api.add_resource(resources.User, "/users/<user_id>")
api.add_resource(resources.Queue, "/users/<user_id>/queue")
api.add_resource(resources.New, '/users/<user_id>/new')
api.add_resource(resources.Upcoming, '/users/<user_id>/upcoming')
api.add_resource(resources.Subscriptions, "/users/<user_id>/subscriptions")
api.add_resource(resources.Subscription, "/users/<user_id>/subscriptions/<show_id>")
api.add_resource(resources.Seasons, "/users/<user_id>/subscriptions/<show_id>/seasons")
api.add_resource(resources.Episodes, "/users/<user_id>/subscriptions/<show_id>/episodes")
