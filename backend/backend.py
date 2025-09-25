
import os
import time
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS



app = Flask(__name__)


CORS(app)


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
MODELS_FOLDER = os.path.join(BASE_DIR, 'predefined_models')

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(MODELS_FOLDER, exist_ok=True)


# --- 2. API ENDPOINTS ---

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


@app.route('/api/generate_model', methods=['POST'])
def generate_model():
    """
    The core "dummy" endpoint. It simulates model generation.
    It takes user parameters and returns a predefined model file.
    """
    # Get the JSON data sent from the frontend
    params = request.json
    print(f"Received parameters for model generation: {params}")

    # --- Simulate Processing Delay ---
    # This makes the frontend experience feel more realistic.
    print("Simulating model training for 5 seconds...")
    time.sleep(5)
    print("Simulation complete.")

    # --- Dummy Logic to Select a Model ---
    # Based on the received parameters, we choose which fake model to return.
    # This logic can be as simple or complex as you need for the demo.
    analytics_type = params.get('analyticsType', 'default')
    domain = params.get('domain', 'default')
    model_filename = 'default_model.pkl' # Fallback model

    if analytics_type == 'Predictive Analytics' and domain == 'Transport':
        model_filename = 'transport_regression_model.pkl'
    elif analytics_type == 'Predictive Analytics' and domain == 'Solid Waste':
        model_filename = 'waste_management_classifier.h5'
    elif analytics_type == 'Sentiment Analytics':
        model_filename = 'sentiment_analysis_model.onnx'

    # --- Prepare the Response ---
    # The response gives the frontend everything it needs to show the result.
    return jsonify({
        'message': 'Model generation completed successfully!',
        'modelName': model_filename,
        'downloadUrl': f'/api/download_model/{model_filename}',
        'apiEndpoint': '/api/predict',
        'parametersReceived': params # Echo back the params for confirmation
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