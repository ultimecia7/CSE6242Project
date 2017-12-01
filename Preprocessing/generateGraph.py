from __future__ import division, absolute_import, print_function
from graph_tool.all import *
import sys
if sys.version_info < (3,):
    range = xrange

def generateGraph():
    ug = Graph()
    ug.set_directed(False)

    # vertex property map : id
    # store track id into each node
    v_id = ug.new_vertex_property("string")

    # edge property map : similarity
    # store 1-similarity into each edge
    e_similarity = ug.new_edge_property("double")

    nodes = dict()

    file = open("raw.tsv", "r")
    count = 0
    for line in file:
        if count % 10000 == 0 : print(count)
        line = line.rstrip()
        parts = line.split("\t")
        id1 = parts[0]
        id2 = parts[1]
        if id1 in nodes:
            v1 = nodes[id1]
        else:
            v1 = ug.add_vertex()
            nodes[id1] = v1

        if id2 in nodes:
            v2 = nodes[id2]
        else:
            v2 = ug.add_vertex()
            nodes[id2] = v2

        v_id[v1] = id1
        v_id[v2] = id2

        e = ug.add_edge(v1, v2)
        e_similarity[e] = 1-float(parts[2])

        count += 1

    ug.vertex_properties["id"] = v_id
    ug.edge_properties["similarity"] = e_similarity
    ug.save("my_graph.xml.gz")
    return

def main():
    generateGraph()

if __name__ == "__main__":
    main()