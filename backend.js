document.getElementById("game").style.display = "none"; // Hides game interface
document.getElementById("results").style.display = "none" // Hides results interface
class HSLColor { // Class which holds 3 values for a color (h, s, l)
    constructor(h, s, l) {
        this.h = h;
        this.s = s;
        this.l = l;
    }
}
    
var currentColor = null; // variable which holds current color values in HSL
var buffer = 25;
var totalRounds = 10;
var totalScore = 0;
var roundNumber = 0;

function createNewColor() { // changes the color to a random color within certain "buffer" parameters
    var h = Math.round(360 * Math.random());
    var s = Math.round((50 - ((100 - 2 * buffer) * Math.random() + buffer)) * 0.8 + 50); // The formula accounts for a margin space between the circle
    var l = Math.round((50 - ((100 - 2 * buffer) * Math.random() + buffer)) * 0.8 + 50); // and the edge (so the circle is not overlapping with the edge of pf)
    currentColor = new HSLColor(h, s, l);
    console.log(currentColor);
}

function changePfColor() {
    createNewColor()
    document.getElementById("pf").style.background = "HSL(" + currentColor.h + ", " + currentColor.s + "%, " + currentColor.l + "%)";
    //document.getElementById("hslvalues").innerHTML = "HSL(" + currentColor.h + ", " + currentColor.s + "%, " + currentColor.l + "%)";
}

function changePfColorSpcfc(h, s, l) {
    document.getElementById("pf").style.background = "HSL(" + h + ", " + s + "%, " + l + "%)";
}

function resetPlayfield() {
    document.getElementById("circle").style.display = "none";
    document.getElementById("circleCorrect").style.display = "none";
    document.getElementById("circle").innerHTML = ""
    document.getElementById("circleCorrect").innerHTML = ""

    document.getElementById("nextRoundButton").style.display = "none";
    document.getElementById("resultsButton").style.display = "none";
    
    document.getElementById("roundScore").innerHTML = "Round Score: ";
    document.getElementById("totalScore").innerHTML = "Total: " + totalScore;
    
}


async function runRound() {
    roundNumber += 1;
    document.getElementById("roundNumber").innerHTML = "Round # " + roundNumber;
    resetPlayfield()
    await new Promise(r => setTimeout(r, 500));
    changePfColor()
    document.getElementById("pfText").innerHTML = ""
    document.getElementById("pfCntr").style.color = 'white';
    document.getElementById("pfText").style.display = "block"
    for(var i = 3; i > 0; i--) { // Countdown
        document.getElementById("pfText").innerHTML = i
    await new Promise(r => setTimeout(r, 1000));
    }
    document.getElementById("pfText").style.display = "none" // Numbers are removed
    changePfColorSpcfc(0, 100, 100) // Playfield turns white
    
    document.getElementById("circle").style.display = "block"; // Displays circle


    let circle = document.getElementById('circle');
    let circleCorrect = document.getElementById('circleCorrect');
    let pf = document.getElementById('pf');
    var scale = (1/2) * Math.sqrt(Math.pow(pf.offsetWidth, 2) + Math.pow(pf.offsetHeight, 2)); // Calculates the max allowable distance for more than one point (scoring is based off this value)
    pf.addEventListener('mousemove', usePosition)
    pf.addEventListener('click', finishRound)

     function getPosition(e) { // Returns x, y positions relative to the playfield
        var x = Math.floor(e.clientX - pf.getBoundingClientRect().left);
        var y = Math.floor(e.clientY - pf.getBoundingClientRect().top);
        return {x, y}
      }

       function usePosition(e) { // Uses mouse's position to determine color and posiion of circle
        var position = getPosition(e);
        //document.getElementById("posvalues").innerHTML = "X: " + position.x + "| Y: " + position.y;
        circle.style.left = e.pageX + 'px'; // Moves circle to cursor
        circle.style.top = e.pageY + 'px'; // Moves circle to cursor

        var tempS = (position.x / pf.offsetWidth) * (100 - 2 * buffer) + buffer;
        var tempL = ((pf.offsetHeight - position.y) / pf.offsetHeight) * (100 - 2 * buffer) + buffer;
        circle.style.background = "HSL(" + currentColor.h + ", " + tempS + "%, " + tempL + "%)"; // Changes color based on position
      }

        async function finishRound(e) {
          pf.removeEventListener('click', finishRound)
          pf.removeEventListener('mousemove', usePosition)
        var x = Math.floor(e.clientX - pf.getBoundingClientRect().left); // User Response
        var y = Math.floor(e.clientY - pf.getBoundingClientRect().top);
        var correctX = (currentColor.s - buffer) * (pf.offsetWidth / (100 - 2 * buffer)); // Correct Response
        var correctY = pf.offsetHeight - ((currentColor.l - buffer) * (pf.offsetHeight) / (100 - 2 * buffer));
        var dist = Math.sqrt(Math.pow(x - correctX, 2) + Math.pow(y - correctY, 2)); // Distance between the two Responses
        var score = Math.floor(100 - (dist / (scale / 100))); // Score
        
        if(score > 0)
        document.getElementById("roundScore").innerHTML = "Round Score: " + score;
        else {
            score = 1;
            document.getElementById("roundScore").innerHTML = "Round Score: " + score;
        }
        

        circleCorrect.style.left = (correctX + pf.getBoundingClientRect().left) + 'px'; // Positions the answer
        circleCorrect.style.top = (correctY + pf.getBoundingClientRect().top) + 'px'; // Positions the answer
        circleCorrect.style.background = "HSL(" + currentColor.h + ", " + currentColor.s + "%, " + currentColor.l + "%)"; // Sets the answer's color
        document.getElementById("circle").innerHTML = "You"
        document.getElementById("circleCorrect").innerHTML = "Actual"
        document.getElementById("circleCorrect").style.display = "block";
        document.getElementById("circle").style.display = "block"; // Shows the answer circle
        await new Promise(r => setTimeout(r, 500));

        for(var i = 1; i <= score; i++) { // Incrementing the totalScore display (visual effect)
            await new Promise(r => setTimeout(r, 10));
            document.getElementById("totalScore").innerHTML = "Total: " + (totalScore + i);
        }
        totalScore += score;

        await new Promise(r => setTimeout(r, 500));
        if(roundNumber < totalRounds) {
            document.getElementById("nextRoundButton").style.display = "block";
        }
        else {
            document.getElementById("resultsButton").style.display = "block";
        }
      }
      
    }

    function showResults() {
        document.getElementById("menu").style.display = "none";
        document.getElementById("game").style.display = "none";
        document.getElementById("results").style.display = "block";
        document.getElementById("resultScore").innerHTML = "Congratulations!\nYour Score is: " + totalScore;
        console.log("Here's your score: " + totalScore)
    }

 async function startGame() {
    document.getElementById("pfCntr").style.color = 'black';
    totalScore = 0;
    roundNumber = 0;
    document.getElementById("roundNumber").innerHTML = "Round # 1";
    resetPlayfield()
    document.getElementById("menu").style.display = "none";
    document.getElementById("results").style.display = "none";
    document.getElementById("game").style.display = "block";
    document.getElementById("pfText").style.display = "block";
    document.getElementById("pfText").innerHTML = "Ready?" // Pre Game
    await new Promise(r => setTimeout(r, 1000));
    runRound();
}