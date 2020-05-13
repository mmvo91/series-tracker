from . import models, schemas
from api.extensions import ma


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = models.User
        fields = [
            'id',
            'username'
        ]
