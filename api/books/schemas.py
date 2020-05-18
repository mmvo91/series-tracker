from api.books import models
from api.extensions import ma
from api.utils.schema import CamelCaseSchema


class BookSchema(CamelCaseSchema):
    class Meta:
        model = models.Book
        fields = [
            'id',
            'title',
            'subtitle',
            'description',
            'publish_date',
            'image',
            'author',
            'publisher'
        ]


class UserBookSchema(CamelCaseSchema):
    class Meta:
        model = models.UserBook
        exclude = [
            'ModifiedDate',
            'ModifiedBy',
            'CreatedDate',
            'CreatedBy'
        ]

    book = ma.Nested(BookSchema)
