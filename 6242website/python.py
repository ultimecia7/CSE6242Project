import sys
import sqlite3
from search_dijkstra import search_dijkstra

source  = sys.argv[1]
if len(sys.argv) == 3:
	target = sys.argv[2]

path = search_dijkstra(source)

out = []

conn = sqlite3.connect('song.db')

if len(path) < 1:
	print "No Path found"

for s in path:
	sql = "SELECT *  from songs where ID = \""+s+"\""
	cursor = conn.execute(sql)
	data = cursor.fetchall()
	if(len(data) < 1):
		out.append("Song not find");
	else:
		for row in data:
			song_name = row[3]
			song_artist = row[2]
			song_info = (song_name + "--" + song_artist).encode('utf-8').strip()
			out.append(song_info)

print '^'.join(out)