#!/usr/local/bin/python3

from __future__ import division, absolute_import, print_function
from graph_tool.all import *
import sys
if sys.version_info < (3,):
    range = xrange
from pylab import *  # for plotting

def clusterCoponent():
	g = load_graph("my_graph.xml.gz")
	g_list = label_components(g, attractors=True)
	componenets = g_list[0].a
	remove_list = []
	#print(componenets[0])
	for i in range(203181):
		print(i, g.vp.id[i], componenets[i])
		if componenets[i] != 0:
			#print("%s removed" % g.vp.id[i])
			remove_list.append(i)
	for v in reversed(sorted(remove_list)):
		g.remove_vertex(v)
	# pos = sfdp_layout(g)
	# graph_draw(g, pos, output_size = (1000, 1000), vertex_size=1, edge_pen_width=1.2,vcamp=matplotlib.cm.gist_heat_r, output="clean_songs.png")				
	# g_list = label_components(g, attractors=True)
	# for v in g_list[0].a:
	# 	print(v)
	# 	if v != 0:
	# 		print(v)
	#g.save("my_graph_cleaned.xml.gz")
	# for element in g_list[0].a:
	# 	print(element)
def main():
	clusterCoponent()

if __name__ == "__main__":
	main()

