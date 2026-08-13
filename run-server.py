#!/usr/bin/env python3
"""
Simple HTTP Server for Mat Tong Viet Website
Run this script to serve the website over HTTP so Supabase can be loaded from CDN
"""

import http.server
import socketserver
import os
from pathlib import Path

# Get the directory where this script is located
SCRIPT_DIR = Path(__file__).parent
PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(SCRIPT_DIR), **kwargs)
    
    def log_message(self, format, *args):
        # Log requests to console
        print(f"[{self.log_date_time_string()}] {format % args}")

def run_server():
    """Start the HTTP server"""
    handler = MyHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print("=" * 60)
        print("🌐 Mat Tong Viet Website Server")
        print("=" * 60)
        print(f"✅ Server running at: http://localhost:{PORT}")
        print(f"✅ Open your browser and visit: http://localhost:{PORT}")
        print(f"✅ Press Ctrl+C to stop the server")
        print("=" * 60)
        print()
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped by user")
            print("Goodbye!")

if __name__ == "__main__":
    run_server()
