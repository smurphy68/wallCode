var data = $.csv.toObjects("TheRecord.csv")
var init = "<table>"
var end = "</table>"
var output = for (let i =0; i < data.length; i++) {
    "<tb>"+data[i]+"</tb>"
}
