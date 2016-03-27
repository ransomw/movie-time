import os

from flask import Flask

from mtapp import config


_SETTINGS_ENV_VAR = 'MOVIE_TIME_FLASK_SETTINGS'
_PROJ_ROOT_DIR = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__), '..', '..', '..')
)

app = Flask(
    __name__,
    static_folder=os.path.join(_PROJ_ROOT_DIR, 'build', 'server_static')
)

if os.environ.get(_SETTINGS_ENV_VAR):
    app.config.from_envvar(_SETTINGS_ENV_VAR)
else:
    app.config.from_object(config)

import mtapp.views
