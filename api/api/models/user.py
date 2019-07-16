from extensions import sql


class User(sql.Model):
    __tablename__ = 'users'

    id = sql.Column(sql.Integer, primary_key=True)
    username = sql.Column(sql.String, unique=True)
    password = sql.Column(sql.String)
