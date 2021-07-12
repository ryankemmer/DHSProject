var timeText
var rotations = 0

function rotateElem(){

    var angle = ($('#myImg').data('angle') + 90) || 90;
    $('#myImg').css({'transform': 'rotate(' + angle + 'deg)'});
    $('#myImg').data('angle', angle);

    var angle = ($('#img01').data('angle') + 90) || 90;
    $('#img01').css({'transform': 'rotate(' + angle + 'deg)'});
    $('#img01').data('angle', angle);

}

// Mouse pointer location
var mouse_x = null;
var mouse_y = null;

var yC = 0;
var nC = 0;

function drawCanvas(imageSource) {
    imageObj = new Image();
    imageObj.onload = function () {
        ctx.drawImage(imageObj, 0, 0, imgWidth, imgHeight);
    };
    imageObj.src = imageSource;
    canvas.addEventListener('mousedown', mouseDown, false);
}

function mouseDown(e) {
    mouse_x = e.offsetX;
    mouse_y = e.offsetY;
    rect_width = 10;
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas
    ctx.drawImage(imageObj, 0, 0, imgWidth, imgHeight);
    // ctx.beginPath();
    // ctx.strokeStyle = 'red';
    // ctx.strokeRect(mouse_x - rect_width, mouse_y - rect_width, rect_width, rect_width);
    ctx.beginPath();
    ctx.arc(mouse_x, mouse_y, 10, 0, 2 * Math.PI);
    // Turn transparency on
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = 'red';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = 1.0;
    //Output (debug code)
    $('#output').html('Object Location (x, y): (' + mouse_x + ', ' + mouse_y + ')');
}


function renderQuestion(userID, sequence, duration) {
    exercise_img_src = "/images/4_1_2_Images/butterfly-" + sequence + ".png";
    if (duration > 0) {
        drawCanvas(exercise_img_src);
        document.getElementById("img2find").src = "/images/4_1_2_Images/butterfly-" + 14 + ".gif";
        document.getElementById("img2find").width = "100"

    } else {
        document.getElementById("canvas").style.visibility = "hidden";
        document.getElementById("imgText").innerHTML = "Times up! Submit your answer.";
        display.textContent = " 00:00";
    }

    var modal = document.getElementById("myModal");
    var modalImg = document.getElementById("img01");
    var canvas = document.getElementById("canvas");

    var w = window.innerWidth;

    // TODO: Add canvas in zoomed-in image
    canvas.ondblclick = function () {
        modal.style.display = "block";
        modalImg.src = exercise_img_src;
        modalImg.width = '75%';
    }

    var span = document.getElementsByClassName("close")[0];
    span.width = w / 2
    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }


    //
    //Slider
    //
    let sliderWidth = d3.select('#slider-simple').node().offsetWidth
    var data = [0, .25, .50, .75, 1];

    var sliderSimple = d3
        .sliderHorizontal()
        .min(d3.min(data))
        .max(d3.max(data))
        .width(sliderWidth / 1.2)
        .tickFormat(d3.format('.0%'))
        .ticks(9)
        .step(.1)
        .default(.5)
        .on('onchange', val => {
            d3.select('p#value-simple').text(d3.format('.0%')(val));
        });

    d3.select('div#slider-simple')
        .append('svg')
        .attr('width', sliderWidth)
        .attr('height', 70)
        .append('g')
        .attr('transform', 'translate(30,30)')
        .call(sliderSimple);

    d3.select('p#value-simple').text(d3.format('.0%')(sliderSimple.value()));

    //
    //Button
    //

    d3.select(".btn-outline-success").on("click", function () {

        var q1
        var q2
        var q3

        //
        //Get time
        //

        var timeLeft = document.getElementById("time").innerHTML
        console.log(timeLeft)

        timeLeft = timeLeft.substring(timeLeft.length - 2)
        timeLeft = parseInt(timeLeft)
        console.log(timeLeft)

        //var endTime = new Date().getTime();
        //var time = endTime - startTime;

        //
        //Question 1
        //

        var radio11 = document.getElementById('option11')
        var radio12 = document.getElementById('option12')

        if (radio11.classList.contains('active') && mouse_x != null && mouse_y != null) {
            q1 = 1
        } else if (radio12.classList.contains('active')) {
            q1 = 0

            //if answer is no, dont send x y data
            mouse_x = null
            mouse_y = null

        } else {
            q1 = -2
        }

        //
        //Question 2
        //


        q2 = document.getElementById("value-simple").innerHTML

        //
        //Question 3
        //

        var radio21 = document.getElementById('option21')
        var radio22 = document.getElementById('option22')

        if (radio21.classList.contains('active')) {
            q3 = 1
        } else if (radio22.classList.contains('active')) {
            q3 = 0
        } else {
            q3 = -2
        }


        sendData(userID, timeLeft, q1, q2, q3, mouse_x, mouse_y);

    })
}


function sendData(userID, time, q1, q2, q3, x, y) {
    console.log("sending data")

    url2go = userID + "/data"
    data2send = [time, q1, q2, q3, x, y]
    console.log("time: " + time + " q1: " + q1 + " q2: " + q2 + " q3: " + q3 + " object_loc: {" + x + ", " + y + "}");

    //add ajax function
    new Promise((resolve, reject) => {
        $.ajax({
            dataType: "json",
            url: url2go,
            type: "POST",
            data: JSON.stringify(data2send),
            success: resolve
        });
    });
}

function startTimer(duration, display, captionText, userID) {
    var timer = duration, minutes, seconds;
    var timeChange = setInterval(function () {
        if (--timer < 0) {
            //document.getElementById("submitButton").style.visibility = "hidden";
            //document.getElementById("errorText1").innerHTML = "Time is out! Changing to next question...";
            //document.getElementById("errorText2").innerHTML = "Time is out! Changing to next question...";

            clearInterval(timeChange)

            //setTimeout(sendFunc, 1000)

            document.getElementById("canvas").style.visibility = "hidden";
            document.getElementById("imgText").innerHTML = "Times up! Submit your answer.";
            display.textContent = " 00:00";

            var modal = document.getElementById("myModal");
            modal.style.display = "none";


            //function sendFunc(){
            //    sendData(userID, 0, -1,"-1%",-1)
            //    document.forms.item(0).submit()
            //}
            return
        } else {
            minutes = parseInt(timer / 60, 10)
            seconds = parseInt(timer % 60, 10);
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            display.textContent = minutes + ":" + seconds;
            captionText.innerHTML = "Time remaning: " + timeText;
            timeText = minutes + ":" + seconds;
        }

    }, 1000);


}
