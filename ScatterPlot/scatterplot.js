//Define Graph setting
var heightGraph = 400;

//Create  Variables 
var counterClick = 0;
var counterColors = 0;
var counter_country_swipeLike = 0;
var counter_country_swipePass = 0;
var counter_country_messagesSent = 0;
var counter_country_messagesReceived = 0;
var counter_country_appOpens = 0;
var selection_date = "Kein";
let mappingColorUser = {};
var isClickedOnTimeline = false;

//Set Possibilities
let dates = ["2020-01-01", "2019-12-31", "2021-01-01", "2022-01-01"]
let userColors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000'];


//Set Selections
var selectedCountry = "Belgium";
var selectedDate = "2020-01-01";
var name_file = "allUsers_ByDate";

var formatDateIntoMonth = d3.timeFormat("%m/%y");
var formatDate = d3.timeFormat("%b %d %Y");

var formatDateForData = d3.timeFormat("%Y-%m-%d");
var parseDate = d3.timeParse("%m/%d/%y");
var scatterPlotOpen = false;
let uniqueListOfCountries = [];

var margin = { top: 50, right: 50, bottom: 50, left: 20 }, height = 1600;

const width = 1600;

//Load Data
d3.json("../docs/data/" + name_file + ".json", d => {
}).then(data => {
  //Calculate the stats of that country on that date
  //TODO: Whole time
  //Filter the data by country and Date
  var filterData = filterData_ByCountry(data, selectedCountry);
  //Create Scatterplot with filtered data
  createScatterPlot(filterData);
  createTimeLine(filterData);

})

//Create SVG
let svg = d3.select("#plotSVG")
  .style("overflow", "visible") // some tooltips stray outside the SVG border
  .append("g")
  .attr("transform", "translate(50,50)")



/**
 * Function to Filter the data from the json file by Country (and date)
 * @param {*} data_array 
 * @param {*} givenCountry 
 * @param {*} givenDate 
 * @returns 
 */
function filterData_ByCountry(data_array, givenCountry) {
  var filtered_data = [{}];
  var counter_newDataArray = 0;
  for (i = 0; i < data_array.length; i++) {
    //Create a new Array with only the data from that country
    if (data_array[i].country == givenCountry) {
      //   if(data_array[i].swipePass==3279)console.log("Yes erkannt")
      //  if (data_array[i].messagesSent > 1) {
      //   if (data_array[i].appOpens > 1) {
      // if (data_array[i].date == givenDate) {
      filtered_data[counter_newDataArray] = data_array[i];
      counter_newDataArray++;
      //   }
      //  }
      //   }
    }
  }
  //  console.log(filtered_data);
  return filtered_data;
}


/**
 * Calculate the stats for country
 * @param {*} data_array 
 * @param {*} givenCountry 
 * @param {*} givenDate 
 */
function calculateStats_ByCountry(data_array, givenCountry, givenDate) {
  counter_country_swipeLike = 0
  counter_country_swipePass = 0
  counter_country_messagesSent = 0
  counter_country_messagesReceived = 0
  counter_country_appOpens = 0;

  for (i = 0; i < data_array.length; i++) {
    if (data_array[i].country == givenCountry) {
      // if (data_array[i].date == givenDate) {
      counter_country_swipeLike = counter_country_swipeLike + data_array[i].swipeLike;
      counter_country_swipePass = counter_country_swipePass + data_array[i].swipePass;
      counter_country_messagesSent = counter_country_messagesSent + data_array[i].messagesSent;
      counter_country_messagesReceived = counter_country_messagesReceived + data_array[i].messagesReceived;
      counter_country_appOpens = counter_country_appOpens + data_array[i].appOpens;


      /*
      counter_countryswipes = counter_countryswipes + data_array[i].swipeLike + data_array[i].swipePass;
      counter_countryconversationCount = counter_countryconversationCount + data_array[i].messagesReceived + data_array[i].messagesSent;
    */   }
    // }
  }

  //Divide By User
  counter_country_swipeLike = Math.ceil(counter_country_swipeLike / Object.keys(mappingColorUser).length);
  /* counter_country_swipePass = counter_country_swipePass + data_array[i].swipePass;
   counter_country_messagesSent = counter_country_messagesSent + data_array[i].messagesSent;
   counter_country_messagesReceived = counter_country_messagesReceived + data_array[i].messagesReceived;
   counter_country_appOpens = counter_country_appOpens + data_array[i].appOpens;
 */

}

