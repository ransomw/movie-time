#! /usr/bin/env python
import os
import sys

PROJ_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..')
)

SERVER_DIR = os.path.join(PROJ_ROOT, 'core', 'server')

sys.path.append(SERVER_DIR)

import mtapp

PORT = 5000

if os.environ.get('PORT'):
    PORT = int(os.environ['PORT'])

mtapp.app.run(host='0.0.0.0', port=PORT)


