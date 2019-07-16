import os


class Config(object):
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False

    JWT_TOKEN_LOCATION = ['cookies']
    JWT_COOKIE_SECURE = False
    JWT_SESSION_COOKIE = False
    JWT_ACCESS_COOKIE_PATH = '/'
    JWT_REFRESH_COOKIE_PATH = '/'
    JWT_COOKIE_CSRF_PROTECT = True
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')


class DevelopmentConfig(Config):
    SQLALCHEMY_USERNAME = os.getenv('SQLALCHEMY_USERNAME')
    SQLALCHEMY_PASSWORD = os.getenv('SQLALCHEMY_PASSWORD')
    SQLALCHEMY_DB = 'series'
    SQLALCHEMY_DATABASE_URI = f'postgresql://{SQLALCHEMY_USERNAME}:{SQLALCHEMY_PASSWORD}@localhost:5432/{SQLALCHEMY_DB}'


class HerokuConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')

    JWT_COOKIE_SECURE = True


configs = {
    'development': DevelopmentConfig,
    'heroku': HerokuConfig
}

config = configs[os.getenv('FLASK_ENV', 'heroku')]
