from flask import Blueprint
from flask_cors import CORS
from flask_restful import Api

from . import resources

shows_bp = Blueprint('shows', __name__, url_prefix="/shows")
api = Api(shows_bp)
cors = CORS(shows_bp, supports_credentials=True)

api.add_resource(resources.Queue, "/queue")
api.add_resource(resources.New, '/new')
api.add_resource(resources.Recent, "/recent")
api.add_resource(resources.Upcoming, '/upcoming')
api.add_resource(resources.Subscriptions, "/subscriptions")
api.add_resource(resources.Subscription, "/subscriptions/<show_id>")
api.add_resource(resources.Seasons, "/subscriptions/<show_id>/seasons")
api.add_resource(resources.Episodes, "/subscriptions/<show_id>/episodes")
api.add_resource(resources.Completions, "/completion")
api.add_resource(resources.Multiverse, "/universe")
api.add_resource(resources.Universe, "/universe/<universe_id>")
