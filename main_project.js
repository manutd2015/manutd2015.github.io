/**
 * Created by Chen on 11/8/16.
 */
var teamchart;
var globalchart;

(function () {
    var instance = null;

    function init() {
        d3.csv("15-16.csv", function (data) {
            teamchart = new TeamChart();
            teamchart.update("15-16");
            globalchart = new GlobalChart();
        });
    }

    function Main(){
        if(instance  !== null){
            throw new Error("Cannot instantiate more than one Class");
        }
    }

    Main.getInstance = function(){
        var self = this
        if(self.instance == null){
            self.instance = new Main();

            //called only once when the class is initialized
            init();
        }
        return instance;
    }

    Main.getInstance();
})();