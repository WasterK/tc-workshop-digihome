from flask import Flask, render_template, jsonify, request_started, request
import json

app = Flask(__name__)

# Initial bedroom temperature value
bedroom_temperature = "--"
bedroom_humidity = "--"

@app.route('/')
def index():
    return render_template('index.html', bedroom_temperature=bedroom_temperature)


#get temperature and humidity from sensor
@app.route("/update-temp-humid", methods=['POST', 'GET'])
def update_temp_humid_from_sensor():
    global bedroom_temperature
    global bedroom_humidity
        
    if request.method == "POST":
        data = request.get_json()
        bedroom_temperature = data.get('temperature', '--')
        bedroom_humidity = data.get('humidity', '--')
        
        # Signal to update the UI
        return jsonify({'success': True, 'temperature': bedroom_temperature, 'humidity': bedroom_humidity})

    elif request.method == "GET":
        # Handle GET request if needed
        return jsonify({'temperature': bedroom_temperature, 'humidity': bedroom_humidity})

if __name__ == '__main__':
    app.run(debug=True)
