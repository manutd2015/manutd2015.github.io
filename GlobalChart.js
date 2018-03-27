/**
 * Created by Chen on 2016/11/26.
 */
var sorted_final_ranking
var rank
function GlobalChart() {
    var self = this;
    self.init();
}

GlobalChart.prototype.init = function () {
    var self = this;
    d3.select("#global-chart").select("svg").remove();
    self.svg = d3.select("#global-chart").append("svg")
        .attr("width", "900")
        .attr("height", "500");
    self.svg.append("g").attr("id", "xAxis");
    self.svg.append("g").attr("id", "yAxis");
    self.svg.append("g").attr("id", "circles")
}

GlobalChart.prototype.update = function (teamsData, attack_rank) {
    var self = this;
    var final_ranking = {};
    var counter = 0;
    while(Object.keys(final_ranking).length != 20){
        if(!(final_ranking.hasOwnProperty(teamsData[counter].HomeTeam))){
            final_ranking[teamsData[counter].HomeTeam] = teamsData[counter].Ranking;
        }
        counter++;
    }
    
    sorted_final_ranking = Object.keys(final_ranking).sort(function (a,b) {
        return final_ranking[a] - final_ranking[b];
    })

    //create the axis
    var svg = d3.select("#global-chart").select("svg");

    var yscale = d3.scaleLinear().domain([0,20]).range([450, 50]);
    var yAxis = d3.axisLeft().scale(yscale);
    var xscale = d3.scaleLinear().domain([0,20]).range([70, 850]);
    var xAxis = d3.axisBottom(xscale);

    d3.select("#xAxis")
        .attr("transform", "translate(0,450)")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "0.8em")
        .attr("dy", "1.2em");

    d3.select("#yAxis").attr("transform", "translate(70,0)").call(yAxis);

    //create circles, which represent the rankings.
    var circles = d3.select("#circles").selectAll("circle").data(sorted_final_ranking);

    //relation between final ranking and attach capability
    circles.enter()
        .append("circle")
        .attr("cx", function (d) {
            return xscale(sorted_final_ranking.indexOf(d)+1);
        })
        .attr("cy", function (d) {
            return yscale(attack_rank.indexOf(d)+1);
        })
        .attr("r", 10)
        .attr("fill", "gold");

    //add explanation for final ranking
    svg.select("text").remove();
    svg.append("text")
        .attr("dx", 800)
        .attr("dy", 490)
        .text("Final Ranking");
}


GlobalChart.prototype.select_update = function (d,i) {
    d3.select("#circles").selectAll("circle").attr("fill", "gold");
    rank = sorted_final_ranking.indexOf(d) + 1;
    d3.select("#circles")
        .selectAll("circle")
        .attr("fill", function (d,i) {
            if(rank == i){
                return "steelblue";
            } else {
                return "gold";
            }
        })
        .attr("r", function (d,i) {
            if(rank == i){
                return 15;
            }else {
                return 10;
            }
        });
}

GlobalChart.prototype.updatebybutton = function (season,property){
    var self = this;
    d3.csv(season + ".csv", function (data) {
        data.forEach(function (d) {
            d.FTHG = +d.FTHG;
            d.FTAG = +d.FTAG;
            d.HTHG = +d.HTHG;
            d.HTAG = +d.HTAG;
            d.Ranking = +d.Ranking;
            d.HS = +d.HS;
            d.HST = +d.HST;
            d.AS = +d.AS;
            d.AST = +d.AST;
        })
        self.data_set = data;
        main_update();

    });

    function main_update() {
        d3.select("#circles").selectAll("circle").remove();
        var teams = [];
        var counter = 0;
        while (teams.length != 20) {
            if (teams.indexOf(self.data_set[counter].HomeTeam) == -1) {
                teams.push(self.data_set[counter].HomeTeam);
            }
            counter++;
        }
        teams = teams.sort();

        var teams_goals_made = {};
        var teams_goals_conceded = {};
        var teams_chances_make = {};
        var teams_chances_take = {};

        for (var i = 0; i < teams.length; i++) {
            teams_goals_conceded[teams[i]] = 0;
            teams_goals_made[teams[i]] = 0;
            teams_chances_make[teams[i]] = 0;
            teams_chances_take[teams[i]] = 0;
        }

        self.data_set.forEach(function (d) {
            teams_goals_made[d.HomeTeam] += d.FTHG;
            teams_goals_made[d.AwayTeam] += d.FTAG;
            teams_goals_conceded[d.AwayTeam] += d.FTHG;
            teams_goals_conceded[d.HomeTeam] += d.FTAG;

            teams_chances_make[d.HomeTeam] += d.HS;
            teams_chances_make[d.AwayTeam] += d.AS;
            teams_chances_take[d.HomeTeam] += d.HST;
            teams_chances_take[d.AwayTeam] += d.AST;
        })

        for(var i = 0; i < teams.length;i++){
            teams_chances_take[teams[i]] = teams_chances_take[teams[i]] / teams_chances_make[teams[i]];
        }

        var attack_rank = Object.keys(teams_goals_made).sort(function (a, b) {
            return teams_goals_made[b] - teams_goals_made[a]
        });
        var defense_rank = Object.keys(teams_goals_conceded).sort(function (a, b) {
            return teams_goals_conceded[a] - teams_goals_conceded[b]
        });
        var chances_make_rank = Object.keys(teams_chances_make).sort(function (a, b) {
            return teams_chances_make[b] - teams_chances_make[a]
        });
        var chances_take_rank = Object.keys(teams_chances_take).sort(function (a, b) {
            return teams_chances_take[b] - teams_chances_take[a]
        });

        var final_ranking = {};
        var counter = 0;
        while (Object.keys(final_ranking).length != 20) {
            if (!(final_ranking.hasOwnProperty(self.data_set[counter].HomeTeam))) {
                final_ranking[self.data_set[counter].HomeTeam] = self.data_set[counter].Ranking;
            }
            counter++;
        }

        sorted_final_ranking = Object.keys(final_ranking).sort(function (a, b) {
            return final_ranking[a] - final_ranking[b];
        })

        var circles = d3.select("#circles").selectAll("circle").data(sorted_final_ranking);
        var yscale = d3.scaleLinear().domain([0,20]).range([450, 50]);
        var xscale = d3.scaleLinear().domain([0,20]).range([70, 850]);

        tip = d3.tip()
            .attr('class', 'd3-tip')
            .direction("s")
            .offset(function() {
                return [0,0];
            })
            .html(function (d) {
                return self.tooltip_render(d);
            });

        //relation between final ranking and attach capability
        circles.enter()
            .append("circle")
            .attr("cx", function (d) {
                return xscale(sorted_final_ranking.indexOf(d)+1);
            })
            .attr("cy", function (d) {
                if(property == "attack"){
                    return yscale(attack_rank.indexOf(d)+1);
                }else if(property == "defense"){
                    return yscale(defense_rank.indexOf(d)+1);
                }else if(property == "Chances-make"){
                    return yscale(chances_make_rank.indexOf(d)+1);
                }else if(property == "Chances-take"){
                    return yscale(chances_take_rank.indexOf(d)+1);
                }
            })
            .attr("r", function (d,i) {
                if(rank == i){
                    return 15;
                }else{
                    return 10;
                }
            })
            .attr("fill", function (d,i) {
                if(rank == i){
                    return "steelblue";
                } else {
                    return "gold";
                }
            });

        svg.select("text").remove();
        svg.append("text")
            .attr("dx", 800)
            .attr("dy", 490)
            .text("Final Ranking");
    }
};
