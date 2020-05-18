from api.extensions import sql


class Book(sql.Model):
    __tablename__ = "books"

    id = sql.Column(sql.String, primary_key=True)
    title = sql.Column(sql.String)
    subtitle = sql.Column(sql.String)
    description = sql.Column(sql.String)
    publish_date = sql.Column(sql.Date)
    image = sql.Column(sql.String)

    author = sql.Column(sql.String)
    publisher = sql.Column(sql.String)

    ModifiedDate = sql.Column(sql.DateTime, default=sql.func.now(), onupdate=sql.func.now())
    ModifiedBy = sql.Column(sql.String, default="sqlAlchemy")
    CreatedDate = sql.Column(sql.DateTime, default=sql.func.now())
    CreatedBy = sql.Column(sql.String, default="sqlAlchemy")


class UserBook(sql.Model):
    __tablename__ = "user_books"

    user_id = sql.Column(sql.Integer, sql.ForeignKey('users.id'), primary_key=True)
    book_id = sql.Column(sql.String, sql.ForeignKey('books.id'), primary_key=True)
    read = sql.Column(sql.Boolean, default=False)

    ModifiedDate = sql.Column(sql.DateTime, default=sql.func.now(), onupdate=sql.func.now())
    ModifiedBy = sql.Column(sql.String, default="sqlAlchemy")
    CreatedDate = sql.Column(sql.DateTime, default=sql.func.now())
    CreatedBy = sql.Column(sql.String, default="sqlAlchemy")

    book = sql.relationship('Book')
