""" test search page """
import time
import unittest

from bs4 import BeautifulSoup as BSoup

from .base import BaseTestCase

# seconds
TIMEOUT_PAGE_LOAD = 3
TIMEOUT_SEARCH = 5

class SearchMixin(object):
    """
    page-specific functionality
    could be considered a page-object pattern
    http://martinfowler.com/bliki/PageObject.html
    """

    def click_search(self):
        self.click('form button')

    def input_zip(self, str_zip):
        self.input('form input', str_zip)

    @property
    def search_results_zip(self):
        soup = BSoup(self.get_html(), 'html.parser')
        header = soup.find('h3')
        if header is None:
            return None
        header_spans = header.find_all('span')
        if len(header_spans) < 2:
            return None
        return header_spans[1].text

class SearchTests(SearchMixin, BaseTestCase):

    def setUp(self):
        super(SearchTests, self).setUp()
        self.url('')
        time.sleep(TIMEOUT_PAGE_LOAD)

    def test_search(self):
        str_zip = '91801'
        self.input_zip('91801')
        self.click_search()
        time.sleep(TIMEOUT_SEARCH)
        self.assertEqual(self.search_results_zip, str_zip)


if __name__ == '__main__':
    unittest.main()
