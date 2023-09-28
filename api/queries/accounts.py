import os
from psycopg_pool import ConnectionPool
pool = ConnectionPool(conninfo=os.environ.get("postgresql://guideme:secret@postgres/guideme_db"))
