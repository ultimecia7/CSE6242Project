function SongInfo(name, artist) {
    this.name = name;
    this.artist = artist;
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
var mainCircles = [
 	{ "color" : "#EBEEAF" , "song" : "Bad Blood", "singer": "Taylor Swift"},
 	{ "color" : "#FE7BBA", "song" : "Symphony No. 9", "singer": "Beethoven"}];

var pathNodes = [
 	{"color" : "#A9F1A5", "song" : "Rise", "singer": "Katy Perry" },
 	{"color" : "#9BF4E5", "song" : "It's A Hard Life", "singer": "Queen"},
 	{ "color" : "#90ACF7","song" : "Road To Joy", "singer": "Bright Eyes" },
 	{"color" : "#CE86FA", "song" : "Ode to Joy 1", "singer": "Beethoven"}];

var similarNodes = [
 	{"song" : "Skyscraper", "singer": "Demi Lovato" },
 	{"song" : "The Climb", "singer": "Miley Cyrus"},
 	{"song" : "Gold Steps", "singer": "Neck Deep" },
 	{"song" : "Defying Gravity", "singer": "Idina Menzel"},
 	{"song" : "Save Myself", "singer": "Ed Sheeran"}
 	];

// var input = d3.select("body").select("#input").append('input')
//     .attr('type','text')
//     .attr('name','textInput')
//     .attr('value','Text goes here')
//     .style("padding-top: 50px");

// var input2 = d3.select("body").select("#input").append('input')
//     .attr('type','text')
//     .attr('name','textInput')
//     .attr('value','Text goes here')
//     .style("padding-top: 100px");

var svg = d3.select("body").select("#viz")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

createNode(svg, 300, y_position, mainCircleRadius, mainCircles[0].color, "mainCircleContainer1", "mainCircle1");
d3.select("#mainCircleContainer1")
addNodeLabel("#mainCircleContainer1", "Got something you really like?", "");
createNode(svg, 800, y_position, mainCircleRadius, mainCircles[1].color, "mainCircleContainer2", "mainCircle2");
addNodeLabel("#mainCircleContainer2", "We'll find something you don't like!", "");


for (i = 0; i < pathNodes.length; i++) {
	createNode(svg, 100 + (i+1)*180, y_position, 0, pathNodes[i].color, "pathCircleContainer" + i, "pathCircle");

	d3.select("#pathCircleContainer" + i).selectAll(".pathCircle")
        .on('mouseover', function () {
        	addSimilar("#pathCircleContainer1", "similarContainer");
        	console.log("#pathCircleContainer" + i)
        })
        .on('mouseout', function() {removeSimilar()});
	// var pathContainer = svg.append("g")
	// 						.attr("transform", "translate(" + (margin.left + 100 + (i+1)*180) + "," + (margin.top + 170) + ")")
	// 						.attr("class", "mainCircleContainer" + i)
	// pathContainer.data([pathNodes[i]]).append("circle")
}

function createNode(parent, x, y, radius, color, containerId, circleClass, containerClass = "container") {
	var mainCircle1 = parent.append("g").attr("transform", "translate(" + (margin.left + x) + "," + (margin.top + y) + ")")
						.attr("id", containerId).attr("class", containerClass)

	mainCircle1.append("circle")
                  .attr("r", radius)
                  .attr("class", circleClass)
                  .style("fill", color);
	// mainCircle1.append("text")
	// 		.attr("dy", function(d){return -10})
	// 		.attr("text-anchor", "middle")
	// 		.text(function(d) {return song})

	// mainCircle1.append("text")
	// 		.attr("dy", function(d){return +10})
	// 		.attr("text-anchor", "middle")
	// 		.text(function(d) {return singer})
}

function addNodeLabel(containerId, song, singer, fontsize = 15) {
	console.log(containerId);
	d3.select(containerId).selectAll("text").remove();
	var container = d3.select(containerId);
	container.append("text")
			.attr("font-size",fontsize + "px")
			.attr("dy", function(d){return -5})
			.attr("text-anchor", "middle")
			.text(function(d) {return song});

	container.append("text")
			.attr("font-size",fontsize + "px")
			.attr("dy", function(d){return +15})
			.attr("text-anchor", "middle")
			.text(function(d) {return singer});
}

function updateData(path) {
	sourceSong = path[0];
	targetSong = path[path.length-1];
    // Select the section we want to apply our changes to
    d3.select("#mainButton") 
            // .duration(750)
        .attr("value", "Back");
    addNodeLabel("#mainCircleContainer1", sourceSong.name, sourceSong.artist);
    addNodeLabel("#mainCircleContainer2", targetSong.name, targetSong.artist);
    var svg = d3.select("body").transition();

    // // Make the changes
        svg.select(".mainCircle1")   // change the line
            .duration(750)
            .attr("r", 60);

                svg.select("#mainCircleContainer1")   // change the line
            .duration(750)
			.attr("transform", "translate(" + (margin.left + 100) + "," + (margin.top + y_position) + ")");

		svg.select(".mainCircle2")   // change the line
            .duration(750)
            .attr("r", 60);

                svg.select("#mainCircleContainer2")   // change the line
            .duration(750)
			.attr("transform", "translate(" + (margin.left + 1000) + "," + (margin.top + y_position) + ")");

		svg.selectAll(".pathCircle")   // change the line
	            .duration(750)
	            .attr("r", 60);

		var count = 0;
		for (i = 1; i < path.length-1; i++) {
	        addNodeLabel("#pathCircleContainer" + (i-1), path[i].name, path[i].artist);
			if(++count == pathNodes.length) break;
		}


	// createNode(d3.select("#pathCircleContainer1"), 20, 20, 10, 'red', "similarContainer1", "similarNode")

        // svg.select(".mainCircle2")   // change the line
        //     .duration(750)
        //     .attr("cx", 1000)
        //     .attr("cy", 170)
        //     .attr("r", 60);



        // d3.selectAll(".pathCircle")
        // .on('mouseover', function () { addSimilar(d3.select(this.parentNode), "similarContainer") })
        // .on('mouseout', function() {removeSimilar()})

}


function addSimilar(parentId, containerId) {
	// var pathCircles = similarGroup.append("circle")
 //          .attr("cx", node.x_axis + 20)
 //          .attr("cy", node.y_axis + 50)
 //          .attr("r", 0)
 //          .attr("class", "similarNode")
 //          .style("fill", 'red');
	// createNode(d3.select(parentId), 20, 20, 10, 'red', containerId, "similarNode")
	createNode(d3.select(parentId), 40, 40, 0, '#33cccc', "similarContainer1", "similarNode", containerClass = "similarContainer")
	addNodeLabel("#similarContainer1", similarNodes[0].song, similarNodes[0].singer, fontsize = 10);
	createNode(d3.select(parentId), -70, 65, 0, '#33cccc', "similarContainer2", "similarNode", containerClass = "similarContainer")
	addNodeLabel("#similarContainer2", similarNodes[1].song, similarNodes[1].singer, fontsize = 10);
	createNode(d3.select(parentId), 60, -70, 0, '#33cccc', "similarContainer3", "similarNode", containerClass = "similarContainer")
	addNodeLabel("#similarContainer3", similarNodes[2].song, similarNodes[2].singer, fontsize = 10);
	createNode(d3.select(parentId), -30, -130, 0, '#33cccc', "similarContainer4", "similarNode", containerClass = "similarContainer")
	addNodeLabel("#similarContainer4", similarNodes[3].song, similarNodes[3].singer, fontsize = 10);
	createNode(d3.select(parentId), -120, -80, 0, '#33cccc', "similarContainer5", "similarNode", containerClass = "similarContainer")
	addNodeLabel("#similarContainer5", similarNodes[4].song, similarNodes[4].singer, fontsize = 10);

    var svg = d3.select("body").transition();
    	svg.selectAll(".similarNode")
    		.duration(750)
    		.attr("r", 35)

}


function removeSimilar() {
    // var svg = d3.select("body").transition();

    // svg.selectAll(".similarNode")
    // 	.attr("r", 0)

   	d3.selectAll(".similarContainer").remove()

}