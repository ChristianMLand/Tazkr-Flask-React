from dataclasses import dataclass
from datetime import datetime
from flask_app.models.base_model import Model
from flask_app.models.column_model import Column

@dataclass
class Board(Model):
    id: int
    password: str
    created_at: datetime
    updated_at: datetime
    table: str = "boards"

    @property
    def columns(self):
        return Column.get_all(board_id = self.id)

    @property
    def json(self):
        return {
            "id" : self.id,
            "password" : self.password,
            "created_at" : str(self.created_at),
            "updated_at" : str(self.updated_at),
            "columns" : [column.json for column in self.columns]
        }