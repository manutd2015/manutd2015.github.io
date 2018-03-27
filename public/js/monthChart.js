/**
 * Created by Hao Sha
 */

function MonthChart(){

    var self = this;
    self.selectedTeam = ""
    self.matchlist = self.parseMatches([],"");
    self.init();

};

MonthChart.prototype.parseMatches = function(data, selectedTeam){

    if (selectedTeam == "")
    {
        return [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37];
    }

    var teamMatchData = [];

    var count = 0;
    while(teamMatchData.length != 38 && count < data.length) {
        //console.log(data[count]);
        if (data[count]["HomeTeam"] == selectedTeam || data[count]["AwayTeam"] == selectedTeam)
            teamMatchData.push(data[count]);
        count++;
    }
    return teamMatchData;
}
/**
 * Initializes the svg elements required for this chart
 */
MonthChart.prototype.init = function(){
    var self = this;

    self.margin = {top: 10, right: 20, bottom: 30, left: 50};
    var divmonthChart = d3.select("#month-chart").classed("fullView", true);
    self.svgBounds = divmonthChart.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 50;
    self.rectWidth = self.svgWidth/(self.matchlist.length);
    divmonthChart.selectAll("svg").remove();
    self.svg = divmonthChart.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight);

    self.svg.append('g').attr('id', 'rects');
    self.svg.append('g').attr('id', 'months');
    self.svg.append('g').attr('id', 'string')
};

MonthChart.prototype.update = function(selectedTeam, selectedData){
    var self = this;

    var sc = new SelectedChart();

    self.matchlist = self.parseMatches(selectedData, selectedTeam);
    self.selectedTeam = selectedTeam;
    self.xScale = d3.scaleLinear()
        .domain([0, self.svgWidth])
        .range([0, 38]);

    sc.update(self.matchlist,selectedTeam);

    var texts = self.svg.selectAll('text').data([1,5,10,15,20,25,30,35,38])
        .enter()
        .append('text');

    texts.attr('x', function(d) {return (d-1) * self.rectWidth;})
        .attr('y', self.svgHeight - 5)
        .attr('class','scale')
        .text(function(d){return d;})

    self.svg.select('#rects')
        .selectAll('rect')
        .remove();


    var rects = self.svg.select('#rects')
        .selectAll('rect')
        .data(self.matchlist)
        .enter()
        .append('rect');

    rects.attr('x', function(d,i) {return (i) * self.rectWidth;})
        .attr('y', 5)
        .attr('width', self.rectWidth)
        .attr('height', self.svgHeight - 25)
        .attr('class', 'tile')
        .attr('fill', function(d,i){
            if (d["HomeTeam"] == self.selectedTeam){
                if(d["FTR"] == "H")
                    return 'green';
                else if(d["FTR"] == "A")
                    return 'red'
                else
                    return 'gray'}
            else {
                if(d["FTR"] == "A")
                    return 'lightgreen';
                else if(d["FTR"] == "H")
                    return 'pink'
                else
                    return 'lightgray'
            };
        });


    self.svg.select(".brush").remove();

    function brushed(){
        if(d3.event.selection){
            var box = d3.event.selection;
            var data = self.matchlist;
            var sliced = data.slice(Math.floor(self.xScale(box[0])), Math.ceil(self.xScale(box[1])));
            sc.update(sliced,selectedTeam);
        } else {
            sc.update(self.matchlist,selectedTeam);
        }
    }

    var brush = d3.brushX()
        .extent([[0, 2], [self.svg.attr('width'), self.svgHeight - 17]])
        .on('end', brushed);

    self.svg.append('g')
        .attr('id','MatchBrush')
        .attr('class', 'brush')
        .call(brush);
}
