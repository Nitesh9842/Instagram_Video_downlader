from flask import Flask, render_template, request, jsonify, send_file, send_from_directory
from download import download_reel_with_audio
import os

app = Flask(__name__, static_url_path='/static')

# Ensure download directory exists
DOWNLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'downloads')
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/download', methods=['POST'])
def download():
    try:
        reel_url = request.json.get('url')
        if not reel_url:
            return jsonify({'error': 'URL is required'}), 400
            
        video_path = download_reel_with_audio(reel_url)  # Updated function name
        
        # Return just the filename for the download
        filename = os.path.basename(video_path)
        return jsonify({
            'success': True,
            'filename': filename,
            'message': 'Reel downloaded successfully'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get-video/<filename>')
def get_video(filename):
    try:
        video_path = os.path.join('downloads', filename)
        return send_file(video_path, as_attachment=True)
    except Exception as e:
        return jsonify({'error': str(e)}), 404

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    app.run(debug=True)


