# app.py
import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
import google.generativeai as genai
# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure Gemini client with API key
try:
    genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
except Exception as e:
    # Handle the error if the key is not found
    print(f"Error initializing Gemini client: {e}")

# Define the model you will use
GEMINI_MODEL = "models/gemini-2.5-flash-lite"

@app.route('/test', methods=['GET'])
def test():
    return jsonify({"status": "success", "message": "Server is running!"})

@app.route('/generate', methods=['POST'])
def generate():
    try:
        data = request.json
        prompt = data.get('prompt', 'Hello!')
        
        model = genai.GenerativeModel(GEMINI_MODEL)
        response = model.generate_content(prompt)
        
        return jsonify({"status": "success", "response": response.text})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/models', methods=['GET'])
def list_models():
    try:
        models = genai.list_models()
        model_names = [m.name for m in models if 'generateContent' in m.supported_generation_methods]
        return jsonify({"status": "success", "models": model_names})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    


if __name__ == '__main__':
    app.run(debug=True, port=5000)