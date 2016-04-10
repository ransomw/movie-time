## movie-time

a web app that searches movie showtimes by zip code written to demo [flask](http://flask.pocoo.org/), [react](https://www.npmjs.com/package/react), and related tools.

### setup

##### system

developed with python 3.5.1 and node 5.5.0.
[pyenv](https://github.com/yyuu/pyenv) and [nvm](https://github.com/creationix/nvm) are useful for managing these runtimes.

test expects a [chromedriver](https://sites.google.com/a/chromium.org/chromedriver/downloads) executable on the system's path

##### install

* `pip install -r requirements.txt`
* `npm install`

#### build 'n run

###### full application

* `node bin/build_client`
  - `-c` flag for automatic rebuilds
* `python bin/run.py run`
  - `-p` flag for alternate http port

###### test

functional (end-to-end) test configuration is set in the file
`test/mttest/func/test.conf`
and tests are run with the command
`python bin/run.py test`

###### frontend demo

to run the frontend separately
with test fixtures in place of http api calls

* `node bin/build_client -p build/client_test/js/client/`
* `python bin/run.py templates`
* `cd build/client_test`
* `python -m http.server 5000`

searching the test zipcode '12345' will produce results
according to the fixture in `test/fixtures/zip_search_res.json`
