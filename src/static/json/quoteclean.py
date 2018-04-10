#!/bin/python3

import json
import sys
import re

# Preparing args
args = sys.argv
del args[0]
length = len(args)

# Looping
json_pattern = re.compile(r"\.json$")
for filename in args:
	if json_pattern.search(filename):
		data = json.load(open(filename))

		delete_list = []
		
		# Looping through quotes of file
		for index, quoteObject in enumerate(data):
			# Looping through other quotes for duplicate
			for newindex, newquoteObject in enumerate(data):
				if newindex > index:
					if newquoteObject["quote"] == quoteObject["quote"]:
						if newindex not in delete_list:
							delete_list.append(newindex)

		for deleteme in sorted(delete_list, reverse=True):
			del data[deleteme]

		print("[", filename, "] ", "Found and deleted ", len(delete_list), " duplicates")

		with open(filename, 'w') as outfile:
			json.dump(data, outfile)
