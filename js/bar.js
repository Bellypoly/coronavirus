class BarChart{
  constructor(chart_type) {
    this.dataset_file_name = "data/cleaned.csv";//"bar-data.csv";
    this.country_name = "United States";//"Australia";
    this.y_axes_text = "Number of " + chart_type + " Cases";//"Number of Confirmed Cases";
    var div_name = "#svg_bar_" + chart_type;
    var svg_tag_name = "svg";
    this.div_name = div_name;
    this.svg_tag_name = svg_tag_name;
    this.chart_type = chart_type
    console.log('this.dataset_file_name', this.dataset_file_name);
  }
  preprocess_data(dataset, country_name, chart_type){
    console.log('dataset', dataset);
    var data = [];
    dataset.forEach(function(d) {
      if (d.country == country_name){
        console.log('#########^^^####this.chart_type', chart_type);
        data.push({"updated": d.updated, "value": d[chart_type]});
      }
    });
    var	parseDate = d3.timeParse("%m/%d/%y");

    // data.forEach(function(d) {
    //   d.updated = parseDate(d.updated);
    //   d.confirmed = +d.confirmed;
    //   d.suspected = +d.suspected;
    //   d.recovered = +d.recovered;
    //   d.deaths = +d.deaths;
    //
    // });
    // data = groupByArrayJson(data, ["updated",  "confirmed"]);
    data = groupByArrayJson(data, ["updated",  "value"]);
    data.forEach(function(d) {
      d.updated = parseDate(d.date);
      // d.confirmed = +d.value;
      d.value = +d.value;
      // d.suspected = +d.suspected;
      // d.recovered = +d.recovered;
      // d.deaths = +d.deaths;

    });
    console.log('###before parsing data', data, 'chart_type', chart_type);
    // data.forEach(function(d) {
    //     d.date = parseDate(d.date);
    //     d.value = +d.value;
    // });


    console.log('###after parsing data', data);

    return data;
  }
  render(p_country_name){
    this.country_name = p_country_name || this.country_name;
    var dataset_file_name = this.dataset_file_name;
    var country_name = this.country_name;
    var y_axes_text = this.y_axes_text;
    var div_name = this.div_name;
    var svg_tag_name = this.svg_tag_name;
    var chart_type = this.chart_type;
    console.log('#########this.chart_type', chart_type);


    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 400 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleBand()
              .range([0, width])
              .padding(0.1);
    var y = d3.scaleLinear()
              .range([height, 0]);


    var xAxis = d3.axisBottom()
        .scale(x)
        // .orient("bottom")
        .ticks(d3.timeMonth)
        // .ticks(d3.timeDay, 2 )
        .tickFormat(d3.timeFormat("%d/%m"))//;// format the x axis
        ;



    var svg_id = d3.select(div_name).select(svg_tag_name);
    if (svg_id){//delete current chart
      svg_id.remove();
    }
    var svg = d3.select(div_name).append(svg_tag_name)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
    console.log('##svg created');
    var preprocess_data = this.preprocess_data;
    // get the data
    // d3.csv("../data/cleaned.csv", function(error, data) {
    d3.csv("data/cleaned.csv", function(error, data) {
        if (error) throw error;
        console.log('##data, before:', data);
        data = preprocess_data(data, country_name, chart_type);

      console.log('##data:', data);
      x.domain(data.map(function(d) { return d.updated; }));
      y.domain([0, d3.max(data, function(d) { return d.value; })]);

      svg.selectAll(".bar")
          .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.updated); })
          .attr("width", x.bandwidth())
          .attr("y", function(d) { return y(0); })
          .attr("height", function(d) { return height - y(0); });

          // Animation
          svg.selectAll("rect")
            .transition()
            .duration(800)
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); })
            .delay(function(d,i){return(i*20)});

      // The x-axis
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
                  
          .selectAll("text")
          .attr("y", 0)
          .attr("x", 9)
          .attr("dy", ".20em")
          .attr("transform", "rotate(65)")
          .style("text-anchor", "start");          

      // The y-axis
      svg.append("g")
          .call(d3.axisLeft(y));

      //stop loading spin
      document.getElementById("loading").remove();

    });
  };
};

console.log("Hashim - It's loaded!")
// var div_name = "#svg_bar";
// var svg_tag_name = "svg";
myBarChart_confirmed = new BarChart("confirmed");
// c = "China";
// myBarChart_confirmed.render(c);

c = "World";//"United States";
$("#bar_title").text(c);
myBarChart_confirmed.render(c);

myBarChart_recovered = new BarChart("recovered");
myBarChart_recovered.render(c);
//deaths
myBarChart_recovered = new BarChart("deaths");
myBarChart_recovered.render(c);

