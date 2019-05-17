$(document).ready(function()  {
    
    
    // Global Variables
    var filterArray = [];
    var filterName = " ";
    var page = 1;
    
    function displayingArticles() {
        // Build the combined URL 
        var apiKey = 'a5d3ce7509aa44c08d88ab9be804d0fb'
        
        // default q 
        country = 'us' 
        
        // main topic of interest
        var mainTopic = 'Alabama'    // will become user input
        
        // Array that holds topic/s of disinterest
        // Should this be wrapped in a function
        
        // In class manual version of 
        /*var filteredTopicsRaw = ['Impeach', 'Crazy']; // will become user input
        var filteredTopics = [];
        
        for (var i = 0; i < filteredTopicsRaw.length -1 ; i++) {
            filteredTopics = filteredTopicsRaw[i] + ' OR ' + filteredTopicsRaw[filteredTopicsRaw.length -1]
            //return filteredTopics
        };*/
        
        //console.log(filterArray)
        
        
        // Building the URL based on user choices
        
        // Can have a main topic only
        // Can have an empty main topic 
        // Can have filtered topic from 1 to as many as you like
        // Can have empty filter 
        // SPACES ARE INTENTIONAL AND IMPORTANT in the QUERY URL!!
        if (mainTopic && filterArray.length >= 1) {
            queryURL = 'https://newsapi.org/v2/everything?q=' + mainTopic +   ' NOT (' + filterArray + ') &page=' + page + '&language=en' + '&apiKey=' + apiKey
            console.log('1' + queryURL)
        } else if (!mainTopic && filterArray.length >= 1) {
            queryURL = 'https://newsapi.org/v2/everything?q= NOT (' + filterArray + ')&page=' + page + '&apiKey=' + apiKey
            console.log('2' + queryURL)
        } else if  (!mainTopic && filterArray.length === 0) {
            // Just show them trending stories for the US 
            queryURL = 'https://newsapi.org/v2/top-headlines?country=' + country +  '&page=' + page + '&apiKey=' + apiKey 
            console.log('3'+ queryURL)
        } else if (mainTopic && filterArray.length === 0) {
            queryURL = 'https://newsapi.org/v2/everything?q=' + mainTopic +  '&page=' + page + '&language=en' + '&apiKey=' + apiKey
            console.log('4'+ queryURL)
        } else console.log('you broke it')
        console.log('filter lenght' + filterArray.length)
        console.log(filterArray)
        
        
        //API Call 
        $.ajax({
            url : queryURL,
            method : "GET"
        }).then (function(response){
            
            console.log(response)
            console.log(queryURL)
            
            // Returns an article for 
            for (var i = 0; i < 10; i++) {
                
                // Creating a div to hold the title
                var articles = $("<div id='articles'>");
                
                // Storing the title of the article 
                var pTitle = $("<p>").text("Title: " + response.articles[i].title)
                console.log(response.articles[i].title)
                
                // Displaying the title
                articles.append(pTitle)
                
                // Adding the URL for the article
                var pLink = $("<p>").text("Link to Article:" + response.articles[i].url)
                
                //Displaying the URL 
                articles.append(pLink)
                
                // Append the built div to the page
                $("#MainDisplay").append(articles);
                const newelem = articles;
                
                // const callback = (score) => { 
                //     console.log(newelem.attr('id') + ' score: ' + score); 
                //     newelem.append($(`<p>${score}</p>`));
                // }
                
                const callback = (score) => {
                    
                    if (score > 0) {
                        console.log("Positive");
                        
                        var positive = $("<div>").addClass('mt-2 alert alert-success').text("This article has an overall positive tone.");
                        
                        // newelem.append($("<img src='images/positive.jpg' width='60px'/>"));
                        newelem.append($(positive));
                    }
                    else if (score < 0) {
                        console.log("Negative");
                        
                        var negative = $("<div>").addClass('mt-2 alert alert-danger').text("This article has an overall negative tone.");
                        
                        // newelem.append($("<img src='images/negative.jpg' width='60px'/>"));
                        newelem.append($(negative));
                    }
                    else {
                        console.log("Neutral");
                        
                        var neutral = $("<div>").addClass('mt-2 alert alert-warning').text("This article has an overall neutral tone.");
                        
                        // newelem.append($("<img src='images/neutral.jpg' width='60px'/>"));
                        newelem.append($(neutral));
                    };
                    console.log(newelem.attr('id') + ' score: ' + score);
                    // newelem.append($(`<h5>${score}</h5>`));
                }
                
                // What is this hotness?? 
                analyzeSentiment(response.articles[i].content, callback);
                
            }
            page += 1;
        });
    };
    
    // Calls the Google NLP API 
    function analyzeSentiment(content, callback) {
        
        //API Call Google NLP API
        $.ajax({
            type: "POST",
            url: "https://language.googleapis.com/v1/documents:analyzeSentiment?key=AIzaSyCGXL4FwDeO8GVzYxFpG3SDc9rSYAICIbQ",
            contentType: "application/json; charset=utf-8",
            data:
            JSON.stringify({
                "document": {
                    "type": "PLAIN_TEXT",
                    "language": "en",
                    "content": content,
                },
                "encodingType": "UTF8"
            }),
            success: function (_result) {
                
                if (_result) {
                    console.log("hooray")
                } else {
                    console.log('ERROR');
                }
            },
            
            error: function (_result) {
                
            }
            
        }).done((data) => callback(JSON.stringify(data.documentSentiment.score)));
    }
    // Buttons 
    // ====================================================
    
    // Changes button color to red on click, and back to gray on additional click.
    $(document).on('click', '.list-group-item.list-group-item-action', function(){
        // Toggles between having the following class and not having it. Class causes buttons to be colored red.
        $(this).toggleClass("list-group-item-danger");
        
        // The following code pushes as well as removes the id of each button from an array
        filterName = $(this).attr("id");
        let index = filterArray.indexOf(filterName);
        if (index >= 0) {
            filterArray.splice(index, 1);
        } else {
            filterArray.push(filterName);
        }
        console.log(filterArray.sort());
    });
    
    // Appends a custom button to the default list of buttons. 
    // Will not append new custom button if the input field is blank. Will not append previously added custom button.
    alreadyAdded = [];
    $( "#custom-filter" ).click(function() {
        console.log('this')
        var customFilter = $("#custom-filter-input").val();
        if (customFilter === "" || (alreadyAdded.indexOf(customFilter) !== -1)) {
            console.log("Will not input blank field. Will not repeat last added custom filter.");
        } else {
            $("<a>" + customFilter + "</a>").appendTo("#filters").attr('id', customFilter).addClass("list-group-item list-group-item-action");
            alreadyAdded.push(customFilter);
            
            console.log(alreadyAdded)
        }
    });
    
    // Function calls
    // ====================================================
    
    // On click of submit button have the news articles displayed
    $("#filtered-news-button").on('click', displayingArticles);
    
    $("#clear-newsfeed-button").click(function(e) {
        $("#MainDisplay").empty();
    });
    
    // Adding Firebase
    
    // Your web app's Firebase configuration
    //Config
    const firebaseConfig = {
        apiKey: "AIzaSyChB3IDp6UAq-V_TP4GsPpw0CxpRyXiYT0",
        authDomain: "uchoosenews-c7c3a.firebaseapp.com",
        databaseURL: "https://uchoosenews-c7c3a.firebaseio.com",
        storageBucket: "uchoosenews-c7c3a.appspot.com",
    };
    
    
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    
    // Get a reference to the database service
    var database = firebase.database();
    
    
    
    // Initializing our click count at 0
    
    
    // On Click
    
}); // clousure to document on ready 

$("#save-my-settings").on("click", function() {
   

    console.log('nailedit)')
    // **** Store Click Data to Firebase in a JSON property called clickCount *****
    // **** Note how we are using the Firebase .set() method ****
    // **** .ref() refers to the path you want to save your data to
    // **** Since we left .ref() blank, it will save to the root directory
    database.ref().set({
        'filterArray': 'filterArray'
    });
});

