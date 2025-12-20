from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict

from api.utils.pydantic_utils import CamelCaseModel


class BookSchema(CamelCaseModel):
    id: str
    title: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    publish_date: Optional[date] = None
    image: Optional[str] = None
    author: Optional[str] = None
    publisher: Optional[str] = None


class UserBookSchema(BaseModel):
    user_id: int
    book_id: str
    read: bool = False
    book: Optional[BookSchema] = None

    model_config = ConfigDict(from_attributes=True)
