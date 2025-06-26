import sqlite3

# Connect or create the DB file
conn = sqlite3.connect('spots.db')
cursor = conn.cursor()

# Create table
cursor.execute('''
CREATE TABLE IF NOT EXISTS spots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL
)
''')

conn.commit()
conn.close()

print("Database initialized ✅")
