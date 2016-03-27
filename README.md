## movie-time

a web app that searches movie showtimes by zip code written to demo [flask](http://flask.pocoo.org/), [react](https://www.npmjs.com/package/react), and related tools.

### setup

##### system

developed with python 3.5.1 and node 5.5.0.
[pyenv](https://github.com/yyuu/pyenv) and [nvm](https://github.com/creationix/nvm) are useful for managing these runtimes.

##### install

* `pip install -r requirements.txt`
* `npm install`

##### build 'n run

* `node bin/build_client`
  - `-c` flag for automatic rebuilds
* `python core/server/run.py`
  - `PORT` environment variable for alternate http port

