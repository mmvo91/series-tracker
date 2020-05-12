from flask import Blueprint
from flask_cors import CORS
from flask_restful import Api

from . import resources

youtube_bp = Blueprint('youtube', __name__, url_prefix="/channels")
youtube = Api(youtube_bp)
CORS(youtube_bp, supports_credentials=True)

youtube.add_resource(resources.Channels, "", strict_slashes=False)
youtube.add_resource(resources.Channel, "/<channel_id>")
youtube.add_resource(resources.Videos, "/<channel_id>/videos")
