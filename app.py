import re
import pickle
from collections import defaultdict
from flask import Flask, render_template, request
import requests
import nltk
from nltk.corpus import stopwords
from nltk.stem import SnowballStemmer

import os

CACHE_FILE = 'reverse_index_cache.pkl'

# Check if the cache file exists
if os.path.exists(CACHE_FILE):
    print(f"Cache file '{CACHE_FILE}' exists.")
else:
    print(f"Cache file '{CACHE_FILE}' does not exist.")
    
# Initialize Flask app
app = Flask(__name__)



nltk.download('stopwords', quiet=True)
nltk.download('punkt', quiet=True)

# Initialize stop words and stemmer
stop_words = set(stopwords.words('english'))
stemmer = SnowballStemmer('english')


CACHE_FILE = 'reverse_index_cache.pkl'

def load_reverse_index(cache_file):
    try:
        with open(cache_file, 'rb') as cache:
            cached_data = pickle.load(cache)
            if isinstance(cached_data, tuple) and len(cached_data) == 2:
                reverse_index, documents = cached_data
                print("Loaded reverse index from cache.")
                return reverse_index, documents
            else:
                raise ValueError("Cache file format is incorrect.")
    except (FileNotFoundError, EOFError, pickle.UnpicklingError):
        raise RuntimeError("Cache file not found or corrupted.")

reverse_index, documents = load_reverse_index(CACHE_FILE)

def tokenize_filter_and_stem(text):
    # Tokenize and convert to lowercase
    tokens = re.findall(r'\b\w+\b', text.lower())
    
    # Remove stop words
    filtered_tokens = [token for token in tokens if token not in stop_words]
    
    # Apply stemming
    stemmed_tokens = [stemmer.stem(token) for token in filtered_tokens]
    
    return stemmed_tokens

def search_reverse_index(query, top_n=5):
    query_tokens = tokenize_filter_and_stem(query)
    
    if not query_tokens:
        return []

    link_match_count = defaultdict(int)

    for token in query_tokens:
        if token in reverse_index:
            for link in reverse_index[token]:
                link_match_count[link] += 1
    
    sorted_links = sorted(link_match_count.items(), key=lambda x: x[1], reverse=True)
    
    
    cricbuzz_keywords = ['cricbuzz', 'cricket', 'bat', 'ball', 'stump', 'out', 'ind', 'pak', 'aus', 'v/s' , 'world' ,'cup']
    w3schools_keywords = ['w3schools', 'tutorial', 'html', 'css', 'javascript', 'python', 'sql']
    
    prioritized_results = []
    other_results = []
    
    for link, score in sorted_links:
        result = next((doc for doc in documents if doc['url'] == link), None)
        if result:
            
            result_dict = {
                'url': result['url'],  # URL of the result
                'title': result['title']  # Title of the result
            }
            if any(keyword in query.lower() for keyword in cricbuzz_keywords) and 'cricbuzz.com' in link.lower():
                prioritized_results.insert(0, result_dict)
            elif any(keyword in query.lower() for keyword in w3schools_keywords) and 'w3schools.com' in link.lower():
                prioritized_results.insert(0, result_dict)
            else:
                other_results.append(result_dict)
    
    final_results = (prioritized_results + other_results)[:top_n]
    return final_results
from googleapiclient.discovery import build

# Wikipedia API search function (unchanged)
def search_wikipedia(query):
    url = 'https://en.wikipedia.org/w/api.php'
    params = {
        'action': 'query',
        'list': 'search',
        'srsearch': query,
        'format': 'json',
        'origin': '*'
    }
    
    response = requests.get(url, params=params)
    data = response.json()
    
    results = []
    if 'query' in data and 'search' in data['query']:
        for item in data['query']['search'][:3]:  # Limit to top 3 results
            title = item['title']
            link = f'https://en.wikipedia.org/wiki/{title.replace(" ", "_")}'
            results.append({'title': title, 'link': link})
    
    return results


def search_stackoverflow(query):
    service = build("customsearch", "v1", developerKey=Auth_Key)
    res = service.cse().list(q=query + " site:stackoverflow.com", cx=Session_key, num=3).execute()
    
    results = []
    if 'items' in res:
        for item in res['items']:
            results.append({'title': item['title'], 'link': item['link']})
    
    return results

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # Extract the search term from the form
        search_term = request.form.get('search')
        
        # Perform search logic (Wikipedia, StackOverflow, reverse index)
        wiki_results = search_wikipedia(search_term)
        stackoverflow_results = search_stackoverflow(search_term)
        custom_search_results = search_reverse_index(search_term)

        # Render the 'results.html' template with the search results
        return render_template(
            'results.html',  
            wiki_results=wiki_results,
            stackoverflow_results=stackoverflow_results,
            custom_search_results=custom_search_results,
            search_term=search_term
        )
    
    
    return render_template('index.html')  
@app.route('/about')
def about():
    return render_template('about.html')

if __name__ == '__main__':
    
    Auth_Key = "Key here"
    Session_key = "Key here"
    app.run(debug=True)