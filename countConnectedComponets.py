file = open("raw.tsv", "r")

songs = set()

for line in file:
    line = line.rstrip()
    parts = line.split("\t")
    songs.add(parts[0])
    songs.add(parts[1])

file.close()

parent = dict()
components = len(songs)

for song in songs:
    parent[song] = song

file = open("raw.tsv", "r")

lineCount = 0
for line in file:
    lineCount += 1
    if(lineCount % 10000 == 0): print(lineCount)
    line = line.rstrip()
    parts = line.split("\t")

    a = parts[0]
    b = parts[1]
    while parent[a] != a: a = parent[a]
    while parent[b] != b: b = parent[b]
    if a != b:
        parent[b] = a
        components -= 1

print(components)