/**
 * Add the stats of the selected country to the screen. 
 * @param {*} numberSwipes 
 * @param {*} numberconversationCount 
 */
function editCountryStats() {

  document.getElementById("statsCountryTitle").innerHTML = selectedCountry + " (Per User)";
  if (selection_date != "Kein") document.getElementById("stats-subtitle").innerHTML = "Until " + selection_date;
  document.getElementById("swipeLike").innerHTML = "Likes: " + counter_country_swipeLike;
  document.getElementById("swipePass").innerHTML = "Passes: " + counter_country_swipePass;
  document.getElementById("messagesSent").innerHTML = "Messages Sent: " + counter_country_messagesSent;
  document.getElementById("messagesReceived").innerHTML = "Messages Received: " + counter_country_messagesReceived;
  document.getElementById("appOpens").innerHTML = "App Opens: " + counter_country_appOpens;


}
/*
let xVar = document.getElementById("select-x-var").value;
let yVar = "messages";

*/
let xVar = document.getElementById("select-x-var").value;
let yVar = document.getElementById("select-y-var").value;


function methodToBeNamed(yScale, xScale, filteredData, selection_date) {


  svg.selectAll(".bubble")
    .enter()
    .data(filteredData)    // bind each element of the data array to one SVG circle

    .join("circle")
    .attr("class", "bubble")
    .attr("cx", d => xScale(d[xVar]))   // set the x position based on the number of conversationCount
    .attr("cy", d => yScale(d[yVar]))   // set the y position based on the number of swipes
    .attr("r", d => Math.sqrt(d.appOpens))  // set the radius based on the article reading time
    .attr("fill", d => {
      if (!mappingColorUser.hasOwnProperty(d.userID)) {
        mappingColorUser[d.userID] = userColors[counterColors++]
      }
      return mappingColorUser[d.userID];
    }
    )
    .attr("fill-opacity", d => {
      if (d.date == selection_date) {
        return 1;
      } else {
        return 0.4;
      }
    })
    .on("mouseover", (e, d) => {    // event listener to show tooltip on hover
      d3.select("#bubble-tip-" + d.userID)  // i'm using the publish time as a unique ID
        .style("display", "block");
    })
    .on("mouseout", (e, d) => {    // event listener to hide tooltip after hover
      if (!d.toolTipVisible) {
        d3.select("#bubble-tip-" + d.userID)
          .style("display", "none");
      }
    })
    .on("click", (e, d) => {    // event listener to make tooltip remain visible on click
      if (!d.toolTipVisible) {
        d3.select("#bubble-tip-" + d.userID)
          .style("display", "block");
        d.toolTipVisible = true;
      }
      else {
        d3.select("#bubble-tip-" + d.userID)
          .style("display", "none");
        d.toolTipVisible = false;
      }
    });

  svg.selectAll(".bubble-tip")
    .data(filteredData)
    .join("g")
    .attr("class", "bubble-tip")
    .attr("id", (d) => "bubble-tip-" + d.userID)
    .attr("transform", d => "translate(" + 700 + ", " + 200 + ")")
    .style("display", "none")
    .append("rect")     // this is the background to the tooltip
    .attr("x", -5)
    .attr("y", -20)
    .attr("rx", 5)
    .attr("fill", "white")
    .attr("fill-opacity", 0.9)
    .attr("width", 180)
    .attr("height", 100)

  svg.selectAll(".bubble-tip")
    .append("text")
    .text(d => "user: " + d.userID)
    .style("font-family", "sans-serif")
    .style("font-size", 14)
    .attr("stroke", "none")
    .attr("fill", d => mappingColorUser[d.userID])

  /* svg.selectAll(".bubble-tip")
     .data(filteredData)
     .join("g")
     .attr("class", "bubble-tip")
     .attr("id", (d) => "bubble-tip-" + d.userID)
     .attr("transform", d => "translate(" + (xScale(d.messagesSent + d.messagesReceived) + 20) + ", " + yScale(d.swipeLike + d.swipePass) + ")")
     .style("display", "none")
     .append("rect")     // this is the background to the tooltip
     .attr("x", -5)
     .attr("y", -20)
     .attr("rx", 5)
     .attr("fill", "white")
     .attr("fill-opacity", 0.9)
     .attr("width", 180)
     .attr("height", 100)
 
 
   // SVG does not wrap text
   // so I add a new text element for each line (4 words)
   svg.selectAll(".bubble-tip")
     .append("text")
     .text(d => "user: " + d.userID)
     .style("font-family", "sans-serif")
     .style("font-size", 14)
     .attr("stroke", "none")
     .attr("fill", d => mappingColorUser[d.userID])
 
   svg.selectAll(".bubble-tip")
     .append("text")
     .classed("bubble-tip-yText", true)
    // .text(d => "(swipes: " + (d.swipeLike + d.swipePass) + " )")
    .text(d => {
      return "(" + yVar + ": " + d.swipeLike + ")";
    })
   
    .attr("y", d => (20))
     .style("font-family", "sans-serif")
     .style("font-size", 14)
     .attr("stroke", "none")
     .attr("fill", d => mappingColorUser[d.userID])
 
   svg.selectAll(".bubble-tip")
     .append("text")
     .classed("bubble-tip-yText", true)
   //  .text(d => "(Messages: " + (d.messagesSent + d.messagesReceived) + ")")
     .text(d => "(" + xVar+": " + d[xVar] + " )")
     .attr("y", d => (40))
     .style("font-family", "sans-serif")
     .style("font-size", 14)
     .attr("stroke", "none")
     .attr("fill", d => mappingColorUser[d.userID])
     */
}

