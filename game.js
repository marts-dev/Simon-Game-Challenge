var UIController = (function(){
    var DOMStrings = {
        colorButton: ".btn",
        levelTitle: "#level-title",
    };

    return {
        updateLevel: function(level) {
            $(DOMStrings.levelTitle).text("Level " + level).removeClass("game-over");
        },
        getDomStrings: function() {
            return DOMStrings;
        },
        playSound: function(choice) {
            let audio = new Audio("sounds/" + choice + ".mp3");
            audio.play();
        },
        animateButton: function(color) {
            $("#" + color).addClass("pressed");
            setTimeout(function () {
                $("#" + color).removeClass("pressed");
              }, 200);
        },
        updateTitle: function() {
            $(DOMStrings.levelTitle).text("Game Over!\nPress any key to retry.").addClass("game-over");
        }
    };
})();

var gameController = (function (UICtrl) {
    var started = false;
    var gamePattern = [];
    var userInput = [];
    var currentLevel = 0;
    const buttonColors = ["red", "blue", "green", "yellow"];

    var setupEventListeners = function() {
        var DOM = UICtrl.getDomStrings();
        $(document).keydown(function() {
            if (started === false) {
                userInput = [];
                started = true;
                gamePattern = [];
                currentLevel = 0;
                generatePattern();
            }
        });

        $(DOM.colorButton).click(function() {
            if (started) {
                console.log($(this).attr("id"));
                UICtrl.playSound($(this).attr("id"));
                UICtrl.animateButton($(this).attr("id"));
                userInput.push($(this).attr("id"));
                checkUserInput($(this).attr("id"));
            }
        });
    }

    var randomNumber = function() {
        return Math.floor(Math.random() * 4);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    var generatePattern = async function() {
        //Add a color in gamePattern
        UICtrl.updateLevel(++currentLevel);
        gamePattern.push(buttonColors[randomNumber()]);
        console.log(gamePattern);
        for(var i = 0; i < gamePattern.length; i++) {
            UICtrl.playSound(gamePattern[i]);
            UICtrl.animateButton(gamePattern[i]);
            await sleep(500);
        }
    }

    var checkUserInput = async function(color) {
        if (color === gamePattern[userInput.length-1]) {
            console.log(gamePattern);
            console.log(userInput);
            if (gamePattern.length === userInput.length) {
                //go to next level
                userInput = [];
                await sleep(1000);
                generatePattern();
            }
        } else {
            UICtrl.playSound("wrong");
            gameOver();
        }
    }

    var gameOver = function(){
        started = false;
        UICtrl.updateTitle();
    }
    return {
        init:function () {
            console.log("Application started.");
            setupEventListeners();
        }
    };
})(UIController);

gameController.init();