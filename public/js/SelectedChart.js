/**
 * Created by Hao Sha
 */

function SelectedChart(){

    var self = this;
    self.init();
};

SelectedChart.prototype.init = function() {
    var self = this;
    d3.select("#selected-chart").select("svg").remove();
    self.svg = d3.select("#selected-chart").append("svg")
        .attr("width", "450")
        .attr("height", "300");
}

SelectedChart.prototype.update = function(data, selectedTeam){

    var self = this;
    self.svg.selectAll('text')
        .remove();
    self.svg.selectAll('rect')
        .remove();
    //parse data here
    var i = 0;
    var won = 0;
    var lost = 0;
    var draw = 0;
    var totalGoal = 0;
    var totalConcede = 0;
    var totalGoalHalf = 0;
    var totalConcedeHalf = 0;
    var totalMatches = data.length;
    while (i < data.length){
        if (data[i]["HomeTeam"] == selectedTeam){
            if(data[i]["FTR"] == "H")
                won++;
            else if(data[i]["FTR"] == "A")
                lost++;
            else
                draw++
            totalGoal += data[i]["FTHG"];
            totalConcede += data[i]["FTAG"];
            totalGoalHalf += data[i]["HTHG"];
            totalConcedeHalf += data[i]["HTAG"];
        }
        else {
            if(data[i]["FTR"] == "A")
                won++;
            else if(data[i]["FTR"] == "H")
                lost++
            else
                draw++;
            totalGoal += data[i]["FTAG"];
            totalConcede += data[i]["FTHG"];
            totalGoalHalf += data[i]["HTAG"];
            totalConcedeHalf += data[i]["HTHG"];
        };
        i++
    }

    self.svg
        .append("text")
        .attr("dx", 120)
        .attr("dy", 20)
        .text("Team Stat in Selected Period:");

    self.svg
        .append("rect")
        .attr('x', 150)
        .attr('y', 35)
        .attr('width', won/totalMatches * 300)
        .attr('height', 20)
        .attr('fill', 'green')

    self.svg
        .append("text")
        .attr("dx", 10)
        .attr("dy", 50)
        .text(function(){
            return "Games Won:" + won});

    self.svg
        .append("rect")
        .attr('x', 150)
        .attr('y', 75)
        .attr('width', lost/totalMatches * 300)
        .attr('height', 20)
        .attr('fill', 'red')

    self.svg
        .append("text")
        .attr("dx", 10)
        .attr("dy", 90)
        .text(function(){
            return "Games lost:" + lost});

    self.svg
        .append("rect")
        .attr('x', 150)
        .attr('y', 115)
        .attr('width', draw/totalMatches * 300)
        .attr('height', 20)
        .attr('fill', 'gray')

    self.svg
        .append("text")
        .attr("dx", 10)
        .attr("dy", 130)
        .text(function(){
            return "Games draw:" + draw});

    self.svg
        .append("text")
        .attr("dx", 10)
        .attr("dy", 195)
        .text(function(){
            return "Goals Made in First Half: " + totalGoalHalf});

    self.svg
        .append("text")
        .attr("dx", 270)
        .attr("dy", 195)
        .text(function(){
            return"Total Goals Made: " + totalGoal});

    self.svg
        .append("rect")
        .attr('x', 10)
        .attr('y', 205)
        .attr('width', totalGoalHalf/totalMatches * 120)
        .attr('height', 20)
        .attr('fill', 'lightblue')

    self.svg
        .append("rect")
        .attr('x', 10 + totalGoalHalf/totalMatches * 120)
        .attr('y', 205)
        .attr('width', (totalGoal-totalGoalHalf)/totalMatches * 120)
        .attr('height', 20)
        .attr('fill', 'steelblue')


    self.svg
        .append("text")
        .attr("dx", 10)
        .attr("dy", 250)
        .text(function(){
            return"Goals Conceded in First Half: " + totalConcedeHalf});

    self.svg
        .append("text")
        .attr("dx", 270)
        .attr("dy", 250)
        .text(function(){
            return"Total Goals Conceded: " + totalConcede});

    self.svg
        .append("rect")
        .attr('x', 10)
        .attr('y', 260)
        .attr('width', totalConcedeHalf/totalMatches * 120)
        .attr('height', 20)
        .attr('fill', 'lightblue')

    self.svg
        .append("rect")
        .attr('x', 10 + totalConcedeHalf/totalMatches * 120)
        .attr('y', 260)
        .attr('width', (totalConcede-totalConcedeHalf)/totalMatches * 120)
        .attr('height', 20)
        .attr('fill', 'steelblue')

}