from api import models
from api.extensions import ma


class ShowSchema(ma.ModelSchema):
    class Meta:
        model = models.Show
        fields = [
            'id',
            'name',
            'premiered',
            'status',
            'summary',
            'image'
        ]


class SeasonSchema(ma.ModelSchema):
    class Meta:
        model = models.Season
        fields = [
            'id',
            'show_id',
            'number',
            'name',
            'episodeOrder',
            'premiereDate',
            'endDate',
            'image'
        ]


class EpisodesSchema(ma.ModelSchema):
    class Meta:
        model = models.Episode
        fields = [
            'id',
            'air_date',
            'name',
            'number',
            'season',
            'summary',
            'image',
            'show_id'
        ]