function createScatterPlot(filteredData) {


  let xScale = d3.scaleLinear()
    .domain([0, d3.max(filteredData, d => d[xVar])])   // my x-variable has a max of 2500
    .range([0, 600]);   // my x-axis is 600px wide

  let yScale = d3.scaleLinear()
    .domain([0, d3.max(filteredData, d => d[yVar])])   // my y-variable has a max of 1200
    .range([heightGraph, 0]);   // my y-axis is 400px high
  // (the max and min are reversed because the 
  // SVG y-value is measured from the top)
  svg.append("g")       // the axis will be contained in an SVG group element
    .attr("id", "yAxis")
    .call(d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(d3.format("d"))
      .tickSizeOuter(0)
    )
  svg.append("g")
    .attr("transform", "translate(0," + heightGraph + ")")    // translate x-axis to bottom of chart
    .attr("id", "xAxis")
    .call(d3.axisBottom(xScale)
      .ticks(5)
      .tickFormat(d3.format("d"))
      .tickSizeOuter(0))

  methodToBeNamed(yScale, xScale, filteredData, selection_date);


  document.getElementById("select-x-var").addEventListener("change", (e) => {

    // update the x-variable based on the user selection
    xVar = e.target.value


    // rescale the x-axis
    xScale = d3.scaleLinear()
      .domain([0, d3.max(filteredData, d => d[xVar])])
      .range([0, 600]);

    // redraw the x-axis
    svg.select("#xAxis")
      .call(d3.axisBottom(xScale)
        .ticks(5)
        .tickFormat(d3.format("d"))
        .tickSizeOuter(0)
      )


    // transition each circle element
    svg.selectAll(".bubble")
      .transition()
      .duration(1000)
      .attr("cx", (d) => xScale(d[xVar]))

    // transition each tooltip
    svg.selectAll(".bubble-tip")
      .transition()
      .duration(1000)
      .attr("transform", d => "translate(" + 700 + ", " + 200 + ")")
    // .attr("transform", d => "translate(" + (xScale(d[xVar]) + 20) + ", " + yScale(d[yVar]) + ")")
  })

  document.getElementById("select-y-var").addEventListener("change", (e) => {

    // update the x-variable based on the user selection
    yVar = e.target.value

    // rescale the x-axis
    yScale = d3.scaleLinear()
      .domain([0, d3.max(filteredData, d => d[yVar])])
      .range([heightGraph, 0]);

    // redraw the x-axis
    svg.select("#yAxis")
      .call(d3.axisLeft(yScale)
        .ticks(5)
        .tickFormat(d3.format("d"))
        .tickSizeOuter(0)
      )

    // transition each circle element and tooltip
    svg.selectAll(".bubble")
      .transition()
      .duration(1000)
      .attr("cy", (d) => yScale(d[yVar]))

    svg.selectAll(".bubble-tip-yText")
      .text(d => "(" + d[yVar] + " " + yVar + ")")

    svg.selectAll(".bubble-tip")
      .attr("transform", d => "translate(" + 700 + ", " + 200 + ")")
    //  .attr("transform", d => "translate(" + (xScale(d[xVar]) + 20) + ", " + yScale(d[yVar]) + ")")



  })
  calculateStats_ByCountry(filteredData, selectedCountry, selectedDate);

  editCountryStats();
}


