/**
 * Created by jiaojiao on 7/21/16.
 */
$(document).ready(function() {
    // Setup - add a text input to each footer cell
    $('#example').DataTable( {
        "ajax": 'data/table_data.txt',
        "autoWidth": false
    } );
    $('#example tfoot th').each( function () {
        var title = $(this).text();
        $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
    } );

    // DataTable
    var table = $('#example').DataTable();

    // Apply the search
    table.columns().every( function () {
        var that = this;

        $( 'input', this.footer() ).on( 'keyup change', function () {
            if ( that.search() !== this.value ) {
                that
                    .search( this.value )
                    .draw();
            }
        } );
    } );
} );

var app = angular.module('myApp', []);
app.controller('customersCtrl', function($scope) {
    $scope.outputTable = [];
    $scope.count = 0;
    $scope.search = false;
    $scope.normalize = function(){

        $.getJSON( "data/table_data.txt", function( response ) {
            var data = response.data, patt;
            var headerInput = $scope.headers.split("\t");
            var outputTable = [];
            var normalizedResult = [], rowString = "", attributeType = [];
            for(var i = 0;i < data.length;i++){
                rowString = data[i].join(" ");
                for(var j = 0; j < headerInput.length;j++){
                    patt = new RegExp(headerInput[j], "i");
                    if(patt.test(rowString)){
                        if(normalizedResult[j] === undefined){
                            normalizedResult[j] = [data[i][0]];
                            attributeType[j] = [data[i][4]];
                        }else{
                            normalizedResult[j].push(data[i][0]);
                            attributeType[j].push(data[i][4]);
                        }
                    }
                }
            }
            var tempType = "noType", tempArr = [];
            for(var i = 0;i < normalizedResult.length;i++){
                if(normalizedResult[i] !== undefined){
                    tempArr = _.uniq(attributeType[i]);
                    if(tempArr.length === 1){
                        outputTable.push({type: tempArr[0], content: headerInput[i] + ": " + normalizedResult[i].join(", ")});
                    }else{
                        outputTable.push({type: tempType, content: headerInput[i] + ": " + joinResults(normalizedResult[i], attributeType[i])});
                    }

                }else{
                    outputTable.push({type: tempType, content: headerInput[i] + ": No Match"});
                }
            }
            $scope.$apply(function(){
                $scope.headerInput = $scope.headers.split("\t");
                $scope.outputTable = outputTable;
                $scope.search = true;
            });
        });
    }

    function joinResults(normalizedResult, attributeType){
        var results = "";
        _.each(normalizedResult, function(item, index){
            results += item + "(" + attributeType[index] + "), ";
        });
        return results;
    }
});