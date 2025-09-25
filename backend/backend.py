
import os
import time
import uuid
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# --- 1. SETUP & IN-MEMORY DATABASES ---

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
MODELS_FOLDER = os.path.join(BASE_DIR, 'predefined_models')

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(MODELS_FOLDER, exist_ok=True)

# In-memory database for storing project details
projects_db = {}

# --- 2. API ENDPOINTS ---

@app.route('/api/projects', methods=['GET'])
def get_projects():
    """Returns a list of all projects."""
    return jsonify(list(projects_db.values()))

@app.route('/api/projects', methods=['POST'])
def create_project():
    """Creates a new project and stores it."""
    data = request.json
    project_id = str(uuid.uuid4())
    new_project = {
        'id': project_id,
        'name': data.get('name'),
        'description': data.get('description'),
        'owner': data.get('owner'),
        'createdAt': time.time()
    }
    projects_db[project_id] = new_project
    return jsonify(new_project), 201

@app.route('/api/projects/<project_id>', methods=['GET'])
def get_project(project_id):
    """Returns details for a specific project."""
    project = projects_db.get(project_id)
    if project:
        return jsonify(project)
    return jsonify({'error': 'Project not found'}), 404

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """
    Endpoint to handle file uploads from the user.
    It saves the file to the 'uploads' directory.
    """
    # Check if the 'file' key is in the request's file parts
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']

    # Check if the user submitted an empty part without a filename
    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading'}), 400

    if file:
        # We don't do anything with the file, just save it to show it was received.
        filename = file.filename
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        return jsonify({
            'message': f'File "{filename}" uploaded successfully. Ready to generate model.'
        }), 200

    return jsonify({'error': 'File upload failed'}), 500

@app.route('/api/test_connection', methods=['POST'])
def test_connection():
    """
    Simulates testing a data source connection.
    Waits for 2 seconds and returns a success message.
    """
    print(f"Received request to test connection with data: {request.json}")
    time.sleep(2)
    return jsonify({'status': 'success', 'message': 'Connection successful!'})

@app.route('/api/models', methods=['GET'])
def get_models():
    """
    Scans the predefined_models directory and returns a list of available models.
    """
    models = []
    for filename in os.listdir(MODELS_FOLDER):
        if os.path.isfile(os.path.join(MODELS_FOLDER, filename)):
            file_path = os.path.join(MODELS_FOLDER, filename)
            models.append({
                'fileName': filename,
                'fileSize': os.path.getsize(file_path),
                'createdAt': os.path.getctime(file_path)
            })
    return jsonify(models)

import random

@app.route('/api/generate_model', methods=['POST'])
def generate_model():
    """
    The core "dummy" endpoint. It simulates model generation based on user parameters.
    """
    params = request.json
    domain = params.get('domain', 'default')
    training_time_minutes = params.get('trainingTime', 1)

    print(f"Received parameters for model generation: {params}")

    # --- Simulate Processing Delay ---
    training_time_seconds = training_time_minutes * 60
    print(f"Simulating model training for {training_time_minutes} minutes ({training_time_seconds} seconds)...")
    time.sleep(training_time_seconds)
    print("Simulation complete.")

    # --- Dynamic Model Selection ---
    try:
        available_models = {f: f for f in os.listdir(MODELS_FOLDER) if os.path.isfile(os.path.join(MODELS_FOLDER, f))}

        # Try to find a model that exactly matches the domain name (case-sensitive)
        selected_model_file = available_models.get(domain)

        if selected_model_file:
            print(f"Selected model for domain '{domain}': {selected_model_file}")
        else:
            # Fallback to a random model if no specific model is found
            print(f"No model found for domain '{domain}'. Falling back to a random model.")
            if not available_models:
                return jsonify({'error': 'No predefined models found on the server.'}), 500
            selected_model_file = random.choice(list(available_models.values()))
            print(f"Randomly selected model: {selected_model_file}")

    except Exception as e:
        print(f"Error selecting model: {e}")
        return jsonify({'error': 'Could not select a model.'}), 500

    # --- Generate Dummy Metrics ---
    if 4 <= training_time_minutes <= 20:
        accuracy = round(random.uniform(80, 90), 2)
    elif 20 < training_time_minutes <= 40:
        accuracy = round(random.uniform(90, 95), 2)
    elif 40 < training_time_minutes <= 60:
        accuracy = round(random.uniform(93, 96.5), 2)
    else:
        accuracy = round(random.uniform(75, 85), 2)  # Fallback

    precision = round(random.uniform(88, 99), 2)
    recall = round(random.uniform(82, 97), 2)
    f1_score = round(2 * (precision * recall) / (precision + recall), 2)

    # --- Prepare the Response ---
    return jsonify({
        'message': 'Model generation completed successfully!',
        'modelName': f"{domain.replace(' ', '_')}_Model_v1",
        'downloadUrl': f'/api/download_model/{selected_model_file}',
        'apiEndpoint': '/api/predict',
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1Score': f1_score,
        'parametersReceived': params
    }), 200


@app.route('/api/download_model/<filename>', methods=['GET'])
def download_model(filename):
    """
    Endpoint to serve the selected dummy model file for download.
    """
    # `send_from_directory` is a secure way to send files from a directory.
    # `as_attachment=True` tells the browser to download the file, not display it.
    print(f"Request to download model: {filename}")
    if os.path.exists(os.path.join(MODELS_FOLDER, filename)):
        return send_from_directory(MODELS_FOLDER, filename, as_attachment=True)
    else:
        return jsonify({'error': 'Model file not found.'}), 404

@app.route('/api/predict', methods=['POST'])
def predict():
    """
    A dummy endpoint to simulate making a prediction with the "generated" model.
    """
    # Get the dummy input data from the request
    input_data = request.json
    print(f"Received prediction request with data: {input_data}")

    # Simulate a quick prediction delay
    time.sleep(1)

    # Return a fake, deterministic prediction result.
    # Using hash() makes the result change based on input, which looks more real.
    prediction_value = abs(hash(str(input_data))) % 1000
    
    return jsonify({
        'message': 'Prediction successful',
        'inputData': input_data,
        'prediction': {
            'riskScore': prediction_value / 10,
            'category': 'Category B' if prediction_value > 500 else 'Category A',
            'confidence': f"{ (prediction_value % 40) + 50 }%" # A value between 50-90%
        }
    }), 200


# --- 3. RUN THE APPLICATION ---

if __name__ == '__main__':
    # The host='0.0.0.0' makes the server accessible from other devices on the network.
    # The port can be any available port. 5001 is a common choice for Flask backends.
    app.run(host='0.0.0.0', port=5001, debug=True)