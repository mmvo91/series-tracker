from flask import Flask

import extensions
from api import routes
from config import config


def create_app():
    app = Flask(__name__)
    app.config.from_object(config)
    extensions.sql.init_app(app)
    extensions.ma.init_app(app)
    extensions.bcrypt.init_app(app)
    extensions.jwt.init_app(app)
    extensions.migrate.init_app(app)

    app.register_blueprint(routes.api_bp)

    return app


if __name__ == '__main__':
    app = create_app()
    app.run()
