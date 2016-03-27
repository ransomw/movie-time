#! /usr/bin/env python
import os

import mtapp

PORT = 5000

if os.environ.get('PORT'):
    PORT = int(os.environ['PORT'])

mtapp.app.run(host='0.0.0.0', port=PORT)


