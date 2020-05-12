from flask import Flask

from api.movies.routes import movies_bp
from api.youtube.routes import youtube_bp
from api import extensions, routes
from api.config import config


def create_app():
    app = Flask(__name__)
    app.config.from_object(config)
    extensions.sql.init_app(app)
    extensions.ma.init_app(app)
    extensions.bcrypt.init_app(app)
    extensions.jwt.init_app(app)
    extensions.migrate.init_app(app)
    extensions.pagination.init_app(app, extensions.sql)

    app.register_blueprint(routes.api_bp)
    app.register_blueprint(movies_bp)
    app.register_blueprint(youtube_bp)

    return app


if __name__ == '__main__':
    app = create_app()
    app.run()
