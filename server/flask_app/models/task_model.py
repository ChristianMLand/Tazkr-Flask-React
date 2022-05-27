from dataclasses import dataclass
from datetime import datetime
from flask_app.models.base_model import Model

@dataclass
class Task(Model):
    id: int
    index: int
    description: str
    created_at: datetime
    updated_at: datetime
    column_id: int
    table: str = "tasks"

    @property
    def json(self):
        return {
            "id" : self.id,
            "index" : self.index,
            "description" : self.description,
            "created_at" : str(self.created_at),
            "updated_at" : str(self.updated_at),
            "column_id" : self.column_id,
        }