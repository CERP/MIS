import csv
import os
import requests

import config

session = requests.Session()
session.auth = (config.username, config.password)

def get_data(module):

	url = "https://mis-socket.metal.fish/analytics/" + module + ".csv"
	res = session.get(url)

	decoded = res.content.decode('utf-8')
	parsed = list(csv.DictReader(decoded.splitlines(), delimiter=","))

	return parsed


attendance = get_data('attendance')

print(attendance)