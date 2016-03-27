from flask import render_template

from mtapp import app
from mtapp.api import bp_api

@app.route('/')
def home():
    return render_template('home.html')

app.register_blueprint(bp_api, url_prefix='/api')
