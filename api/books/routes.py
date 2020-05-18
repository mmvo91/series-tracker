from flask import Blueprint
from flask_cors import CORS
from flask_restful import Api

from api.books import resources

book_bp = Blueprint('books', __name__, url_prefix="/books")
book = Api(book_bp)
CORS(book_bp, supports_credentials=True)

book.add_resource(resources.Books, "", strict_slashes=False)
book.add_resource(resources.Book, "/<book_id>")