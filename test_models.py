import os
from dotenv import load_dotenv
import google.generativeai as genai


load_dotenv(dotenv_path='../.env')


api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
    print("GEMINI_API_KEY not found!")
    exit(1)

genai.configure(api_key=api_key)
print("Gemini API configured\n")


print("Available Gemini Models:")
print("=" * 80)

try:
    models = genai.list_models()
    
    generation_models = []
    
    for model in models:

        if 'generateContent' in model.supported_generation_methods:
            generation_models.append(model)
            print(f"{model.name}")
            print(f"   Display Name: {model.display_name}")
            print(f"   Description: {model.description}")
            print(f"   Supported Methods: {', '.join(model.supported_generation_methods)}")
            print(f"   Input Token Limit: {model.input_token_limit}")
            print(f"   Output Token Limit: {model.output_token_limit}")
            print("-" * 80)
    
    print(f"\nFound {len(generation_models)} models that support generateContent")
    print("\nRecommended models to use:")
    for model in generation_models[:3]:  
        print(f"   - {model.name}")
    
except Exception as e:
    print(f"Error listing models: {e}")