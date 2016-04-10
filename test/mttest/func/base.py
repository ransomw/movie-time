""" common functionality for all end-to-end tests """
import os
import time
import unittest
import configparser
import multiprocessing

from selenium import webdriver

import mtapp

CONF_FILE = os.path.join(os.path.dirname(__file__), 'test.conf')

class TestError(Exception):
    pass

config = configparser.ConfigParser()
config.read(CONF_FILE)
PORT = int(config['app']['port'])
APP_STARTUP_TIME = int(config['app']['startup_time'])
if config['webdriver']['type'] not in ['phantom', 'chrome']:
    raise TestError("unknown webdriver type",
                    config['webdriver']['type'])


class BaseTestCase(unittest.TestCase):
    """
    setup and teardown app and webdriver instance
    """

    def setUp(self):
        def app_worker(port):
            mtapp.app.run(port=port, use_reloader=False)

        self._process = multiprocessing.Process(
            target=app_worker, args=(PORT,)
        )
        self._process.start()
        # todo: replace dumb timeout w/ explicit detection
        #  that flask app has started ... if it's possible to call
        #  a function when the flask app starts, then it's possible
        #  to .put() something in a multiprocessing.Queue and wait
        #  to .get() that (or an error result) here 二布师 teh timeout
        time.sleep(APP_STARTUP_TIME)
        if config['webdriver']['type'] == 'phantom':
            # todo: phantomjs appears not to be running client scripts
            #  ... insomuch as self.get_html() returns the original
            #  page source, not the rendered react component
            self._driver = webdriver.PhantomJS()
        elif config['webdriver']['type'] == 'chrome':
            self._driver = webdriver.Chrome()
        else:
            raise TestError("unimplemented webdriver type",
                            config['webdriver']['type'])

    def tearDown(self):
        self._process.terminate()
        self._driver.quit()

    @property
    def app_url(self):
        return 'http://localhost:' + str(PORT)

    @property
    def driver(self):
        return self._driver

    def url(self, str_url_path):
        """navigate to given url path"""
        self.driver.get(self.app_url + str_url_path)

    def click(self, css_sel):
        """click on an element"""
        wd_el = self.driver.find_element_by_css_selector(css_sel)
        wd_el.click()

    def input(self, css_sel, str_input):
        """fill in an input element"""
        wd_el = self.driver.find_element_by_css_selector(css_sel)
        wd_el.clear()
        wd_el.send_keys(str_input)

    def get_html(self):
        return self.driver.page_source
        # return self.driver.find_element_by_tag_name(
        #     'html').get_attribute('innerHTML')