function colorBubblesGrey() {
  //svg.selectAll(".bubble").attr("fill", d => "#e6e6e6")//grey
  svg.selectAll(".bubble").attr("fill-opacity", 0.4)
}

var timelineMargin = { top: 50, right: 50, bottom: 0, left: 50 },
  timelineWidth = 2 * width / 3 - timelineMargin.left - timelineMargin.right,
  timelineHeight = 200 - timelineMargin.top - timelineMargin.bottom;

var svg_timeline = d3.select("#timeLine")
  .append("svg")
  .attr("width", timelineWidth + timelineMargin.left + timelineMargin.right)
  .attr("height", timelineHeight + timelineMargin.top + timelineMargin.bottom);

function createTimeLine(datingData, covidData) {
  let filteredDatingData = datingData.filter(data => data.date == startDate);

  var startDate = new Date(datingData[0].date);
  var endDate = new Date(datingData[datingData.length - 1].date);
  const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);


  //.attr('transform', 'translate(' + (timelineMargin.left-(width)/2) + ',' + 0 + ')');
  //FIX ALIGNMENT ISSUES
  ////////// slider //////////

  var moving = false;
  var currentValue = 0;
  var targetValue = timelineWidth;
  /*
  var playButton = d3.select("#play-button");
  playButton.attr('class', 'position-absolute top-100 start-50');
  */
  var timeX = d3.scaleTime()
    .domain([startDate, endDate])
    .range([0, targetValue])
    .clamp(true);

  var slider = svg_timeline.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + timelineMargin.left + "," + timelineHeight / 5 + ")");

  slider.append("line")
    .attr("class", "track")
    .attr("x1", timeX.range()[0])
    .attr("x2", timeX.range()[1])
    .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-inset")
    .select(function () { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "track-overlay")
    .call(d3.drag()
      .on("start.interrupt", function () { slider.interrupt(); })
      .on("start drag", function (e) {
        currentValue = e.x;
        updateSlider(currentValue);
      })
    );

  slider.insert("g", ".track-overlay")
    .attr("class", "ticks")
    .attr("transform", "translate(0," + 18 + ")")
    .selectAll("text")
    .data(timeX.ticks(10))
    .enter()
    .append("text")
    .attr("x", timeX)
    .attr("y", 10)
    .attr("text-anchor", "middle")
    .text(function (d) { return formatDateIntoMonth(d); });

  var handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("fill", "#fff")
    .attr("r", 9);



  var label = slider.append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .text(formatDate(startDate))
    .attr("transform", "translate(0," + (-15) + ")")


  /*  var plot = svg_timeline.append("g")
      .attr("class", "plot")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    var locations = plot.selectAll(".location")
      .data(datingData);
    var x = d3.scaleTime()
      .domain([startDate, endDate])
      .range([0, targetValue])
      .clamp(true);
  
    locations.enter()
      .append("circle")
      .attr("class", "location")
      .attr("cx", function (d) { return x(d.date); })
      .attr("cy", 10)
      .style("fill", function (d) { return d3.hsl(d.date / 1000000000, 0.8, 0.8) })
      .style("stroke", function (d) { return d3.hsl(d.date / 1000000000, 0.7, 0.7) })
      .style("opacity", 0.5)
      .attr("r", 8)
      .transition()
      .duration(400)
      .attr("r", 25)
      .transition()
      .attr("r", 8);
  */
  /* playButton
     .on("click", function () {
       var button = d3.select(this);
       if (button.text() == "Pause") {
         moving = false;
         clearInterval(timer);
         // timer = 0;
         button.text("Play");
       } else {
         moving = true;
         timer = setInterval(step, 1000);
         button.text("Pause");
       }
     });*/

  function step() {
    updateSlider(currentValue);
    currentValue = currentValue + (targetValue / totalDays);
    if (currentValue > targetValue) {
      moving = false;
      currentValue = 0;
      clearInterval(timer);
      // timer = 0;
      /*  playButton.text("Play");*/
    }
  }

  function updateSlider(currentValue) {
    var h = timeX.invert(currentValue);
    label
    .attr("x", timeX(h))
    .text(formatDate(h));
    // update position and text of label according to slider scale
    handle.attr("cx", timeX(h));
    if ("2020-01-01" == formatDateForData(new Date(label.text()))) {
      handle.attr("fill", "#e6194b");
    } else {
      handle.attr("fill", "#fff");
    }


  
    // filter data set and redraw plot

    //d3.select('#radial').select('svg').remove()
    /* if(scatterPlotOpen){
       updateScatter();
     }else{
       updateRadial();
     }*/
    updateScatter();

  }

  function updateScatter() {
    colorBubblesGrey();
    selection_date = formatDateForData(new Date(label.text()));
    // filteredDatingData = datingData.filter(data => data.date <= date);
    filteredDatingData = datingData.filter(data => data.date <= selection_date);
    d3.selectAll('.bubble').remove();
    plotDataCircles(datingData, filteredDatingData);
    if (!isClickedOnTimeline) {
      mappingColorUser = {}
      counterColors = 0;
      isClickedOnTimeline = true;
    }
  }
  function plotDataCircles(alldata, filteredData) {
    xVar = document.getElementById("select-x-var").value;
    yVar = document.getElementById("select-y-var").value;

    let svg = d3.select("#plotSVG")
      .style("overflow", "visible") // some tooltips stray outside the SVG border
      .append("g")
      .attr("transform", "translate(50,50)")

    xScale = d3.scaleLinear()
      //  .domain([0, d3.max(filteredData, d => d["messagesSent"])])   // my x-variable has a max of 2500
      .domain([0, d3.max(alldata, d => d[xVar])])
      //    .domain([0, 250])   // my x-variable has a max of 2500
      .range([0, 600]);   // my x-axis is 600px wide

    yScale = d3.scaleLinear()
      .domain([0, d3.max(alldata, d => d[yVar])])
      //   .domain([0, 120])   // my y-variable has a max of 1200
      .range([heightGraph, 0]);   // my y-axis is 400px high
    // (the max and min are reversed because the 
    // SVG y-value is measured from the top)
    /*
      svg.selectAll(".bubble").attr("fill-opacity", 0.4)
  
    
      // redraw the x-axis
      svg.select("#yAxis").remove;
    
      svg.select("#xAxis")
        .call(d3.axisBottom(xScale)
          .ticks(5)
          .tickFormat(d3.format("d"))
          .tickSizeOuter(0)
        )*/

    methodToBeNamed(yScale, xScale, filteredData, selection_date);



    calculateStats_ByCountry(filteredData, selectedCountry);
    editCountryStats();
  }

}

