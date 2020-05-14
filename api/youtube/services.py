import requests
import isodate

from api import extensions
from api.config import config
from . import models


class YoutubeAPI(object):
    BASE_URL = 'https://www.googleapis.com/youtube'
    API_VERSION = 'v3'
    KEY = config.YOUTUBE_API_KEY

    @staticmethod
    def _serialize_params(params: dict):
        phrase = ''
        for key, value in params.items():
            phrase += f'&{key}={value}'

        return phrase

    def _endpoint_url(self, endpoint):
        return f'{self.BASE_URL}/{self.API_VERSION}/{endpoint}/?key={self.KEY}'

    def channel(self, channel_id):
        params = {
         'part': 'snippet',
         'id': channel_id
        }

        return requests.get(self._endpoint_url('channels') + self._serialize_params(params)).json()

    def search(self, channel_id, next=None):
        params = {
            'channelId': channel_id,
            'part': 'snippet',
            'order': 'date',
            'maxResults': '20',
        }

        if next is not None:
            params['pageToken'] = next

        return requests.get(self._endpoint_url('search') + self._serialize_params(params)).json()

    def videos(self, video_ids):
        params = {
            "part": "contentDetails",
            "id": ",".join(video_ids)
        }

        url = self._endpoint_url("videos") + self._serialize_params(params)

        return requests.get(url).json()


class ChannelService(object):
    def __init__(self, user_id, channel_id):
        self._user_id = user_id
        self._channel_id = channel_id

    def get_by_id(self):
        subscribed_channel = models.SubscribedChannel.query.get((self._user_id, self._channel_id))
        if subscribed_channel is None:
            channel = models.Channel.query.get(self._channel_id)
            if channel is None:
                data = YoutubeAPI().channel(self._channel_id)
                channel = models.Channel(
                    id=data['items'][0]['id'],
                    title=data['items'][0]['snippet']['title'],
                    description=data['items'][0]['snippet']['description'],
                    image=data['items'][0]['snippet']['thumbnails']['high']['url'],
                )

                videos = self._get_videos()

                channel.videos = videos

            subscribed_channel = models.SubscribedChannel(
                user_id=self._user_id,
            )

            subscribed_channel.channel = channel

            extensions.sql.session.add(subscribed_channel)

            self._subscribe_to_videos()

            extensions.sql.session.commit()

        return subscribed_channel

    def _get_videos(self):
        videos = []

        x = True
        page_token = None
        while x:
            data = YoutubeAPI().search(self._channel_id, next=page_token)

            for item in data['items']:

                try:
                    video = models.Video(
                        id=item['id']['videoId'],
                        channel_id=self._channel_id,
                        title=item['snippet']['title'],
                        description=item['snippet']['description'],
                        image=item['snippet']['thumbnails']['high']['url']
                    )

                    videos.append(video)
                except KeyError:
                    pass

            try:
                page_token = data['nextPageToken']
            except KeyError:
                x = False

        return videos

    def _subscribe_to_videos(self):
        videos = models.Channel.query.get(self._channel_id).videos

        for video in videos:
            subscribed_video = models.SubscribedVideo(
                user_id=self._user_id,
                channel_id=self._channel_id
            )

            subscribed_video.video = video

            extensions.sql.session.add(subscribed_video)


class VideoService(object):
    @staticmethod
    def get_video_content_details_duration(video_id):
        data = YoutubeAPI().videos(
            video_ids=[video_id]
        )

        return isodate.parse_duration(data['items'][0]['contentDetails']['duration']).seconds

    @staticmethod
    def update_all_video_content_details_without_duration():
        videos = models.Video.query.filter(
            extensions.sql.or_(
                models.Video.duration.is_(None)
            )
        ).all()

        id_list = [video.id for video in videos][0:50]

        data = YoutubeAPI().videos(
            video_ids=id_list
        )

        for item in data['items']:
            video = models.Video.query.get(item['id'])

            video.duration = isodate.parse_duration(item['contentDetails']['duration']).seconds

        extensions.sql.session.commit()

        return data