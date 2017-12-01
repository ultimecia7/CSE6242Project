function index(source,target){
	str = "source="+source+"&target="+target;
	$.get("index.php?"+str, function(data){
		array = data.split("^");
		array.forEach(function(line){
			$("#output").append("<div>"+line+"</div>")
		})
	})
}