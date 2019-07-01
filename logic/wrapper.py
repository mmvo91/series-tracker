import requests


class Wrapper(object):
    BASE_URL = 'http://api.tvmaze.com'
    BASE_SINGLE = f'{BASE_URL}/singlesearch'
    BASE_SHOW = f'{BASE_URL}/shows'

    def __init__(self, show=None):
        self._show = show
        self._id = self.query_show(show)['id']

    @staticmethod
    def _get(url):
        return requests.get(url).json()

    def _or_nah(self, show):
        return self._show or show

    @staticmethod
    def _query_parameter(param, value, truth=True):
        if truth:
            return f'?{param}={value}'
        else:
            return ''

    def query_show(self, show=None):
        url = f'{self.BASE_SINGLE}/shows{self._query_parameter("q", self._or_nah(show))}'
        return self._get(url)

    def seasons(self):
        url = f'{self.BASE_SHOW}/{self._id}/seasons'
        return self._get(url)

    def episodes(self):
        url = f'{self.BASE_SHOW}/{self._id}/episodes'
        return self._get(url)
