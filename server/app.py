import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import json

# Load environment variables from parent directory
load_dotenv(dotenv_path='../.env')

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure Gemini client with API key
try:
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("❌ GEMINI_API_KEY not found in .env file!")
    else:
        genai.configure(api_key=api_key)
        print("✅ Gemini API configured successfully")
except Exception as e:
    print(f"❌ Error initializing Gemini client: {e}")

# Use the latest stable Gemini 2.5 Flash model
GEMINI_MODEL = "models/gemini-2.5-flash"

@app.route('/test', methods=['GET'])
def test():
    return jsonify({"status": "success", "message": "Flask AI Server is running!"})

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

@app.route('/analyze-repo', methods=['POST'])
def analyze_repo():
    """
    Analyze GitHub repository data and generate job search keywords
    """
    try:
        data = request.json
        print(f"📥 Received request: {data.get('owner')}/{data.get('repo')}")
        
        # Extract data from GitHub analysis
        repo_name = data.get('repo', 'Unknown')
        owner = data.get('owner', 'Unknown')
        languages = data.get('languages', [])
        readme = data.get('readme', '')
        files = data.get('files', {})
        
        # Build file list and code snippets separately
        newline = '\n'
        file_list = newline.join([f"- {filename}" for filename in list(files.keys())[:10]])
        code_snippets = newline.join([f"File: {name}{newline}{content[:500]}..." for name, content in list(files.items())[:3]])
        
        # Try AI first, fallback to rule-based if it fails
        try:
            # Build the prompt for Gemini
            prompt = f"""
You are an expert technical recruiter and software engineering analyst. Analyze this GitHub repository and provide:

1. **Job Search Keywords**: A list of 5-10 specific job titles and technical skills that match this project
2. **Project Description**: A concise 2-3 sentence description of what this project does and its technical focus

**Repository Information:**
- Name: {owner}/{repo_name}
- Languages: {', '.join(languages)}

**README (first 3000 chars):**
{readme}

**Key Files Found:**
{file_list}

**Sample Code Snippets:**
{code_snippets}

Please respond in this EXACT JSON format (no markdown, just raw JSON):
{{
  "keywords": ["keyword1", "keyword2", ...],
  "project_description": "Description here",
  "tech_stack": ["tech1", "tech2", ...],
  "role_focus": "frontend/backend/fullstack/mobile/data/devops"
}}
"""

            print("🤖 Attempting Gemini AI analysis...")
            model = genai.GenerativeModel(GEMINI_MODEL)
            response = model.generate_content(prompt)
            
            # Parse the AI response
            ai_text = response.text.strip()
            print(f"📄 AI Response (first 200 chars): {ai_text[:200]}")
            
            # Remove markdown code blocks if present
            if ai_text.startswith('```'):
                ai_text = ai_text.split('```')[1]
                if ai_text.startswith('json'):
                    ai_text = ai_text[4:]
                ai_text = ai_text.strip()
            
            # Parse JSON
            analysis = json.loads(ai_text)
            print("✅ AI Analysis successful!")
            
        except Exception as ai_error:
            print(f"⚠️  AI Error: {str(ai_error)[:200]}")
            print("🔄 Using intelligent fallback analysis...")
            
            # FALLBACK: Generate smart analysis based on languages and files
            primary_lang = languages[0] if languages else "Unknown"
            
            # Determine role focus based on languages and files
            frontend_indicators = ['TypeScript', 'JavaScript', 'HTML', 'CSS', 'React', 'Vue', 'Angular']
            backend_indicators = ['Python', 'Java', 'Go', 'Ruby', 'PHP', 'C#', 'Rust']
            mobile_indicators = ['Swift', 'Kotlin', 'Dart']
            data_indicators = ['Python', 'R', 'Scala', 'SQL']
            
            has_frontend = any(lang in frontend_indicators for lang in languages) or any('frontend' in f.lower() for f in files.keys())
            has_backend = any(lang in backend_indicators for lang in languages) or any('backend' in f.lower() or 'server' in f.lower() for f in files.keys())
            has_mobile = any(lang in mobile_indicators for lang in languages)
            has_data = any(lang in data_indicators for lang in languages) and any('data' in f.lower() or 'ml' in f.lower() for f in files.keys())
            
            # Determine role
            if has_frontend and has_backend:
                role = "fullstack"
            elif has_mobile:
                role = "mobile"
            elif has_data:
                role = "data"
            elif has_frontend:
                role = "frontend"
            elif has_backend:
                role = "backend"
            else:
                role = "fullstack"
            
            # Generate keywords
            keywords = []
            
            # Add role-based keywords
            if role == "frontend":
                keywords.extend(["Frontend Developer", "UI Developer", "Web Developer"])
            elif role == "backend":
                keywords.extend(["Backend Developer", "API Developer", "Server Engineer"])
            elif role == "fullstack":
                keywords.extend(["Full Stack Developer", "Software Engineer", "Web Developer"])
            elif role == "mobile":
                keywords.extend(["Mobile Developer", "iOS Developer", "Android Developer"])
            elif role == "data":
                keywords.extend(["Data Engineer", "Machine Learning Engineer", "Data Scientist"])
            
            # Add language-specific keywords
            keywords.extend([f"{lang} Developer" for lang in languages[:3]])
            
            # Add generic keywords
            keywords.extend(["Software Developer", "Engineer"])
            
            # Remove duplicates and limit to 10
            keywords = list(dict.fromkeys(keywords))[:10]
            
            # Generate description
            description = f"This is a {primary_lang}-based {role} project "
            if has_frontend and has_backend:
                description += "with both frontend and backend components. "
            else:
                description += f"focusing on {role} development. "
            
            description += f"The repository contains {len(files)} analyzed files using technologies including {', '.join(languages[:3])}."
            
            analysis = {
                "keywords": keywords,
                "project_description": description,
                "tech_stack": languages[:5],
                "role_focus": role
            }
            
            print("✅ Fallback analysis complete")
        
        return jsonify({
            "status": "success",
            "analysis": analysis
        })
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON Parse Error: {e}")
        return jsonify({
            "status": "error", 
            "message": "Failed to parse AI response"
        }), 500
    except Exception as e:
        print(f"❌ Error in analyze_repo: {e}")
        import traceback
        traceback.print_exc()
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
    print("=" * 50)
    print("🚀 Starting Flask AI Server on port 5001...")
    print("📍 Express backend should be on port 3000")
    print(f"🤖 Using model: {GEMINI_MODEL}")
    print("=" * 50)
    app.run(debug=True, port=5001, host='0.0.0.0')