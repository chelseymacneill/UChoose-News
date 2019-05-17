$(document).ready(function()  {
    
    var topicArray = [];
    var topicName = " ";

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
            var articleContent = $("<p>").text(response.articles[i].content);

            var fullArticleNotice = $("<p>").text("Full article:").addClass("mb-0");
            // Creating a div to hold the title
            const elem = `<div id="article_${i}" class="card mb-5 pt-3 pl-3 pr-3 pb-1">`;
            var articles = $(elem);
            
            // Storing the title of the article 
            var pTitle = $("<h6>").text(response.articles[i].title)
            console.log(response.articles[i].title)
            // Displaying the title
            articles.append(pTitle)
        
            // Adding the URL for the article
            var pLink = $("<a>").text(response.articles[i].url).attr("href", response.articles[i].url).attr('target','_blank').addClass("mb-3");
            
            //Displaying the URL 
            
            articles.append(articleContent)
            articles.append(fullArticleNotice)
            articles.append(pLink)
            
            // Append the built div to the page
            $("#MainDisplay").prepend(articles);
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
            //
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
    $(document).on('click', '.topic', function(){
        // Toggles between having the following class and not having it. Class causes buttons to be colored red.
        $(this).toggleClass("list-group-item-success");
        // The following code pushes as well as removes the id of each button from an array
        topicName = $(this).attr("id");
         let index = topicArray.indexOf(topicName);
         if (index >= 0) {
             topicArray.splice(index, 1);
         } else {
             topicArray.push(topicName);
         }
         console.log(topicArray.sort());
    });
     // Changes button color to red on click, and back to gray on additional click.
    $(document).on('click', '.filter', function(){
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

    $(document).on('click', '.positive', function(){
        // Toggles between having the following class and not having it. Class causes buttons to be colored red.
        $(this).toggleClass("list-group-item-success");
        // The following code pushes as well as removes the id of each button from an array
    });

    $(document).on('click', '.neutral', function(){
        // Toggles between having the following class and not having it. Class causes buttons to be colored red.
        $(this).toggleClass("list-group-item-warning");
        // The following code pushes as well as removes the id of each button from an array
    });

    $(document).on('click', '.negative', function(){
        // Toggles between having the following class and not having it. Class causes buttons to be colored red.
        $(this).toggleClass("list-group-item-danger");
        // The following code pushes as well as removes the id of each button from an array
    });

      // Appends a custom button to the default list of buttons. 
      // Will not append new custom button if the input field is blank. Will not append previously added custom button.
      topicssAlreadyAdded = [];
      $( "#custom-topic" ).click(function() {
        var customTopic = $("#custom-topic-input").val();
        if (customTopic === "" || (topicssAlreadyAdded.indexOf(customTopic) !== -1)) {
             console.log("Will not input blank field. Will not repeat last added custom filter.");
        } else {
             $("<a>" + customTopic + "</a>").appendTo("#topics").attr('id', customTopic).addClass("list-group-item list-group-item-action topic");
             topicssAlreadyAdded.push(customTopic);
             $("#custom-topic-input").val('');
             console.log(topicssAlreadyAdded)
        }
    });
      filtersAlreadyAdded = [];
    $( "#custom-filter" ).click(function() {
        var customFilter = $("#custom-filter-input").val();
        if (customFilter === "" || (filtersAlreadyAdded.indexOf(customFilter) !== -1)) {
             console.log("Will not input blank field. Will not repeat last added custom filter.");
        } else {
             $("<a>" + customFilter + "</a>").appendTo("#filters").attr('id', customFilter).addClass("list-group-item list-group-item-action filter");
             filtersAlreadyAdded.push(customFilter);
             $("#custom-filter-input").val('');
             console.log(filtersAlreadyAdded)
        }
    });
    $("#clear-newsfeed-button").click(function(e) {
         $("#MainDisplay").empty();
    });
    $("#reset-all-buttons").click(function() {
         $(".list-group-item-action").removeClass("list-group-item-success");
         $(".list-group-item-action").removeClass("list-group-item-danger");
         $(".list-group-item-action").removeClass("list-group-item-warning");
    });
    // On click of submit button have the news articles displayed
    $("#filtered-news-button").on('click', displayingArticles);
 

}); // clousure to document on ready 
