from flask import Flask, request, jsonify, make_response # make_response imported
from flask_cors import CORS
from config import Config
from models import db, User, Note
import jwt
from datetime import datetime, timedelta
from functools import wraps

app = Flask(__name__)
# IMPORTANT: When using cookies with CORS, set supports_credentials=True
CORS(app, supports_credentials=True)

app.config.from_object(Config)
db.init_app(app)

def generate_token(user_id, role):
    payload = {
        'user_id': user_id,
        'role': role,
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, app.config['JWT_SECRET'], algorithm='HS256')

# --- MODIFIED: token_required to read from cookie ---
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # 1. Look for the token in the 'jwt_token' cookie
        token = request.cookies.get('jwt_token')
        
        if not token:
            # Fallback check for Authorization header (useful for Burp/external tools)
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                token = auth_header.replace('Bearer ', '')
            else:
                return jsonify({'error': 'Authentication token is missing'}), 401
        
        try:
            data = jwt.decode(token, app.config['JWT_SECRET'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
            if not current_user:
                 return jsonify({'error': 'Token user not found'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token is invalid'}), 401
        except:
            return jsonify({'error': 'Token processing error'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

# --- MODIFIED: register to set JWT cookie and remove token from body ---
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    user = User(
        username=data['username'],
        email=data['email'],
        password=data['password'],
        role='user'
    )
    
    db.session.add(user)
    db.session.commit()
    
    token = generate_token(user.id, user.role)
    user.jwt_token = token
    db.session.commit()
    
    # Prepare the JSON response body
    user_data = {
        'success': True,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
        }
    }
    
    # Create response and set HTTP-only cookie
    response = make_response(jsonify(user_data), 201)
    response.set_cookie(
        'jwt_token', 
        token, 
        httponly=True, 
        samesite='Lax',
        # Fixed KeyError: 'ENV' - use .get() for safety or ensure 'ENV' is in Config
        secure=app.config.get('ENV', 'development') == 'production' 
    )
    
    return response

# --- MODIFIED: login to set JWT cookie and remove token from body ---
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username'], password=data['password']).first()
    
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401
    
    token = generate_token(user.id, user.role)
    user.jwt_token = token
    db.session.commit()
    
    # Prepare the JSON response body
    user_data = {
        'success': True,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
        }
    }
    
    # Create response and set HTTP-only cookie
    response = make_response(jsonify(user_data))
    response.set_cookie(
        'jwt_token', 
        token, 
        httponly=True, 
        samesite='Lax', 
        secure=app.config.get('ENV', 'development') == 'production'
    )
    
    return response

# --- NEW: logout route to clear the cookie ---
@app.route('/api/logout', methods=['POST'])
def logout():
    # Create a response and expire the jwt_token cookie
    response = make_response(jsonify({'success': True}))
    response.set_cookie('jwt_token', '', expires=0, httponly=True)
    return response

# IDOR VULNERABILITY: No authentication check! (Vulnerable endpoint remains for challenge)
@app.route('/api/user/profile/<int:user_id>', methods=['GET'])
def get_user_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role,
        'jwt': user.jwt_token
    })

@app.route('/api/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.json
    
    if 'username' in data:
        current_user.username = data['username']
    if 'email' in data:
        current_user.email = data['email']
    if 'password' in data and data['password']:
        current_user.password = data['password']
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'user': {
            'id': current_user.id,
            'username': current_user.username,
            'email': current_user.email,
            'role': current_user.role
        }
    })

@app.route('/api/notes', methods=['GET'])
@token_required
def get_notes(current_user):
    notes = Note.query.filter_by(user_id=current_user.id).all()
    return jsonify([{
        'id': note.id,
        'title': note.title,
        'content': note.content,
        'createdAt': note.created_at.isoformat(),
        'updatedAt': note.updated_at.isoformat()
    } for note in notes])

@app.route('/api/notes', methods=['POST'])
@token_required
def create_note(current_user):
    data = request.json
    note = Note(
        title=data['title'],
        content=data['content'],
        user_id=current_user.id
    )
    db.session.add(note)
    db.session.commit()
    
    return jsonify({
        'id': note.id,
        'title': note.title,
        'content': note.content,
        'createdAt': note.created_at.isoformat()
    }), 201

@app.route('/api/notes/<int:note_id>', methods=['PUT'])
@token_required
def update_note(current_user, note_id):
    note = Note.query.get(note_id)
    if not note or note.user_id != current_user.id:
        return jsonify({'error': 'Note not found'}), 404
    
    data = request.json
    note.title = data['title']
    note.content = data['content']
    db.session.commit()
    
    return jsonify({
        'id': note.id,
        'title': note.title,
        'content': note.content,
        'updatedAt': note.updated_at.isoformat()
    })

@app.route('/api/notes/<int:note_id>', methods=['DELETE'])
@token_required
def delete_note(current_user, note_id):
    note = Note.query.get(note_id)
    if not note or note.user_id != current_user.id:
        return jsonify({'error': 'Note not found'}), 404
    
    db.session.delete(note)
    db.session.commit()
    
    return jsonify({'success': True})

def init_db():
    with app.app_context():
        db.create_all()
        
        # Create admin user if not exists
        if not User.query.filter_by(username='admin').first():
            admin = User(
                username='admin',
                email='admin@example.com',
                password='admin123',
                role='admin'
            )
            admin_token = generate_token(1, 'admin')
            admin.jwt_token = admin_token
            db.session.add(admin)
            
            # Create demo user
            user = User(
                username='user1',
                email='user1@example.com',
                password='password123',
                role='user'
            )
            user_token = generate_token(2, 'user')
            user.jwt_token = user_token
            db.session.add(user)
            
            db.session.commit()
            print('Database initialized with demo users!')

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)