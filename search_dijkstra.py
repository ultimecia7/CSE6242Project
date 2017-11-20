from __future__ import division, absolute_import, print_function
from graph_tool.all import *
from graph_tool.search import *
import sys
import numpy as np
import math
import operator
if sys.version_info < (3,):
    range = xrange
import os
from pylab import *  # for plotting

def search_dijkstra(track_id):
    g = load_graph("my_graph.xml.gz")

    # Find the vertex with track_id
    for v in g.vertices():
        if g.vp.id[v] == track_id:
            source = v
            break

    if source == None:
        print("Track not found")
        return

    # Do Dijkstra search from the node
    # Documentation: https://graph-tool.skewed.de/static/doc/search_module.html#graph_tool.search.dijkstra_search
    result_tuple = dijkstra_search(g, g.ep.similarity, source)

    dist_map = result_tuple[0].a
    pred_map = result_tuple[1].a

    # Destination nodes with infinite values
    # !!! Not sure why count of these nodes are only 647
    count = 0
    for i in range(0, len(dist_map)):
        if dist_map[i] == float("inf"):
            count += 1
            dist_map[i] = 0
    print(count)

    index, value = max(enumerate(dist_map), key=operator.itemgetter(1))

    print("Printing out path:")
    cur = index
    while cur != source:
        print(cur)
        cur = pred_map[cur]

    print("Finished")


def main():
    search_dijkstra("TRAAAAW128F429D538")

if __name__ == "__main__":
    main()