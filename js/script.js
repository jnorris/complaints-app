const API_KEY = "4kcktzofs9lgd2qs6orh5wxnd";
const APP_TOKEN = "VfD86P4U8LBH4MZI7WKthCXqD";

const $form = $("form");
const $numComplaints = $("#numComplaints");
const $main = $("main");
const $error = $("#error");
const $template = $("template").contents().filter("*");

let borough, numComplaints = 10;
let complaintData, complaintError;

$("form").on("click", "button", (event) => {
    event.preventDefault();
    borough = $(event.target).text();
    numComplaints = parseInt($numComplaints.val());
    if (isNaN(numComplaints)) numComplaints = 10;
    search();
});

$("main").on("click", "button.showResponse", (event) => {
    $(event.target).closest(".complaint").find(".response").toggle();
});

function search() {
    $.ajax({
        url: "https://data.cityofnewyork.us/resource/erm2-nwe9.json",
        type: "GET",
        data: {
            "agency": "NYPD",
            "borough": borough.toUpperCase(),
            "$limit": numComplaints,
            "$$app_token": APP_TOKEN
        }
    }).then(function(data) {
        //alert("Retrieved " + data.length + " records from the dataset!");
        console.log(data);
        complaintData = data;
        complaintError = null;
        render();
    }, (error) => {
        console.log(error);
        complaintData = null;
        complaintError = error;
    });
    
}

function render() {
    $main.empty();
    $error.empty();
    if (complaintError) {
        $error.text(complaintError);
    }
    if (complaintData) {
        for (let i = 0; i < complaintData.length; ++i) {
            const row = complaintData[i];
            const $row = $template.clone().remove("id");
            $row.attr("data-row", i);
            $row.find(".descriptor").text(row.descriptor);
            $row.find(".response").text(row.resolution_description);
            $main.append($row);
        }
    }
}

// for testing
borough = "Manhattan";
numComplaints = 10;
search();