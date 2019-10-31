import requests


class Wrapper(object):
    BASE_URL = 'http://api.tvmaze.com'
    BASE_SINGLE = f'{BASE_URL}/singlesearch'
    BASE_SHOW = f'{BASE_URL}/shows'

    def __init__(self, show=None):
        self._show = show
        self._id = self.query_show(show)['id'] if show is not None else None

    @staticmethod
    def _get(url):
        return requests.get(url).json()

    def _or_show(self, show):
        return self._show or show

    def _or_id(self, show_id):
        return self._id or show_id

    @staticmethod
    def _query_parameter(param, value, truth=True):
        if truth:
            return f'?{param}={value}'
        else:
            return ''

    def query_show(self, show=None):
        url = f'{self.BASE_SINGLE}/shows{self._query_parameter("q", self._or_show(show))}'
        return self._get(url)

    def show(self, show_id=None):
        self._id = show_id if show_id is not None else self._id
        url = f'{self.BASE_SHOW}/{self._or_id(show_id)}'
        return self._get(url)

    def seasons(self, show_id=None):
        url = f'{self.BASE_SHOW}/{self._or_id(show_id)}/seasons'
        return self._get(url)

    def episodes(self, show_id=None):
        url = f'{self.BASE_SHOW}/{self._or_id(show_id)}/episodes'
        return self._get(url)