/*
function functionGhost() {
  selectedDate = dates[++counterClick];
  const element = document.querySelectorAll(".bubble");
  d3.json("../docs/data/allUsers_ByDate.json", d => {

  }).then(data => {


    filterData = filterData_ByCountry(data, selectedCountry, selectedDate);

    colorBubblesGrey();
    addBubbles(filterData);
  })

}*/

/*
function addBubbles(allTestData) {
  


  let svg2 = d3.select("#plotSVG")
    .style("overflow", "visible") // some tooltips stray outside the SVG border
    .append("g")
    .attr("transform", "translate(50,50)")


  let xScale = d3.scaleLinear()
    .domain([0, 250])   // my x-variable has a max of 2500
    .range([0, 600]);   // my x-axis is 600px wide

  let yScale = d3.scaleLinear()
    .domain([0, 120])   // my y-variable has a max of 1200
    .range([heightGraph, 0]);   // my y-axis is 400px high
  // (the max and min are reversed because the 
  // SVG y-value is measured from the top)
  svg2.selectAll(".bubble").attr("fill-opacity", 0.4)

  /*
    let categoryColors = {
      "No Measure": "#11111",
      "Measure 1": "#1f77b4",ˇ
      "Measure 2": "#8c564b",
      "Measure 3": "#235643",
  
    }*/
