from __future__ import division, absolute_import, print_function
from graph_tool.all import *
import sys
if sys.version_info < (3,):
    range = xrange
from pylab import *  # for plotting

def countDegree():
    g = load_graph("my_graph.xml.gz")

    # Let's plot its in-degree distribution
    in_hist = vertex_hist(g, "total")
    y = in_hist[0]
    figure(figsize=(6, 4))
    plot(in_hist[1][:-1], in_hist[0])

    # Y axis range set to [0, 100]
    # Since there are way more nodes with low degree like 1,2,..
    gca().set_ylim(0, 100)
    xlabel("Degree")
    ylabel("Number of nodes")
    tight_layout()
    savefig("node-deg-dist.pdf")
    savefig("node-deg-dist.svg")

def main():
    countDegree()

if __name__ == "__main__":
    main()