import requests

from api.books import models
from api.config import config
from api.extensions import sql


class BookAPI(object):
    BASE_URL = 'https://www.googleapis.com/books'
    API_VERSION = 'v1'
    KEY = config.YOUTUBE_API_KEY

    @staticmethod
    def _serialize_params(params: dict):
        phrase = ''
        for key, value in params.items():
            phrase += f'&{key}={value}'

        return phrase

    def _endpoint_url(self, endpoint):
        return f'{self.BASE_URL}/{self.API_VERSION}/{endpoint}/?key={self.KEY}'

    def volumes(self, volume_id=None, params=None):
        ep = f'volumes' if volume_id is None else f'volumes/{volume_id}'

        return requests.get(self._endpoint_url(ep) + self._serialize_params(params or {})).json()


class BookService(object):
    def __init__(self, user_id):
        self._user_id=user_id

    @staticmethod
    def _handle_publish_date(published_date):
        if len(published_date) == 4:
            return f"{published_date}-01-01"
        elif len(published_date) == 7:
            return f"{published_date}-01"
        else:
            return published_date

    def add_by_isbn(self, isbn):
        volume = BookAPI().volumes(params={'q': f"isbn:{isbn}"})['items'][0]

        book = models.Book(
            id=volume['id'],
            title=volume['volumeInfo']['title'],
            subtitle=volume['volumeInfo']['subtitle'],
            description=volume['volumeInfo']['description'],
            publish_date=self._handle_publish_date(volume['volumeInfo']['publishedDate']),
            image=volume['volumeInfo']['imageLinks']['thumbnail'],
            author=", ".join(volume['volumeInfo']['authors']),
            publisher=volume['volumeInfo']['publisher']
        )

        sql.session.add(book)

        sql.session.commit()

        return book
