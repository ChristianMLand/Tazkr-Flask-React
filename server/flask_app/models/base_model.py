from flask_app.config.mysqlconnection import connectToMySQL
from flask_app import DB

class Model:
    def __init__(self):
        self.update = lambda **data : self.__class__.update(**data,id=self.id)
        self.delete = lambda : self.__class__.delete(id=self.id)

    @classmethod
    def create(cls,**data:dict):
        query = f'''
                INSERT INTO `{cls.table}`
                ({", ".join(f"`{col}`" for col in data)}) 
                VALUES 
                ({", ".join(f"%({col})s" for col in data)});
                '''
        return connectToMySQL(DB).query_db(query,data)

    @classmethod
    def get_one(cls,**data:dict):
        query = f'SELECT * FROM `{cls.table}`'
        if data:
            query += f' WHERE {" AND ".join(f"`{col}`=%({col})s" for col in data)}'
        query += ' LIMIT 1;'
        results = connectToMySQL(DB).query_db(query,data)
        if results:
            return cls(**results[0])

    @classmethod
    def get_all(cls,**data:dict):
        query = f'SELECT * FROM `{cls.table}`'
        if data:
            query += f' WHERE {" AND ".join(f"`{col}`=%({col})s" for col in data)};'
        results = connectToMySQL(DB).query_db(query,data)
        if results:
            return [cls(**row) for row in results]
        return []

    @classmethod
    def update(cls,id:int,**data:dict):
        query = f'''
                UPDATE `{cls.table}`
                SET {", ".join(f"`{col}`=%({col})s" for col in data)} 
                WHERE `id`=%(id)s;
                '''
        connectToMySQL(DB).query_db(query,{'id':id,**data})

    @classmethod
    def delete(cls,**data):
        query = f'DELETE FROM `{cls.table}`'
        if data:
            query += f'WHERE {" AND ".join(f"`{col}`=%({col})s" for col in data)};'
        connectToMySQL(DB).query_db(query,data)