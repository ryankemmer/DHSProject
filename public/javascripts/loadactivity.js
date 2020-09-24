function renderQuestion(userID, question){

    var startTime = new Date().getTime(); 

    d3.select(".activitypage .imageactivity").append('div').attr("class", "image2")

    let svgimagewidth = "100%"
    let divWidth = d3.select('.imageactivity').node().offsetWidth
    let batdivWidth = d3.select('.bat').node().offsetWidth
    let sliderWidth = d3.select('#slider-simple').node().offsetWidth

    image1width = batdivWidth / 12
    image1height = batdivWidth / 12
    image2width = divWidth
    image2height = divWidth/2

    //
    //IMAGE 1
    //
    
    let svg4image1 = d3.select('.bat').append('svg')
        .attr("width", svgimagewidth)
        .attr("height", image1height +10) 

        let g4image1 = svg4image1.append("g")
            .attr("class", "g4image1")

        let img1 = g4image1.append("image")
            .attr('xlink:href', "/images/activity/bat-" + question + ".gif")
            .attr("x", (batdivWidth/ 2))
            .attr("y", 2)
            .attr("width", image1width)
            .attr("height", image1height)
    
    //
    //IMAGE 2
    //

    let svg4image2 = d3.select('.image2').append('svg')
        .attr("width", svgimagewidth)
        .attr("height", image2height+10 )

        let g4image2 = svg4image2.append("g")
            .attr("class", "g4image2")
        

        let img2 = g4image2.append("image")
            .attr('xlink:href', "/images/activity/bat-" + question + ".png")
            .attr("x", 0)
            .attr("y", 2)
            .attr("width", image2width)
            .attr("height", image2height)

    //
    //Slider
    //

    var data = [0, .25, .50, .75, 1];

    var sliderSimple = d3
        .sliderHorizontal()
        .min(d3.min(data))
        .max(d3.max(data))
        .width(sliderWidth/1.2)
        .tickFormat(d3.format('.0%'))
        .ticks(3)
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

    d3.select(".btn.btn-success.nextBtn").on("click", function () {
        var endTime = new Date().getTime();
        var timeSpent = endTime - startTime;
        nextPage(userID);
        //rating = document.getElementById("rating").value
        //sendData(userID, picture, timeSpent, rating)
    })
}


function nextPage(userID, question){

    new Promise((resolve, reject) => {
        $.ajax({
            url: 'activity/' + userID,
            type: "POST",
            success: resolve
        });
    });

}

function sendData(userID, picture, time, rating){
    //console.log("sending data")
    
    //url2go =  id + "/rankings"
    data2send = [time, rating]
            
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