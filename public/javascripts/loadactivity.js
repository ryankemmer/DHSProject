var timeText

function renderQuestion(userID, question){

    var startTime = new Date().getTime();

    document.getElementById("myImg").src = "/images/activity/bat-" + sequence + ".png";
    document.getElementById("img2find").src = "/images/activity/bat-" + sequence + ".gif";
    document.getElementById("img2find").width = "100"



    var modal = document.getElementById("myModal");
    var img = document.getElementById("myImg");
    var modalImg = document.getElementById("img01");

    var w = window.innerWidth;

    console.log('width: ', w)
    img.onclick = function(){
        modal.style.display = "block";
        modalImg.src = this.src;
        modalImg.width = w/2.5

      }
    var span = document.getElementsByClassName("close")[0];
    span.width = w/2
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
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
        .width(sliderWidth/1.2)
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

    d3.select(".subButton").on("click", function () {

        var time 
        var q1
        var q2
        var q3

        //
        //Get time
        //

        var endTime = new Date().getTime();
        var time = endTime - startTime;

        //
        //Question 1
        //

        var radio1 = document.getElementsByName('q1')

        if  (radio1[0].checked){
            q1 = 1
        } else if (radio1[0].checked){
            q1 = 0
        } else{
            q1 = -1
        }

        //
        //Question 2
        //


        q2 = document.getElementById("value-simple").innerHTML
        
        //
        //Question 3
        //

        var radio3 = document.getElementsByName('q3')

        if  (radio3[0].checked){
            q3 = 1
        } else if (radio3[1].checked){
            q3 = 0
        } else{
            q1 = -1
        }

        if (q1 != -1 && q3 != -1){
            sendData(userID, time, q1,q2,q3);
        }

    })
}


function sendData(userID, time, q1,q2,q3){
    console.log("sending data")
    
    url2go =  userID + "/data" 
    data2send = [time, q1, q2, q3]
    console.log(data2send)
            
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

function startTimer(duration, display, captionText, userID){
    var timer = duration, minutes, seconds;
    setInterval(function(){
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer %60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = minutes + ":" + seconds;
        captionText.innerHTML = "Time remaning: " + timeText;
        timeText = minutes + ":" + seconds;
        if (--timer < 0) {
            sendData(userID, 60000, -1,"-1%",-1)
            document.forms.item(0).submit()
            return
        }
    }, 1000);

} 