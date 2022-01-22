const timer = ms => new Promise(res => setTimeout(res, ms))
let isPlaying = false;



$(document).ready(function () {
    const MAIN = $("#playArea")
    const SQUARE_DEFAULT_COLOR = "red";
    const SCORE = $("#score")
    const LIVES = [$("#live1"), $("#live2"), $("#live3")]
    const PLAY_BUTTON = $(".fa-play-circle")
    const LOST_LIVE_SOUND = new Audio("Resources/lose.mp3")
    const GAMEOVER_SOUND = new Audio("Resources/game-over.wav")
    const POINT_SOUND = new Audio("Resources/point.mp3")
    const GAME_START_SOUND = new Audio("Resources/game-start.wav")
    const EASY_BUTTON = $("#easy")
    const MEDIUM_BUTTON = $("#medium")
    const HARD_BUTTON = $("#hard")

    let waitTime = 1000;



    EASY_BUTTON.click(() => {
        waitTime = 2000
        MEDIUM_BUTTON.removeClass("selectedDificulty")
        HARD_BUTTON.removeClass("selectedDificulty")
        EASY_BUTTON.addClass("selectedDificulty")
        POINT_SOUND.play()
    })
    MEDIUM_BUTTON.click(() => {
        waitTime = 1500
        MEDIUM_BUTTON.addClass("selectedDificulty")
        EASY_BUTTON.removeClass("selectedDificulty")
        HARD_BUTTON.removeClass("selectedDificulty")
        POINT_SOUND.play()

    })
    HARD_BUTTON.click(() => {
        waitTime = 1000
        HARD_BUTTON.addClass("selectedDificulty")
        EASY_BUTTON.removeClass("selectedDificulty")
        MEDIUM_BUTTON.removeClass("selectedDificulty")
        POINT_SOUND.play()
    })



    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
            $("<div id='" + i + "-" + j + "' class='square' style='grid-area: " + i + "/" + j + "/" + (i + 1) + "/" + (j + 1) + "' />").appendTo(MAIN);
        }
    }


    async function play() {
        GAME_START_SOUND.play()
        SCORE.css("color", "black")
        SCORE.text("0")

        if (isPlaying) return

        let randomPositionX;
        let randomPositionY;
        let puntaje = 0;
        let hovered = false;
        let lives = 3;
        isPlaying = true;
        let iWaitTime = waitTime;

        for (let i = 0; i < 3; i++) {
            LIVES[i].removeClass("far")
            LIVES[i].addClass("fas")
        }


        const sumarPuntaje = () => {
            puntaje++;
            SCORE.text(puntaje)
            console.log(waitTime)
            hovered = true;
            POINT_SOUND.play()
            $("#" + randomPositionX + "-" + randomPositionY).css("background-color", "green")
            $("#" + randomPositionX + "-" + randomPositionY).css("transform", "scale(3)")
            $("#" + randomPositionX + "-" + randomPositionY).css("z-index", "123")
            $("#" + randomPositionX + "-" + randomPositionY).off("mouseenter", sumarPuntaje)
        }

        const lostLive = () => {
            LIVES[lives - 1].removeClass("fas")
            LIVES[lives - 1].addClass("far")
            lives--;
            LOST_LIVE_SOUND.play()
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
            $("#" + randomPositionX + "-" + randomPositionY).css("transform", "scale(1)")
            $("#" + randomPositionX + "-" + randomPositionY).css("z-index", "0")
            hovered = false;



            if (lives == 0) {
                SCORE.css("color", "red")
                isPlaying = false;
                GAMEOVER_SOUND.play()
                waitTime = iWaitTime;
                return
            }
        }
    }



    PLAY_BUTTON.click(play)

})