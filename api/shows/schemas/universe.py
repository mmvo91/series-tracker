from .. import models
from api.extensions import ma


class UniverseSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = models.Universe
        fields = [
            'id',
            'name',
            'summary'
        ]
