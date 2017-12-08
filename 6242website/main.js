function SongInfo(name, artist) {
    this.song = name;
    this.singer = artist;
}

function search_song(name,id){
	$("#"+id).html("<select id=\"source_in\"></select>");
	$.get("search.php?name="+name, function(data){
		if(data == "-Select-"){
			$("#"+id).append("<option value=\"<SPE>\">No result!</option>")
		}else{
			array = data.split("^");
			array.forEach(function(line){
				temp = line.split("<SPE>");
				$("#"+id).append("<option value="+ temp[1] +">"+ temp[0] +"</option>")
			})
		}
	})
}

function retrievePath(source,target){
	var data_delimeter = "^";
	var attribute_delimeter = "--";
	if(source == null || source == "null"){
		alert("Please select source.");
		return;
	}
	str = "source="+source+"&target="+target;
	$.get("index.php?"+str, function(data){
		var array = data.split(data_delimeter);
		var songinfo = [];
		d3.select("#mainButton").attr("value", "Loading")
		for(i=0; i<array.length; i++){
			parts = array[i].split(attribute_delimeter);
			songinfo.push(new SongInfo(parts[0], parts[1]));
		}
		updateData(songinfo);
	})
}

var margin = {top: 30, right: 20, bottom: 30, left: 30},
    width = 1200 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

var y_position = 200
var mainCircleRadius = 150

var pathNodes = [
 	{"song" : "Rise", "singer": "Katy Perry" },
 	{"song" : "It's A Hard Life", "singer": "Queen"},
 	{"song" : "Road To Joy", "singer": "Bright Eyes" },
 	{"song" : "Road To Joy", "singer": "Bright Eyes" },
 	{"song" : "Road To Joy", "singer": "Bright Eyes" },
 	{"song" : "Road To Joy", "singer": "Bright Eyes" }];

var similarNodes = [[
 	{"song" : "Skyscraper", "singer": "Demi Lovato" },
 	{"song" : "The Climb", "singer": "Miley Cyrus"},
 	{"song" : "Gold Steps", "singer": "Neck Deep" },
 	{"song" : "Defying Gravity", "singer": "Idina Menzel"},
 	{"song" : "Save Myself", "singer": "Ed Sheeran"}
 	],
 	[
 	{"song" : "Skyscraper", "singer": "Demi Lovato" },
 	{"song" : "The Climb", "singer": "Miley Cyrus"},
 	],
 	[
 	{"song" : "Defying Gravity", "singer": "Idina Menzel"},
 	{"song" : "Save Myself", "singer": "Ed Sheeran"}
 	],
 	[],
 	[
 	{"song" : "Skyscraper", "singer": "Demi Lovato" },
 	{"song" : "The Climb", "singer": "Miley Cyrus"},
 	{"song" : "Gold Steps", "singer": "Neck Deep" },
 	],
 	[]];

pathNodeStart = 100
pathNodeEnd = 1000
pathTranstionTime = 750

pathnodeSpace = (pathNodeEnd-pathNodeStart)/(pathNodes.length+1)
pathNodeRadius = 0.7*pathnodeSpace/2
similarNodeRadius = 0.6*pathNodeRadius

// ["#EBEEAF", "#FE7BBA"]
function startPage() {
	var mainCircleColors = ["#EBEEAF", "#FE7BBA"]
	f=d3.interpolateHsl(mainCircleColors[0], mainCircleColors[1])
	var svg = d3.select("body").select("#viz")
	    .append("svg")
	        .attr("width", width + margin.left + margin.right)
	        .attr("height", height + margin.top + margin.bottom);

	createNode(svg, margin.left + 300, margin.top + y_position, mainCircleRadius, mainCircleColors[0], "mainCircleContainer1", "mainCircle1");
	d3.select("#mainCircleContainer1")
	addNodeLabel("#mainCircleContainer1", "Got something you really like?", "");
	createNode(svg, margin.left + 800, margin.top + y_position, mainCircleRadius, mainCircleColors[1], "mainCircleContainer2", "mainCircle2");
	addNodeLabel("#mainCircleContainer2", "We'll find something you don't like!", "");
}

function createNode(parent, x, y, radius, color, containerId, circleClass, containerClass = "container", make_hidden_circle = false) {
	var mainCircle1 = parent.append("g").attr("transform", "translate(" + x + "," + y + ")")
						.attr("id", containerId).attr("class", containerClass)
	if (make_hidden_circle) {
	mainCircle1.append("circle")
              .attr("r", pathNodeRadius+2*similarNodeRadius)
              .attr("class", "pathCircle_hidden")
              .attr('fill-opacity', 0);
    }
	mainCircle1.append("circle")
                  .attr("r", radius)
                  .attr("class", circleClass)
                  .style("fill", color);
}

function addNodeLabel(containerId, song, singer, fontsize = 15) {
	d3.select(containerId).selectAll("text").remove();
	var container = d3.select(containerId);
	container.append("text")
			.attr("font-size",fontsize + "px")
			.attr("dy", function(d){return -5})
			.attr("text-anchor", "middle")
			.text(function(d) {return song})
			.style("pointer-events", "none");

	container.append("text")
			.attr("font-size",fontsize + "px")
			.attr("dy", function(d){return +15})
			.attr("text-anchor", "middle")
			.text(function(d) {return singer})
			.style("pointer-events", "none");
}

