
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

# In-memory database for API keys
api_keys_db = [
    {
        "id": "sk-1",
        "name": "Default Key",
        "key": "sk_...aBc1",
        "status": "Active",
        "createdAt": 1727289582,
        "permissions": {
            "read:projects": True, "write:projects": True, "delete:projects": False,
            "read:training_jobs": True, "execute:training_jobs": True,
            "read:models": True, "write:models": True, "delete:models": False, "deploy:models": False,
            "read:datasources": True, "write:datasources": False, "delete:datasources": False,
            "execute:predictions": True,
            "read:users": False, "write:users": False, "read:billing": False, "admin:webhooks": False
        }
    },
    {
        "id": "sk-2",
        "name": "Marketing API Key",
        "key": "sk_...dEf2",
        "status": "Active",
        "createdAt": 1726684782,
        "permissions": { "read:projects": True, "execute:predictions": True }
    }
]


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
        'domainType': data.get('domainType'),
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

@app.route('/api/keys', methods=['GET'])
def get_api_keys():
    """Returns a list of all API keys, excluding the full key for security."""
    # Return a "short" version of the key
    censored_keys = []
    for key in api_keys_db:
        censored_key = key.copy()
        censored_key['key'] = f"{key['key'][:5]}...{key['key'][-4:]}"
        censored_keys.append(censored_key)
    return jsonify(censored_keys)

@app.route('/api/keys', methods=['POST'])
def create_api_key():
    """Creates a new API key and adds it to the list."""
    data = request.json
    name = data.get('name')
    permissions = data.get('permissions', {})

    if not name:
        return jsonify({'error': 'Key name is required'}), 400

    new_key_id = f"sk-{len(api_keys_db) + 1}"
    # Generate a secure, random 64-character key
    full_key = f"sk_{uuid.uuid4().hex}{uuid.uuid4().hex}"

    new_key = {
        "id": new_key_id,
        "name": name,
        "key": full_key,
        "status": "Active",
        "createdAt": time.time(),
        "permissions": permissions
    }
    api_keys_db.append(new_key)
    # Return the full key this one time
    return jsonify(new_key), 201

@app.route('/api/keys/<key_id>', methods=['DELETE'])
def delete_api_key(key_id):
    """Deletes an API key."""
    global api_keys_db
    key_to_delete = next((key for key in api_keys_db if key['id'] == key_id), None)
    if key_to_delete:
        api_keys_db = [key for key in api_keys_db if key['id'] != key_id]
        return jsonify({'message': 'API key deleted successfully'}), 200
    return jsonify({'error': 'API key not found'}), 404

@app.route('/api/keys/<key_id>/status', methods=['PATCH'])
def toggle_api_key_status(key_id):
    """Toggles the status of an API key."""
    data = request.json
    new_status = data.get('status')
    if new_status not in ['Active', 'Inactive']:
        return jsonify({'error': 'Invalid status'}), 400

    key_to_update = next((key for key in api_keys_db if key['id'] == key_id), None)
    if key_to_update:
        key_to_update['status'] = new_status
        return jsonify(key_to_update), 200
    return jsonify({'error': 'API key not found'}), 404

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
from flask import Response, stream_with_context
from training_logs import TRAINING_LOGS

