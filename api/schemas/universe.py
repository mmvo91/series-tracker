from api import models
from api.extensions import ma


class UniverseSchema(ma.ModelSchema):
    class Meta:
        model = models.Universe
        fields = [
            'id',
            'name',
            'summary'
        ]
