//survey template
Survey
    .StylesManager
    .applyTheme("default");
let json = {
    questions: [{
            name: "age",
            type: "text",
            title: "What is your age?",
            placeHolder: "",
            isRequired: false
        },
        {
            type: "radiogroup",
            hasOther: false,
            isRequired: false,
            name: "gender",
            colCount: 1,
            title: "What is your gender?",
            choices: [{
                    value: "Male",
                    text: "Male"
                },
                {
                    value: "Female",
                    text: "Female"
                },
                {
                    value: "Other",
                    text: "Other"
                }
            ]
        },
        {
            type: "radiogroup",
            hasOther: false,
            isRequired: false,
            name: "education",
            colCount: 1,
            title: "What is your current level of education?",
            choices: [{
                    value: "Less than High School",
                    text: "Less than High School"
                },
                {
                    value: "High School/GED",
                    text: "High School/GED"
                },
                {
                    value: "Some College",
                    text: "Some College"
                },
                {
                    value: "2 year degree",
                    text: "2 year degree"
                },
                {
                    value: "4 year degree",
                    text: "4 year degree"
                },
                {
                    value: "Master's",
                    text: "Master's"
                },
                {
                    value: "Doctoral",
                    text: "Doctoral"
                },
                {
                    value: "Professional (MD, JD, etc.)",
                    text: "Professional (MD, JD, etc.)"
                },
            ]
        },
        {
            name: "major",
            type: "text",
            title: "If you have been or are enrolled in a post high school institution, what is your major?",
            placeHolder: "",
            isRequired: false
        },
        {
            type: "radiogroup",
            hasOther: false,
            isRequired: false,
            name: "employed",
            colCount: 1,
            title: "Are you currently employed?",
            choices: [{
                    value: "Yes",
                    text: "Yes"
                },
                {
                    value: "No",
                    text: "No"
                },
            ]
        },
        {
            name: "job",
            type: "text",
            title: "If yes to #5, what is your job title?",
            placeHolder: "",
            isRequired: false
        },
        {
            type: "radiogroup",
            hasOther: false,
            isRequired: false,
            name: "nativeSpeaker",
            colCount: 1,
            title: "Are you a native English speaker?",
            choices: [{
                    value: "Yes",
                    text: "Yes"
                },
                { value: "No", 
                text: "No" },
            ]
        },
        {
            type: "text",
            isRequired: false,
            name: "nativeLanguage",
            placeHolder: "",
            title: "If No to #7, then what is your native language?",
        },
        {
            type: "radiogroup",
            hasOther: false,
            isRequired: false,
            name: "stayInUS",
            colCount: 1,
            title: "How long have you lived in the United States?",
            choices: [{
                    value: "Native (all my life)",
                    text: "Native (all my life)"
                },
                {
                    value: "Less than 1 year",
                    text: "0 - 1 years"
                },
                {
                    value: "1 year",
                    text: "1 - 2 years"
                },
                {
                    value: "2 years",
                    text: "2 - 3 years"
                },
                {
                    value: "3 years",
                    text: "3 - 4 years"
                },
                {
                    value: "4 years",
                    text: "4 - 5 years"
                },
                {
                    value: "Greater than 5 years",
                    text: "Greater than 5 years"
                },
            ]
        },
        {
            type: "radiogroup",
            //hasOther: true,
            isRequired: false,
            name: "estimation",
            colCount: 1,
            title: "Have you previously participated on estimation tasks on MTurk?",
            //otherText: 'If Yes, please specify the activity.',
            choices: [{
                    value: "Yes",
                    text: "Yes"
                },
                { value: "No", 
                text: "No" },
            ]
        },
        {
            type: "text",
            name: "specify",
            title: "If Yes to #9, please specify the activity.",
            placeHolder: "",
            isRequired: false

        }
    ],
    // completedHtml: "**Thank you for completing the survey. Please click the 'Finish' button to get your key!**"
}

function getKey() {
    return Math.random().toString(36).substring(7);
}

function startFromSurvey(userID) {

    $(".debrief").show()

    let survey = new Survey.Model(json);

    survey
        .onComplete
        .add(function (result) {
            document
                .querySelector('#surveyResult')
                .textContent = "Result JSON:\n" + JSON.stringify(result.data, null, 3);
        });

    $("#surveyElement").Survey({
        model: survey
    });


    survey.onComplete.add(function (result) {

        $(".intro").hide()

        let key = getKey()
        //console.log("key ", key)

        let userDemographic = JSON.stringify(result.data, null, 3);
        //console.log("userDemographic ", userDemographic)

        url2go = userID + "/sendSurvey"

        new Promise((resolve, reject) => {
            $.ajax({
                dataType: "json",
                url: url2go,
                type: "POST",
                data: {'userDemographic': userDemographic, 'key': key},
                success: function(){
                    d3.select('#debrief').html("The experiment that you have just participated in is part of an Arizona State University project that seeks to understand how ranking estimates and numerical estimates from multiple users can be aggregated to perform challenging estimation tasks. If you have any questions, comments, or concerns regarding this experiment please do not hesitate to contact us at o.are.lab@gmail.com. Thank you for your participation and for your patience.")
                    d3.select("#key2show").html("Code for MTurk: ")
                    d3.select('#key').html(key)
                    resolve
                },
            })
        });


    })

};