@app.route('/api/train_model_stream', methods=['GET'])
def train_model_stream():
    """
    Simulates a model training process, streaming logs and accuracy updates via SSE.
    """
    project_id = request.args.get('projectId')
    training_time_minutes = int(request.args.get('trainingTime', 4))

    if not project_id:
        return jsonify({'error': 'Project ID is required'}), 400

    project = projects_db.get(project_id)
    if not project:
        return jsonify({'error': 'Project not found'}), 404

    domain = project.get('domainType', 'default')

    # --- Dynamic Model Selection ---
    model_map = {
        'City': 'City.onnx',
        'Oil and Gas': 'OilandGas.onnx',
        'Traffic': 'Traffic.onnx',
        'Airports': 'Airports.onnx'
    }
    selected_model_file = model_map.get(domain)
    if not selected_model_file:
        # Fallback for other domains
        available_models = [f for f in os.listdir(MODELS_FOLDER) if os.path.isfile(os.path.join(MODELS_FOLDER, f))]
        selected_model_file = random.choice(available_models) if available_models else None

    if not selected_model_file:
        return jsonify({'error': 'No suitable model found for the project domain.'}), 500

    def generate_logs():
        total_seconds = training_time_minutes * 60
        num_epochs = min(100, max(10, int(training_time_minutes * 2.5))) # Scale epochs with time

        # 1. Starting Logs
        start_logs = [
            "Initializing training environment...",
            "Authenticating user...",
            "Requesting GPU resources...",
            "GPU resources allocated.",
            f"Selected model: {selected_model_file} for domain: {domain}",
            "Loading dataset...",
            "Dataset loaded. Found 15,000 samples.",
            "Preprocessing and augmenting data...",
        ]
        for log in start_logs:
            yield f"data: {{\"log\": \"{log}\"}}\n\n"
            time.sleep(random.uniform(0.1, 0.3))

        # 2. Middle (Epoch) Logs
        middle_logs = [log for log in TRAINING_LOGS if "Epoch" not in log and "Shutting down" not in log]

        start_accuracy = random.uniform(30, 40)

        # Determine final accuracy range
        if 4 <= training_time_minutes <= 10:
            end_accuracy = random.uniform(75, 85)
        elif 10 < training_time_minutes <= 30:
            end_accuracy = random.uniform(80, 90)
        else: # 30-60 minutes
            end_accuracy = random.uniform(85, 95)

        total_steps = num_epochs + len(middle_logs)
        time_per_step = total_seconds / total_steps if total_steps > 0 else 0

        for i in range(num_epochs):
            # Simulate gradual accuracy increase
            current_progress = i / num_epochs
            accuracy = start_accuracy + (end_accuracy - start_accuracy) * (current_progress + random.uniform(-0.05, 0.05))
            accuracy = max(start_accuracy, min(end_accuracy, accuracy)) # Clamp accuracy

            loss = 1.5 * (1 - (accuracy / 100)) + random.uniform(-0.1, 0.1)

            epoch_log = f"Epoch {i+1}/{num_epochs} - loss: {loss:.4f} - accuracy: {accuracy/100:.4f}"
            yield f"data: {{\"log\": \"{epoch_log}\", \"accuracy\": {accuracy:.2f}}}\n\n"

            # Sprinkle in random logs
            if i % 5 == 0 and middle_logs:
                random_log = random.choice(middle_logs)
                yield f"data: {{\"log\": \"{random_log}\"}}\n\n"
                time.sleep(time_per_step / 2) # Extra delay for random logs

            time.sleep(time_per_step)

        # 3. Finishing Logs
        end_logs = [
            "Finalizing model...",
            "Running final evaluation on test set...",
            "Saving model to registry...",
            "Model saved successfully.",
            "Shutting down training process...",
            "Releasing GPU resources."
        ]
        for log in end_logs:
            yield f"data: {{\"log\": \"{log}\"}}\n\n"
            time.sleep(random.uniform(0.2, 0.5))

        # Final accuracy signal
        yield f"data: {{\"final_accuracy\": {end_accuracy:.2f}}}\n\n"

    return Response(stream_with_context(generate_logs()), mimetype='text/event-stream')


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
    # The frontend already simulates the delay, so we remove it from the backend
    # to prevent waiting twice.
    # training_time_seconds = training_time_minutes * 60
    # print(f"Simulating model training for {training_time_minutes} minutes ({training_time_seconds} seconds)...")
    # time.sleep(training_time_seconds)
    print("Backend processing complete, generating metrics immediately.")

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