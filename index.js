//Timer promise used in play() async function
const timer = ms => new Promise(res => setTimeout(res, ms))
let isPlaying = false;


$(document).ready(function () {
    //jQuery html items
    const MAIN = $("#playArea")
    const SCORE = $("#score");
    const LIVES = [$("#live1"), $("#live2"), $("#live3")];
    const PLAY_BUTTON = $(".fa-play-circle");
    const EASY_BUTTON = $("#easy");
    const MEDIUM_BUTTON = $("#medium");
    const HARD_BUTTON = $("#hard");
    const HIGHEST_SCORE = $("#highestScore");

    //Sounds
    const LOST_LIVE_SOUND = new Audio("Resources/lose.mp3");
    const GAMEOVER_SOUND = new Audio("Resources/game-over.wav");
    const POINT_SOUND = new Audio("Resources/point.mp3");
    const GAME_START_SOUND = new Audio("Resources/game-start.wav");

    //maxScore array sync with localStorage
    let maxScore = new Array(3).fill(0);
    if (localStorage.getItem("maxScore") != null) {
        maxScore = JSON.parse(localStorage.getItem("maxScore"))
        console.log("Se importo el puntaje")
    }

    //some variables
    let waitTime = 1000;
    let selectedDificulty = 1;

    HIGHEST_SCORE.text("Highest Score: " + maxScore[selectedDificulty])


    //Difficulty buttons behavior
    EASY_BUTTON.click(() => {
        waitTime = 2000
        MEDIUM_BUTTON.removeClass("selectedDificulty")
        HARD_BUTTON.removeClass("selectedDificulty")
        EASY_BUTTON.addClass("selectedDificulty")
        POINT_SOUND.play()
        selectedDificulty = 0;
        HIGHEST_SCORE.text("Highest Score: " + maxScore[selectedDificulty])

    })
    MEDIUM_BUTTON.click(() => {
        waitTime = 1500
        MEDIUM_BUTTON.addClass("selectedDificulty")
        EASY_BUTTON.removeClass("selectedDificulty")
        HARD_BUTTON.removeClass("selectedDificulty")
        POINT_SOUND.play()
        selectedDificulty = 1;
        HIGHEST_SCORE.text("Highest Score: " + maxScore[selectedDificulty])
    })
    HARD_BUTTON.click(() => {
        waitTime = 1000
        HARD_BUTTON.addClass("selectedDificulty")
        EASY_BUTTON.removeClass("selectedDificulty")
        MEDIUM_BUTTON.removeClass("selectedDificulty")
        POINT_SOUND.play()
        selectedDificulty = 2;
        HIGHEST_SCORE.text("Highest Score: " + maxScore[selectedDificulty])
    })


    //Grid rendering
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
            $("<div id='" + i + "-" + j + "' class='square' style='grid-area: " + i + "/" + j + "/" + (i + 1) + "/" + (j + 1) + "' />").appendTo(MAIN);
        }
    }


    //Main play() function
    async function play() {
        GAME_START_SOUND.play()
        SCORE.css("color", "black")
        SCORE.text("0")

        if (isPlaying) return

        let randomPositionX;
        let randomPositionY;
        let score = 0;
        let hovered = false;
        let lives = 3;
        isPlaying = true;
        let iWaitTime = waitTime;

        for (let i = 0; i < 3; i++) {
            LIVES[i].removeClass("far")
            LIVES[i].addClass("fas")
        }


        const sumarPuntaje = () => {
            score++;
            SCORE.text(score)
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
            $("#" + randomPositionX + "-" + randomPositionY).css("background-color", "red")
            $("#" + randomPositionX + "-" + randomPositionY).css("transform", "scale(1)")
            $("#" + randomPositionX + "-" + randomPositionY).css("z-index", "0")
            hovered = false;



            if (lives == 0) {
                SCORE.css("color", "red")
                isPlaying = false;
                GAMEOVER_SOUND.play()
                waitTime = iWaitTime;
                if (score > maxScore[selectedDificulty]) {
                    maxScore[selectedDificulty] = score
                    HIGHEST_SCORE.text("Highest Score: " + maxScore[selectedDificulty])
                    localStorage.setItem("maxScore", JSON.stringify(maxScore))
                }
                return
            }
        }
    }



    PLAY_BUTTON.click(play)

})