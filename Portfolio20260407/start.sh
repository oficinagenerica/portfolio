#!/bin/bash
cd "$(dirname "$0")"
PORT=3000
echo ""
echo "  Portfolio → http://localhost:$PORT/frontend/"
echo "  Press Ctrl+C to stop"
echo ""
python3 -m http.server $PORT
