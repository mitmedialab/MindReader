var svg = d3.select("#game1")
	.append("svg")
	.append("g")


svg.append("g")
	.attr("class", "slices");

var width = 320,
    height = 320,
		radius = Math.min(width, height) / 2;

var pie = d3.layout.pie()
	.sort(null)
	.value(function(d) {
		return d.value;
	});

var arc = d3.svg.arc()
	.outerRadius(radius * 0.8)
	.innerRadius(radius * 0.)
  .startAngle(function(d) { return d.startAngle + Math.PI; })
  .endAngle(function(d) { return d.endAngle + Math.PI; });

svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var key = function(d){ return d.data.label; };

var color = d3.scale.ordinal()
	.domain(["Bot: ", "", "You: "])
	.range(["#DC3912", "#FFFFFF", "#3366CC"]);

var scores=[
  	{label:"Bot: ", value:0},
  	{label:"", value:0},
  	{label:"You: ", value:0}
  ];





svg.append("text")
	.text("Bot: " + String(scores[0].value-1))
	.attr("id","botText")
	.attr("y",radius*0.9)
	.attr("x",-radius*0.2)
	.attr("text-anchor", "end");

svg.append("text")
	.text("You: " + String(scores[2].value-1))
	.attr("id","youText")
	.attr("y",radius*0.9)
	.attr("x",radius*0.2)
	.attr("text-anchor", "start");

svg.append("text")
	.text("Time left: ")
	.attr("id","timeText")
	.attr("y",-radius*0.9)
	.attr("x",0)
	.attr("text-anchor", "middle");

svg.append("text")
	.text("")
	.attr("id","winText")
	.attr("y",0)
	.attr("x",0)
	.attr("text-anchor", "middle")
	.attr("font-size",50);









function updateGraphics() {
	scores[0].value = machineScore+1;
	scores[2].value = userScore+1;
	scores[1].value = numberOfGameTurns - userScore - machineScore;

	var slice = svg.select(".slices").selectAll("path.slice")
		.data(pie(scores), key);

	slice.enter()
		.insert("path")
		.style("fill", function(d) { return color(d.data.label); })
		.attr("class", "slice");

	slice
		.transition().duration(100)
		.attrTween("d", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				return arc(interpolate(t));
			};
		})

	slice.exit()
		.remove();


	botText.textContent = "Bot: " + String(scores[0].value-1);
	youText.textContent = "You: " + String(scores[2].value-1);
	timeText.textContent = "Time left: " + String(timeLeft);


	if (waitForRestart==1) {
		winText.textContent = "You Won!";
  }
  else if (waitForRestart==2) {
		winText.textContent = "You Lost!";
  }
	else {
		winText.textContent = "";
	}


};
