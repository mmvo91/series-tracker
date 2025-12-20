from pydantic import BaseModel, ConfigDict


def to_camel(string: str) -> str:
    """Convert snake_case to camelCase."""
    parts = iter(string.split("_"))
    return next(parts) + "".join(i.title() for i in parts)


class CamelCaseModel(BaseModel):
    """Base Pydantic model with camelCase field aliases."""
    model_config = ConfigDict(
        populate_by_name=True,
        alias_generator=to_camel,
        from_attributes=True
    )