function updateData(path) {
	mainCircles = [path[0], path[path.length-1]];
	nNodePlacement = 6;

	var nPathNodes = path.length-2;
	if(nPathNodes > nNodePlacement){
		pathNodes = []
		similarNodes = []
		nSmallCircles = (nPathNodes-nNodePlacement)/nNodePlacement;
		var index = 1;
		for(i=0;i<nNodePlacement;i++){
			if(index >= path.length) break;
			pathNodes.push(path[index++]);
			curSimNodes = []
			for(j=0;j<nSmallCircles;j++){
				if(index >= path.length) break;
				curSimNodes.push(path[index++]);
			}
			similarNodes.push(curSimNodes);
		}
		console.log(pathNodes);
		console.log(similarNodes);
	} else {
		pathNodes = path.slice(1,path.length-1);
		similarNodes = []
	}
	pathNodesColors = []
	var nColors=pathNodes.length;
	for (var i=0; i<nColors; i++) {pathNodesColors.push(f(i/(nColors-1)))};
	similarNodesColor = f(Math.random()*nColors/nColors)
    for (i = 0; i < pathNodes.length; i++) {
		createNode(d3.select("body").select("#viz").select('svg'), margin.left + pathNodeStart + (i+1)*pathnodeSpace, margin.top + y_position, 0, pathNodesColors[i], "pathCircleContainer" + i, "pathCircle", "container", true)
		d3.select("#pathCircleContainer" + i).selectAll(".pathCircle")
	        .on('mouseover', function () {
	        	removeSimilar()
	        	var nodeId = parseInt(this.parentNode.id.substr(this.parentNode.id.length - 1));
	        	addSimilar("#" + this.parentNode.id, "similarContainer", nodeId, similarNodes);
	        	d3.select("body").select("#viz").select('svg').selectAll(".similarNode").style("pointer-events", "none");
	        })
	    d3.select("#pathCircleContainer" + i).selectAll(".pathCircle_hidden").on('mouseout', function() {
	    	removeSimilar()})
	}

    d3.select("#mainButton")
        .attr("value", "Back")
        .attr("onclick", "backToHome()");
    addNodeLabel("#mainCircleContainer1", mainCircles[0].song, mainCircles[0].singer)
    addNodeLabel("#mainCircleContainer2", mainCircles[1].song, mainCircles[1].singer)
    var svg = d3.select("body").transition();

    svg.select(".mainCircle1")
        .duration(pathTranstionTime)
        .attr("r", pathNodeRadius);

            svg.select("#mainCircleContainer1")
        .duration(pathTranstionTime)
		.attr("transform", "translate(" + (margin.left + pathNodeStart) + "," + (margin.top + y_position) + ")");

	svg.select(".mainCircle2")
        .duration(pathTranstionTime)
        .attr("r", pathNodeRadius);

            svg.select("#mainCircleContainer2")
        .duration(pathTranstionTime)
		.attr("transform", "translate(" + (margin.left + pathNodeEnd) + "," + (margin.top + y_position) + ")");

	svg.selectAll(".pathCircle")
            .duration(pathTranstionTime)
            .attr("r", pathNodeRadius);
	for (i = 0; i < pathNodes.length; i++) {
        addNodeLabel("#pathCircleContainer" + i, pathNodes[i].song, pathNodes[i].singer)
        }
}


function addSimilar(parentId, containerId, nodeId, similarNodes) {

	var totalRadius = pathNodeRadius + similarNodeRadius
 	var similar_songs = similarNodes[nodeId]
 	var bucket = [];

	for (var i=0; i<similar_songs.length; i++) {
	    bucket.push(i);
	}

	function getRandomFromBucket() {
	   var randomIndex = Math.floor(Math.random()*bucket.length);
	   return bucket.splice(randomIndex, 1)[0];
	}

 	for (i = 0; i < similar_songs.length; i++) {
 		var offset = Math.random()*2-1
 		var degree = (360/similar_songs.length*getRandomFromBucket() + offset*360/similar_songs.length/(2*similar_songs.length))*Math.PI/180
 		createNode(d3.select(parentId),totalRadius*Math.cos(degree), totalRadius*Math.sin(degree), 0, similarNodesColor, "similarContainer" + i, "similarNode", containerClass = "similarContainer")
		addNodeLabel("#similarContainer" + i, similar_songs[i].song, similar_songs[i].singer, fontsize = 10);
 	}

    var svg = d3.select("body").transition();
    	svg.selectAll(".similarNode")
    		.duration(250)
    		.attr("r", similarNodeRadius)
}


function removeSimilar() {
   	d3.selectAll(".similarContainer").remove()
}

function backToHome() {
	d3.select("body").select("#viz").selectAll("*").remove();
	d3.select("#mainButton")
        .attr("value", "Go")
        .attr("onclick", "updateData()");
	startPage()
}

function getColor(){
  r = Math.random()*155 + 100
  g = Math.random()*155 + 100
  b = Math.random()*155 + 100
  return 'rgb(' + r + ',' + g + ',' + b + ')'
}

startPage()