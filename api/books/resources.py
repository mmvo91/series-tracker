from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource

from api.books import models, schemas, services
from api.extensions import sql


class Book(Resource):
    @jwt_required
    def get(self, book_id):
        book = models.UserBook.query.get((get_jwt_identity(), book_id))

        schema = schemas.UserBookSchema()

        return schema.dump(book)

    @jwt_required
    def post(self, book_id):
        data = request.json

        read = data['read']

        book = models.UserBook.query.get((get_jwt_identity(), book_id))

        book.read = read

        sql.session.commit()

        return {'msg': f'{book.book.title} is reading is now {book.read}'}


class Books(Resource):
    @jwt_required
    def get(self):
        book = models.UserBook.query.filter_by(
            user_id=get_jwt_identity()
        ).all()

        schema = schemas.UserBookSchema(many=True)

        return schema.dump(book)


    @jwt_required
    def post(self):
        data = request.json

        isbn = data['isbn']

        book = services.BookService(
            get_jwt_identity()
        ).add_by_isbn(isbn)

        user_book = models.UserBook(
            user_id=get_jwt_identity()
        )

        user_book.book = book

        sql.session.add(user_book)

        sql.session.commit()

        return {'msg': f'Added book {book.title}'}