from dataclasses import dataclass
from datetime import datetime
from flask_app.models.base_model import Model
from flask_app.models.task_model import Task

@dataclass
class Column(Model):
    id: int
    title: str
    created_at: datetime
    updated_at: datetime
    board_id: int
    table: str = "columns"

    @property
    def tasks(self):
        ts = Task.get_all(column_id = self.id)
        ts.sort(key=lambda t: t.index)
        return ts

    @property
    def json(self):
        print(self.tasks)
        return {
            "id" : self.id,
            "index" : self.id,
            "title" : self.title,
            "created_at" : str(self.created_at),
            "updated_at" : str(self.updated_at),
            "board_id" : self.board_id,
            "tasks" : [task.json for task in self.tasks]
        }