from flask import Blueprint
from flask import jsonify

from mtapp.lib.zip_search import search as goog_search_zip

class ApiBlueprint(Blueprint):

    def __init__(self, *args, **kwargs):
        super(ApiBlueprint, self).__init__(*args, **kwargs)

    def read(self, rule):
        return super(ApiBlueprint, self).route(rule, methods=['GET'])


bp_api = ApiBlueprint('catalog', __name__)

@bp_api.read('/zipcodes/<string:zip_code>')
def search_zip(zip_code):
    try:
        res_search = goog_search_zip(zip_code)
    except ValueError as err:
        if len(err.args) > 1 and err.args[1] == zip_code:
            resp = jsonify(
                msg="invalid zip code",
                err_code=1,
            )
            resp.status_code = 400
            return resp
        raise err
    return jsonify(theaters=res_search)
