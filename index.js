const timer = ms => new Promise(res => setTimeout(res, ms))
let isPlaying = false;


$(document).ready(function () {
    const MAIN = $("#playArea")
    const SQUARE_DEFAULT_COLOR = "red";
    const SCORE = $("#score")
    const LIVES = [$("#live1"), $("#live2"), $("#live3")]
    const PLAY_BUTTON = $(".fa-play-circle")


    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
            $("<div id='" + i + "-" + j + "' class='square' style='grid-area: " + i + "/" + j + "/" + (i + 1) + "/" + (j + 1) + "' />").appendTo(MAIN);
        }
    }


    $(".square").hover(function () {
        $(this).css("background-color", "yellow")
    }, function () {
        $(this).css("background-color", SQUARE_DEFAULT_COLOR)
    })


    async function play() {
        SCORE.css("color", "black")
        SCORE.text("0")

        if(isPlaying)return

        let randomPositionX;
        let randomPositionY;
        let puntaje = 0;
        let waitTime = 1000;
        let hovered = false;
        let lives = 3;
        isPlaying = true;

        for (let i = 0; i < 3; i++) {
            LIVES[i].removeClass("far")
            LIVES[i].addClass("fas")
        }


        const sumarPuntaje = () => {
            puntaje++;
            SCORE.text(puntaje)
            console.log(waitTime)
            hovered = true;
            $("#" + randomPositionX + "-" + randomPositionY).off("mouseenter", sumarPuntaje)
        }

        const lostLive = () => {
            LIVES[lives - 1].removeClass("fas")
            LIVES[lives - 1].addClass("far")
            lives--;
        }

        for (let i = 0; i < 1000; i++) {

            randomPositionX = Math.floor(Math.random() * (19 - 0 + 1) + 0)
            randomPositionY = Math.floor(Math.random() * (19 - 0 + 1) + 0)

            $("#" + randomPositionX + "-" + randomPositionY).css("background-color", "blue")

            $("#" + randomPositionX + "-" + randomPositionY).on("mouseenter", sumarPuntaje)



            await timer(waitTime)
            waitTime -= 10;
            if (!hovered) lostLive()

            $("#" + randomPositionX + "-" + randomPositionY).off("mouseenter", sumarPuntaje)
            $("#" + randomPositionX + "-" + randomPositionY).css("background-color", SQUARE_DEFAULT_COLOR)
            hovered = false;



            if (lives == 0) {
                SCORE.css("color", "red")
                isPlaying = false;
                return
            }
        }
    }



    PLAY_BUTTON.click(play)

})