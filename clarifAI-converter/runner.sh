#!/bin/bash
export FLASK_APP="$(dirname "$0")/app.py"
flask run