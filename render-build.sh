#!/usr/bin/env bash
# exit on error
set -o errexit

# Install system dependencies
apt-get update
apt-get install -y ffmpeg

# Install Python dependencies
pip install -r requirements.txt

# Run Django management commands from backend/
python backend/manage.py collectstatic --noinput
python backend/manage.py migrate
