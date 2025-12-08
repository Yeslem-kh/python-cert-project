import os
from dotenv import load_dotenv

load_dotenv()

class Config:
       # --- FIX: Add the missing ENV key ---
       # Reads FLASK_ENV from the .env file, or defaults to 'development' if not found.
       ENV = os.getenv('FLASK_ENV', 'development') 
       
       SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
       SQLALCHEMY_TRACK_MODIFICATIONS = False
       SECRET_KEY = os.getenv('SECRET_KEY')
       JWT_SECRET = os.getenv('JWT_SECRET')