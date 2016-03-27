""" search by zipcode """
from pdb import set_trace as st

import re

import requests
import bs4
from bs4 import BeautifulSoup as BSoup

def _parse_movie(soup_movie):
    """ parse info for one movie """
    name =  soup_movie.find(class_='name').text
    soups_time_span = soup_movie.find(class_='times').find_all('span')
    strs_time_or_empty = [soup_time_span.text.strip()
                          for soup_time_span in soups_time_span]
    strs_time = [str_time for str_time in strs_time_or_empty
                 if str_time is not '']
    return {
        'name': name,
        'times': strs_time
    }

def _parse_theater(soup_theater):
    """ parse info for one theater """
    name = soup_theater.find('h2').text
    address = soup_theater.find(
        class_='info').text.split('-')[0].strip()
    movies = [_parse_movie(soup_movie) for soup_movie in
              soup_theater.find_all(class_='movie')]
    return {
        'name': name,
        'address': address,
        'movies': movies,
    }

def _parse_results(soup_results):
    """ parse a page of search results """
    return [_parse_theater(soup_theater) for soup_theater in
            soup_results.find_all(class_='theater')]

def _search_h(url_page):
    """ recursive helper function """
    res = requests.get(url_page)
    soup = BSoup(res.text, 'html.parser')
    soup_results = soup.find(class_='movie_results')
    results = _parse_results(soup_results)
    soup_nav = soup.find(id='navbar')
    soup_nav_a_next = soup_nav.find_all('td')[-1].find('a')
    if soup_nav_a_next:
        results += _search_h(
            'http://google.com' + soup_nav_a_next.get('href'))
    return results

def search(zip_code):
    """ synchronous search by zip code """
    if re.match(r'^\d{5}$', zip_code) is None:
        raise ValueError("zipcode strings must be five digits", zip_code)
    return _search_h('http://google.com/movies?near=' + zip_code)
