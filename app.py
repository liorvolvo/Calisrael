import sqlite3
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# 🏠 Homepage route
@app.route('/')
def home():
    return render_template('index.html')

# 🔁 Get all saved spots
@app.route('/spots')
def get_spots():
    conn = sqlite3.connect('spots.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, name, description, latitude, longitude FROM spots')
    rows = cursor.fetchall()
    conn.close()

    spots = []
    for row in rows:
        spots.append({
            'id': row[0],
            'name': row[1],
            'description': row[2],
            'lat': row[3],
            'lon': row[4]
        })

    return jsonify(spots)

# ➕ Save a new spot
@app.route('/add_spot', methods=['POST'])
def add_spot():
    data = request.get_json()

    name = data.get('name')
    description = data.get('description')
    lat = data.get('lat')
    lon = data.get('lon')

    if not name or not lat or not lon:
        return jsonify({'success': False, 'error': 'Missing required fields'}), 400

    conn = sqlite3.connect('spots.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO spots (name, description, latitude, longitude) VALUES (?, ?, ?, ?)',
                   (name, description, lat, lon))
    conn.commit()
    conn.close()

    return jsonify({'success': True})

# 🛠️ Run the app
if __name__ == '__main__':
    app.run(debug=True)
