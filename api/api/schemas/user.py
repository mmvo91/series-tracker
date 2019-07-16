from api import models
from extensions import ma


class UserSchema(ma.ModelSchema):
    class Meta:
        model = models.User
        fields = [
            'id',
            'username'
        ]