/*
  svg2.append("g")       // the axis will be contained in an SVG group element
    .attr("id", "yAxis")
    .call(d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(d3.format("d"))
      .tickSizeOuter(0)
    )

  svg2.append("g")
    .attr("transform", "translate(0," + heightGraph + ")")    // translate x-axis to bottom of chart
    .attr("id", "xAxis")
    .call(d3.axisBottom(xScale)
      .ticks(5)
      .tickFormat(d3.format("d"))
      .tickSizeOuter(0)
    )


  svg2.selectAll(".bubble")
    .data(allTestData)    // bind each element of the data array to one SVG circle
    .join("circle")
    .attr("class", "bubble")
    .attr("cx", d => xScale(d.messagesSent + d.messagesReceived))   // set the x position based on the number of conversationCount
    .attr("cy", d => yScale(d.swipePass + d.swipeLike))   // set the y position based on the number of swipes
    .attr("r", d => Math.sqrt(d.appOpens))  // set the radius based on the article reading time
    .attr("stroke", d => {
      if (!mappingColorUser.hasOwnProperty(d.userID)) {
        mappingColorUser[d.userID] = userColors[counterColors++]

      }
      return mappingColorUser[d.userID];
    })
    .attr("fill", d => mappingColorUser[d.userID])
    .attr("fill-opacity", 1)
    .on("mouseover", (e, d) => {    // event listener to show tooltip on hover
      d3.select("#bubble-tip-" + d.userID)  // i'm using the publish time as a unique ID
        .style("display", "block");
    })
    .on("mouseout", (e, d) => {    // event listener to hide tooltip after hover
      if (!d.toolTipVisible) {
        d3.select("#bubble-tip-" + d.userID)
          .style("display", "none");
      }
    })
    .on("click", (e, d) => {    // event listener to make tooltip remain visible on click
      if (!d.toolTipVisible) {
        d3.select("#bubble-tip-" + d.userID)
          .style("display", "block");
        d.toolTipVisible = true;
      }
      else {
        d3.select("#bubble-tip-" + d.userID)
          .style("display", "none");
        d.toolTipVisible = false;
      }
    });


  svg2.selectAll(".bubble-tip")
    .data(allTestData)
    .join("g")
    .attr("class", "bubble-tip")
    .attr("id", (d) => "bubble-tip-" + d.userID)
    .attr("transform", d => "translate(" + (xScale(d.messagesSent + d.messagesReceived) + 20) + ", " + yScale(d.swipeLike + d.swipePass) + ")")
    .style("display", "none")
    .append("rect")     // this is the background to the tooltip
    .attr("x", -5)
    .attr("y", -20)
    .attr("rx", 5)
    .attr("fill", "white")
    .attr("fill-opacity", 0.9)
    .attr("width", 180)
    .attr("height", 100)

  // SVG does not wrap text
  // so I add a new text element for each line (4 words)
  svg2.selectAll(".bubble-tip")
    .append("text")
    .text(d => "user: " + d.userID)
    .style("font-family", "sans-serif")
    .style("font-size", 14)
    .attr("stroke", "none")
    .attr("fill", d => mappingColorUser[d.userID])

  svg2.selectAll(".bubble-tip")
    .append("text")
    .classed("bubble-tip-yText", true)
    .text(d => "(swipes: " + (d.swipeLike + d.swipePass) + " )")
    .attr("y", d => (20))
    .style("font-family", "sans-serif")
    .style("font-size", 14)
    .attr("stroke", "none")
    .attr("fill", d => mappingColorUser[d.userID])

  svg2.selectAll(".bubble-tip")
    .append("text")
    .classed("bubble-tip-yText", true)
    .text(d => "(Messages: " + (d.messagesSent + d.messagesReceived) + " )")
    .attr("y", d => (40))
    .style("font-family", "sans-serif")
    .style("font-size", 14)
    .attr("stroke", "none")
    .attr("fill", d => mappingColorUser[d.userID])

  let xVar = document.getElementById("select-x-var").value;
  let yVar = "swipeLike";
  document.getElementById("select-x-var").addEventListener("change", (e) => {

    // update the x-variable based on the user selection
    xVar = e.target.value

    if (xVar === "userID") {

      xScale = d3.scaleTime()
        .domain([d3.min(allTestData, d => d[xVar]), d3.max(allTestData, d => d[xVar])])
        .range([0, 600]);

      d3.select("#xAxis")
        .call(d3.axisBottom(xScale)
          .tickFormat(d3.timeFormat("%b %d")))
      //see here for time formatting options: 
      // https://github.com/d3/d3-time-format
    }
    else if (xVar === "category") {

      xScale = d3.scaleBand()
        .domain(Object.keys(userColors))
        .range([0, 600])
        .padding(1) // space them out so the bubble appears in the centre

      svg2.select("#xAxis")
        .call(d3.axisBottom(xScale).tickSize(0))
        .selectAll("text")
        // offset the category names to fit them in horizontally
        .attr("transform", (d, i) => `translate(0, ${(i % 2) * 20})`)
        .style("fill", d => mappingColorUser[d.userID])
    }
    else {
      // rescale the x-axis
      xScale = d3.scaleLinear()
        .domain([0, d3.max(allTestData, d => d[xVar])])
        .range([0, 600]);

      // redraw the x-axis
      svg2.select("#xAxis")
        .call(d3.axisBottom(xScale)
          .ticks(5)
          .tickFormat(d3.format("d"))
          .tickSizeOuter(0)
        )

    }
    // transition each circle element
    svg2.selectAll(".bubble")
      .transition()
      .duration(1000)
      .attr("cx", (d) => xScale(d[xVar]))

    // transition each tooltip
    svg2.selectAll(".bubble-tip")
      .transition()
      .duration(1000)
      .attr("transform", d => "translate(" + (xScale(d[xVar]) + 20) + ", " + yScale(d[yVar]) + ")")
  })

  document.getElementById("select-y-var").addEventListener("change", (e) => {

    // update the x-variable based on the user selection
    yVar = e.target.value

    // rescale the x-axis
    yScale = d3.scaleLinear()
      .domain([0, d3.max(allTestData, d => d[yVar])])
      .range([heightGraph, 0]);

    // redraw the x-axis
    svg2.select("#yAxis")
      .call(d3.axisLeft(yScale)
        .ticks(5)
        .tickFormat(d3.format("d"))
        .tickSizeOuter(0)
      )

    // transition each circle element and tooltip
    svg2.selectAll(".bubble")
      .transition()
      .duration(1000)
      .attr("cy", (d) => yScale(d[yVar]))

    svg2.selectAll(".bubble-tip-yText")
      .text(d => "(" + d[yVar] + " " + yVar + ")")

    svg2.selectAll(".bubble-tip")
      .attr("transform", d => "translate(" + (xScale(d[xVar]) + 20) + ", " + yScale(d[yVar]) + ")")
  })


}
*/

/*function changeTitle() {

  let element_title = document.getElementById("titleCountry");

  selectedCountry = element_ddCountry.value;
  element_title.textContent = selectedCountry;

  const element = document.querySelectorAll(".bubble");
  for (var i = 0; i < element.length; i++) {
    d3.select(element[i]).remove();
  }

  d3.json("../docs/data/testdata_app.json", d => {

  }).then(data => {


    filterData = filterJSON(data, selectedCountry);

    createScatterPlot(filterData);
  })


}*/
/*
function addCountry() {
  let text = document.getElementById("titleCountry");
  text.textContent = selectedCountry;
  const opt1 = document.createElement("option");
  opt1.value = "Dyn Country 3";
  opt1.text = "Dyn Country 3";

  element_ddCountry.add(opt1, null);
}*/
