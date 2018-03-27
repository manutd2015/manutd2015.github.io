/**
 * Created by Chen on 11/9/16.
 */
function TeamChart() {
    var self = this;
    //self.data = data;
    self.data_set = [];
    self.init();
};

TeamChart.prototype.init = function(){
    self.margin = {top: 10, right: 10, bottom: 30, left: 0};
    var teamChart = d3.select("#team-chart").classed("fullView", true);

    //Gets access to the div element created for this chart from HTML
    self.svgBounds = teamChart.node().getBoundingClientRect();
    self.svgWidth = self.svgBounds.width - self.margin.left - self.margin.right;
    self.svgHeight = 120;

    //creates svg element within the div
    self.svg = teamChart.append("svg")
        .attr("width",self.svgWidth)
        .attr("height",self.svgHeight)
}

TeamChart.prototype.tooltip_render = function (tooltip_data) {
    return tooltip_data;
}

TeamChart.prototype.update = function(value){
    var self = this;
    var pc = new PropertyChart();
    var mc = new MonthChart();
    var gc = new GlobalChart();

    var year = value;
    //load csv file
    d3.csv(year + ".csv", function (data) {
        data.forEach(function (d) {
            d.FTHG = +d.FTHG;
            d.FTAG = +d.FTAG;
            d.HTHG = +d.HTHG;
            d.HTAG = +d.HTAG;
            d.Ranking = +d.Ranking;
        })
        self.data_set = data;
        main_update();

    });

    function main_update() {
        //to get names of the clubs
        d3.select(".d3-tip s").remove();
        document.getElementById("dataset").value = "attack";
        var teams = [];
        var counter = 0;
        while (teams.length != 20){
            if(teams.indexOf(self.data_set[counter].HomeTeam) == -1){
                teams.push(self.data_set[counter].HomeTeam);
            }
            counter++;
        }
        teams = teams.sort();
        //To add tooltips
        tip = d3.tip()
            .attr('class', 'd3-tip')
            .direction("s")
            .offset(function() {
                return [0,0];
            })
            .html(function (d) {
                return self.tooltip_render(d);
            });


        //To add badges of teams
        var svg = d3.select("#team-chart").select("svg").node().getBoundingClientRect();
        var svgWidth = svg.width;

        var imgs = d3.select("#team-chart").select("svg").selectAll("image").data(teams);

        imgs.exit().remove();

        imgs = imgs.enter().append("image").merge(imgs);
        imgs
            .attr("x",function (d,i) {
                return svgWidth / 20 * i + 25;
            })
            .attr("y", 30)
            .attr("height", 40)
            .attr("width", 40)
            .attr("xlink:href", function (d) {
                return "figs/" + d + ".png";
            });
        imgs.classed("selectTeam", false);

        //initialize
        pc.update("Arsenal", self.data_set);
        mc.update("Arsenal", self.data_set);
        gc.select_update("Arsenal", 0);

        imgs.on("click", function (d,i) {
            document.getElementById("dataset").value = "attack";
            pc.update(teams[i], self.data_set);
            mc.update(teams[i], self.data_set);
            gc.select_update(d,i);

            imgs.classed("selectTeam", false)
                .attr("x",function (d,j) {
                    return svgWidth / 20 * j + 25;
                })
                .attr("y", 30);

            imgs.filter(function (d,j) {
                return j==i;
            })
                .attr("x",function (d,j) {
                    return svgWidth / 20 * i + 7.5;
                })
                .attr("y", 20)
                .classed("selectTeam", true);

        });
        d3.select("#team-chart").select("svg").call(tip);
        imgs
            .on("mouseover", tip.show)
            .on("mouseout",tip.hide);
    }
}

