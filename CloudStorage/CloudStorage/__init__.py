import os, logging, requests
from flask import Flask, render_template, request, send_from_directory, redirect, url_for, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.utils import secure_filename


app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Configure the MongoDB client
client = MongoClient("mongodb://mongodb:27017/")
#client = MongoClient(os.environ['DATABASE_URI'] or "mongodb://mongodb:27017/")
db = client.ChatDB
collection = db.images

# collection.insert_one({"name": "WEQWEWe.png"})

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'ico'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/', methods=['POST'])
def index():
    # Retrieve the Authorization header from the incoming request
    auth_header = request.headers.get('Authorization')
    
    if not auth_header:
        return jsonify({"message": "Authorization header missing"}), 401

    # Extract the token from the header
    token = auth_header.split(" ")[1]

    # Prepare the headers for the outgoing request
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

    # Make the outgoing request to another API endpoint
    response = requests.post('http://cloudapi:3002/check', headers=headers)
    # Log the Authorization header
    logger.debug(f"\nAuthorization header: {response.status_code}")
    
    if response.status_code != 200:
        return 'Invalid authorization header', 401

    if 'file' not in request.files:
        return 'No file part', 404
    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 404
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filename = filename.replace(" ", "_")
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        collection.insert_one({"name": filename})
        # return redirect(url_for('uploaded_file', filename=filename))
    return 'Image Uploaded', 201
    # return render_template('index.html')


@app.route('/images', methods=['GET'])
def get_images():
    # Retrieve the Authorization header from the incoming request
    auth_header = request.headers.get('Authorization')

    if not auth_header:
        return jsonify({"message": "Authorization header missing"}), 401

    # Extract the token from the header
    token = auth_header.split(" ")[1]

    # Prepare the headers for the outgoing request
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

    # Make the outgoing request to another API endpoint
    response = requests.post('http://cloudapi:3002/check', headers=headers)
    # Log the Authorization header
    logger.debug(f"\nAuthorization header: {response.status_code}")

    if response.status_code != 200:
        return 'Invalid authorization header', 401

    # Directory where images are stored
    image_dir = 'uploads'

    # List files in the image directory
    image_files = os.listdir(image_dir)

    # Extract only the filenames, excluding directories
    image_names = [filename for filename in image_files if os.path.isfile(os.path.join(image_dir, filename))]

    # Return the list of image names as JSON
    return jsonify(image_names), 200


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    # auth_header = request.headers.get('Authorization')
    token = request.args.get('token')

    logger.debug(f"\nTOKEN: {token}")
    if token is None:
        return jsonify({"message": "Authorization header missing"}), 401

    # Prepare the headers for the outgoing request
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

    # Make the outgoing request to another API endpoint
    response = requests.post('http://cloudapi:3002/check', headers=headers)
    # Log the Authorization header
    logger.debug(f"\nAuthorization header UPLOADS: {response.status_code}")

    if response.status_code != 200:
        return 'Invalid authorization header', 401

        # Replace 'path_to_image.jpg' with the actual path to your image
        # return send_file('path_to_image.jpg', mimetype='image/jpeg')
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route('/download/<filename>', methods=['GET'])
def download(filename):
    if os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], filename)):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)
    else:
        return 'File not found!', 404


@app.route('/delete/<filename>', methods=['DELETE'])
def delete(filename):
    # auth_header = request.headers.get('Authorization')
    token = request.args.get('token')
    logger.debug(f"\nTOKEN: {token}")
    if token is None:
        return jsonify({"message": "Authorization header missing"}), 401

    # Prepare the headers for the outgoing request
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

    # Make the outgoing request to another API endpoint
    response = requests.post('http://cloudapi:3002/check', headers=headers)
    # Log the Authorization header
    logger.debug(f"\nAuthorization header UPLOADS: {response.status_code}")

    if response.status_code != 200:
        return 'Invalid authorization header', 401

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if os.path.exists(file_path):
        os.remove(file_path)
        return f'Deleted: {filename}', 202
        # return redirect(url_for('index'))
    else:
        return 'File not found!', 404
        # return redirect(url_for('index'))


@app.route('/deleteall', methods=['DELETE'])
def delete_all_files():
    # Retrieve the Authorization header from the incoming request
    auth_header = request.headers.get('Authorization')

    if not auth_header:
        return jsonify({"message": "Authorization header missing"}), 401

    # Extract the token from the header
    token = auth_header.split(" ")[1]

    # Prepare the headers for the outgoing request
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

    # Make the outgoing request to another API endpoint
    response = requests.post('http://cloudapi:3002/check', headers=headers)
    # Log the Authorization header
    logger.debug(f"\nAuthorization header: {response.status_code}")

    if response.status_code != 200:
        return 'Invalid authorization header', 401

    # Iterate over all files in the UPLOAD_FOLDER directory
    for filename in os.listdir(app.config['UPLOAD_FOLDER']):
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        if os.path.isfile(file_path):
            os.remove(file_path)
            app.logger.debug(f"Deleted: {filename}")

    return 'All files deleted', 202


def main():
    from waitress import serve
    serve(app, host='0.0.0.0', port=3003, threads=2)


if __name__ == '__main__':
    main()
