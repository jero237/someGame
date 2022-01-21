$(document).ready(function(){
    const MAIN = $("#main")
    
    for(let i = 0; i < 20; i++){
        for(let j = 0; j < 20; j++){
            $("<div id='" + i + "-" + j + "' class='square' style='grid-area: " + i + "/" + j + "/" + (i+1) + "/" + (j+1) + "' />" ).appendTo(MAIN);
        }
    }


    $(".square").hover(function(){
        $(this).css("background-color","yellow")
    })



})