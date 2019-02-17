#!/usr/bin/env python3.7 -u

import sys
import http.client
import json
import time
import collections

if len(sys.argv) != 2:
    print("ERROR: Please provide an API key")
    print("Usage: python3 script.py <API_KEY>")
    sys.exit()

api_key = sys.argv[1]
# api_key = "904f49b66d14969edcaeea279935d85e"

# ------------------------------------------------------------------
#    Question 1
# ------------------------------------------------------------------

start_time = time.time()


# Create a connection
conn = http.client.HTTPSConnection("api.themoviedb.org")
conn.connect()

request_start_time = time.time()
requests_counter = 0


def make_request(method, url):
    conn.close()
    # global requests_counter, request_start_time
    # if not requests_counter:
    #     request_start_time = time.time()
    #
    # if requests_counter == 39:
    #     while time.time() - request_start_time < 10:
    #         print("sleeping for {}".format(url))
    #         time.sleep(1)
    # request_start_time = time.time()
    # if requests_counter == 40:
    #     if time.time() - request_start_time < 10:
    #         print("Sleeping for {} seconds".format(str(10 - (time.time() - request_start_time))))
    #         # time.sleep(10 - (time.time() - request_start_time))
    #         time.sleep(10)
    #         requests_counter = 0
    #         request_start_time = time.time()
    while True:
        conn.request(method=method, url=url)
        # requests_counter += 1
        resp = conn.getresponse()
        if resp.status == 429:
            time.sleep(0.1)
            conn.close()
            continue
        return resp


# Find the genre_id of Drama genre
find_genre_start = time.time()
resp = make_request("GET", "/3/genre/movie/list?api_key={}".format(api_key))
resp = json.loads(resp.read())

genre_id = 0
for genre in resp['genres']:
    if genre['name'].lower() == "drama":
        genre_id = str(genre['id'])

if not genre_id:
    print("ERROR: genre_id not found.. exiting")
    sys.exit()
# print("Finding genre took {} seconds".format(time.time() - find_genre_start))

results = collections.OrderedDict()

# Question 1 (a)
# page counter
page = 1
count_350 = 350
while len(results) < count_350:
    resp = make_request("GET", "/3/discover/movie?api_key={}&?with_genres={}&primary_release_date.gte=2004-01-01&page={}".format(api_key, genre_id, str(page)))
    if resp.status != 200:
        print("ERROR: We didn't get HTTP 200 response, so something happened. Exiting now....")
        sys.exit()
    resp = json.loads(resp.read())
    for movie in resp['results']:
        if len(results) < count_350:
            results[movie['id']] = movie['original_title']
    page += 1

with open("movie_ID_name.csv", "w", encoding='utf-8') as f:
    for k, v in results.items():
        f.write("{},{}\n".format(k, v))

results = collections.OrderedDict(sorted(results.items()))

# Question 1 (c)
similars = collections.OrderedDict()

for movie_id in results:
    # count the number of similar movies retrieved
    this_movie_sim_count = 1

    # this list will have the 5 ids of movies similar to "movie"
    this_movie_similars = []
    # print("Getting 5 similar movies for movie id: {}".format(movie_id))
    this_movie_5_start = time.time()

    # flag to use when this "movie" has 0 similar results
    zero_similars = False
    # First get the 5 similar movies for "movie"
    while this_movie_sim_count < 5:
        page = 1
        resp = make_request("GET", "/3/movie/{}/similar?api_key={}&page={}".format(movie_id, api_key, str(page)))
        if resp.status != 200:
            print("ERROR: We didn't get HTTP 200 response, so something happened. Exiting now....")
            print(resp.status)
            sys.exit()
        resp = json.loads(resp.read())
        if not resp["total_results"]:
            zero_similars = True
            break

        for res_movie in resp["results"]:
            if this_movie_sim_count < 5:
                this_movie_similars.append(res_movie["id"])
                this_movie_sim_count += 1
        page += 1
    if zero_similars:
        # print("{} has no similar movies".format(movie_id))
        continue
    else:
        similars[movie_id] = this_movie_similars
    # print("{} movie took {} seconds for 5 movies".format(movie_id, (time.time() - this_movie_5_start)))

# print(">>>>>>>>>>>>>>>>")
# print(similars)
# print("---------------")

for each_movie in similars:
    for similar_to_given_movie in similars[each_movie]:
        if similar_to_given_movie in similars and each_movie in similars[similar_to_given_movie]:
            if similar_to_given_movie < each_movie:
                similars[each_movie].remove(similar_to_given_movie)


# print("final similars:")
# print(similars)
with open("movie_ID_sim_movie_ID.csv", "w") as f:
    for k, v in similars.items():
        for each_movie in v:
            if k < each_movie:
                f.write("{},{}\n".format(k, each_movie))
            else:
                f.write("{},{}\n".format(each_movie, k))


print("Total time taken: {}".format(time.time() - start_time))


