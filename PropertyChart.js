/**
 * Created by Chen on 11/10/16.
 */

function PropertyChart() {
    var self = this;
    self.init();
}

PropertyChart.prototype.init = function () {
    var self = this;
    d3.select("#property-chart").select("svg").remove();
    self.svg = d3.select("#property-chart").append("svg")
        .attr("width", "450")
        .attr("height", "300");
};

PropertyChart.prototype.update = function (team, teamsData) {
    var self = this;

    self.svg.selectAll("g").remove();
    var linesGroup = self.svg.append("g");

    var linesData = [{x: 10, y: 10},
                     {x: 440, y: 10},
                     {x: 440, y: 290},
                     {x: 10, y: 290},
                     {x: 10, y: 10}];

    //to add frame
    var linesPro = d3.line()
        .x(function (d) {
            return d.x;
        })
        .y(function (d) {
            return d.y;
        });

    linesGroup.append("path")
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width", 2)
        .attr("d", linesPro(linesData));

    //To add badge of selected team
    self.svg.select("image").remove();
    self.svg
        .append("image")
        .attr("x", 180)
        .attr("y", 30)
        .attr("height", 70)
        .attr("width", 70)
        .attr("xlink:href", "figs/" + team + ".png");

    //To add properties of the selected team
    var teams = [];
    var counter = 0;
    while (teams.length != 20){
        if(teams.indexOf(teamsData[counter].HomeTeam) == -1){
            teams.push(teamsData[counter].HomeTeam);
        }
        counter++;
    }

    teams = teams.sort();

    var teams_goals_made = {};
    var teams_goals_conceded = {};
    var teams_goals_made_first = {};
    var team_goals_conceded_first = {};

    for(var i = 0; i < teams.length; i++){
        teams_goals_conceded[teams[i]] = 0;
        teams_goals_made[teams[i]] = 0;
        teams_goals_made_first[teams[i]] = 0;
        team_goals_conceded_first[teams[i]] = 0;
    }
    teamsData.forEach(function (d) {
        teams_goals_made[d.HomeTeam] += d.FTHG;
        teams_goals_made[d.AwayTeam] += d.FTAG;
        teams_goals_conceded[d.AwayTeam] += d.FTHG;
        teams_goals_conceded[d.HomeTeam] += d.FTAG;

        teams_goals_made_first[d.HomeTeam] += d.HTHG;
        team_goals_conceded_first[d.AwayTeam] += d.HTAG;
    })


    //attack_rank is made in increasing order, the team that scores the most goals is the last item in the list
    //defense_rank is made in decreasing order, the team that lose the least goals is the last item in the list
    var attack_rank = Object.keys(teams_goals_made).sort(function(a,b){return teams_goals_made[b]-teams_goals_made[a]});
    var defense_rank = Object.keys(teams_goals_conceded).sort(function(a,b){return teams_goals_conceded[b]-teams_goals_conceded[a]});

    var gc = new GlobalChart();
    gc.update(teamsData, attack_rank, defense_rank);

    //Add explanation text to the html
    d3.select("#property-chart").select("svg").selectAll("text").remove();
    self.svg
        .append("text")
        .attr("dx", 41)
        .attr("dy", 130)
        .text("Attack Ability:");

    self.svg
        .append("text")
        .attr("dx", 30)
        .attr("dy", 150)
        .text("Defense Ability:");

    self.svg
        .append("text")
        .attr("dx", 20)
        .attr("dy", 180)
        .text("Goals made in first half");
    self.svg
        .append("text")
        .attr("dx", 250)
        .attr("dy", 180)
        .text("Goals made in second half");

    self.svg
        .append("text")
        .attr("dx", 20)
        .attr("dy", 225)
        .text("Goals conceded in first half");
    self.svg
        .append("text")
        .attr("dx", 230)
        .attr("dy", 225)
        .text("Goals conceded in second half");

    //Capabilities Display
    var attack = attack_rank.indexOf(team) / 2 + 1;
    var defense = defense_rank.indexOf(team) / 2 + 1;

    self.svg.selectAll("rect").remove();
    for(var i = 0; i < attack; i++){
        self.svg
            .append("rect")
            .attr("x", 145 + i * 25)
            .attr("y", 120)
            .attr("width", 23)
            .attr("height", 13)
            .attr("fill", "gold");
    }

    for(var i = 0; i< defense; i++){
        self.svg
            .append("rect")
            .attr("x", 145 + i * 25)
            .attr("y", 140)
            .attr("width", 23)
            .attr("height", 13)
            .attr("fill", "gold");
    }


    var pos_goals_made = teams_goals_made_first[team] / teams_goals_made[team] * 400;
    var pos_goals_conceded = team_goals_conceded_first[team] / teams_goals_conceded[team] * 400;

    //goals made
    self.svg
        .append("rect")
        .attr("x", 30)
        .attr("y", 190)
        .attr("width", pos_goals_made)
        .attr("height", 15)
        .attr("fill", "lightblue");
    self.svg
        .append("rect")
        .attr("x",pos_goals_made + 30)
        .attr("y", 190)
        .attr("width", 400 - pos_goals_made)
        .attr("height", 15)
        .attr("fill", "steelblue");

    //goals conceded
    self.svg
        .append("rect")
        .attr("x", 30)
        .attr("y", 230)
        .attr("width", pos_goals_conceded)
        .attr("height", 15)
        .attr("fill", "lightblue");
    self.svg
        .append("rect")
        .attr("x",pos_goals_conceded + 30)
        .attr("y", 230)
        .attr("width", 400 - pos_goals_conceded)
        .attr("height", 15)
        .attr("fill", "steelblue");

}