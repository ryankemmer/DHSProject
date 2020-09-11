function renderQuestion(userID, question){

    var startTime = new Date().getTime(); 

    d3.select(".activity").html("")
    d3.select(".activitypage .activity").append('div').attr("class", "image1")
    d3.select(".activitypage .activity").append('div').attr("class", "image2")

    let svgimagewidth = "100%"
    let divWidth = d3.select('.activity').node().offsetWidth
    image1width = divWidth / 6
    image1height = divWidth / 6
    image2width = divWidth
    image2height = divWidth/3

    //
    //IMAGE 1
    //
    
    let svg4image1 = d3.select('.image1').append('svg')
        .attr("width", svgimagewidth)
        .attr("height", image1height)

        let g4image1 = svg4image1.append("g")
            .attr("class", "g4image1")

        let img1 = g4image1.append("image")
            .attr('xlink:href', "/images/activity/bat-" + question + ".gif")
            .attr("x", image1width * 2)
            .attr("y", 2)
            .attr("width", image1width)
            .attr("height", image1height)
    
    //
    //IMAGE 2
    //

    let svg4image2 = d3.select('.image2').append('svg')
        .attr("width", svgimagewidth)
        .attr("height", image2height)

        let g4image2 = svg4image2.append("g")
            .attr("class", "g4image2")
        

        let img2 = g4image2.append("image")
            .attr('xlink:href', "/images/activity/bat-" + question + ".png")
            .attr("x", 0)
            .attr("y", 2)
            .attr("width", image2width)
            .attr("height", image2height)

    
    //
    //Button
    //

    d3.select(".btn.btn-success.nextBtn").on("click", function () {
        var endTime = new Date().getTime();
        var timeSpent = endTime - startTime;
        rating = document.getElementById("rating").value
        sendData(userID, picture, timeSpent, rating)
    })
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