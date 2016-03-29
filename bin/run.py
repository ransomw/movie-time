"""
totally way too much stuff crammed into a top-level script...
"""
import os
import sys
import re
import shutil
import argparse

import flask
from flask import render_template

PROJ_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..')
)

SERVER_DIR = os.path.join(PROJ_ROOT, 'core', 'server')
CLIENT_TEST_DIR = os.path.join(PROJ_ROOT, 'build', 'client_test')
TEMPLATES = [
    {
        'name': 'home.html',
    },
]

sys.path.append(SERVER_DIR)

import mtapp

def parse_args():
    """ parse script arguments """
    arg_parser = argparse.ArgumentParser()
    arg_parser.add_argument(
        'task',
        help="the task to perform",
        choices=['run', 'templates'],
        default='run')
    arg_parser.add_argument(
        '-p', '--port', dest='port',
        help="port number for the server",
        type=int,
        default=5000)
    return arg_parser.parse_args()


def _modify_url_for(is_static):
    """ use relative paths for static urls """
    orig_url_for = mtapp.app.create_jinja_environment().globals['url_for']

    def static_url_for(endpoint, **values):
        """ 'polyfill' """
        orig_rv = orig_url_for(endpoint, **values)
        if endpoint == 'static':
            return re.sub(r'^http://[^/]*/[^/]+', '', orig_rv)
        return orig_rv

    def app_url_for(endpoint, **values):
        """ 'polyfill' """
        orig_rv = orig_url_for(endpoint, **values)
        return orig_rv

    if is_static:
        mtapp.app.jinja_env.globals['url_for'] = static_url_for
    else:
        mtapp.app.jinja_env.globals['url_for'] = app_url_for


def run(port):
    """ run the application server """
    _modify_url_for(False)
    mtapp.app.run(host='0.0.0.0', port=port)


def _render_template(template):
    """
    render an individual template
    * `template`: dict containing template information
    """
    with mtapp.app.app_context():
        str_rendered = render_template(template['name'])
        t_file = open(
            os.path.join(CLIENT_TEST_DIR, template['name']),
            'w')
        t_file.write(str_rendered)
        t_file.close()


def _prepare_fixtures():
    """
    prepare url fixtures for static server
    """
    shutil.copy(
        os.path.join(
            PROJ_ROOT, 'test', 'fixtures',
            'zip_search_res.json'),
        os.path.join(
            PROJ_ROOT, 'build', 'client_test', 'api', 'zipcodes',
            '12345')
    )

def templates():
    """
    build the application's templates
    and prepare test fixtures
    """
    _modify_url_for(True)
    mtapp.app.config['SERVER_NAME'] = '' # not None
    for template in TEMPLATES:
        _render_template(template)
    _prepare_fixtures()


ARGS = parse_args()

if ARGS.task == 'run':
    run(ARGS.port)
elif ARGS.task == 'templates':
    templates()
else:
    raise NotImplementedError((
        "unimplemented task '" +
        ARGS.task))
