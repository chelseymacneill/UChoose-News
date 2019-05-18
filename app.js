$(document).ready(function()  {
    
    
    
    // Global Variables 
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    
    var topicArray = [];
    //var topicArrayFinal = [];
    var topicName = " "
    var filterArray = [];
    //var filterArrayFinal = [];
    var filterName = " ";
    var page = 1;
    
    
    
    
    // Initializing Firebase real time database
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    
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
    
    // Weblink to Firebase 
    // https://uchoosenews-c7c3a.firebaseio.com/
    
    // Functions 
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    
    // Function that calls the Google News API and displays them in the UI
    function displayingArticles() {
        // Build the combined URL 
        var apiKey = 'a5d3ce7509aa44c08d88ab9be804d0fb'
        
        // default q 
        country = 'us' 
        
        // text manipulation for the topic array
        for (var i = 0; i < topicArray.length -1 ; i++) {
            topicArrayFinal = topicArray[i] + ' AND ' + topicArray[topicArray.length -1]
            console.log('Topic Array' + topicArrayFinal)
        };
        
        // text manipulation for the filter array
        for (var i = 0; i < filterArray.length -1 ; i++) {
            var filterArrayFinal = filterArray[i] + ' OR ' + filterArray[filterArray.length -1]
            //return filteredTopics
            console.log('filter Array' + filterArrayFinal)
        };
        
        // Logging for testing
        console.log('filter length before ' + filterArrayFinal.length)
        console.log('topic length before' + topicArrayFinal.length)
        
        // Building the URL based on user choices
        // SPACES ARE INTENTIONAL AND IMPORTANT in the QUERY URL!!
        if (topicArrayFinal.length > 0 && filterArrayFinal.length > 0) {
          queryURL = 'https://newsapi.org/v2/everything?q=' + topicArrayFinal +   ' NOT (' + filterArrayFinal + ') &page=' + page + '&language=en' + '&apiKey=' + apiKey
           console.log('1' + queryURL)
        } else if (topicArrayFinal.length === 0 && filterArrayFinal.length > 0) {
            queryURL = 'https://newsapi.org/v2/everything?q=' + topicArrayFinal +   ' NOT (' + filterArrayFinal + ') &page=' + page + '&language=en' + '&apiKey=' + apiKey
            console.log('2' + queryURL)
        } else if  (topicArrayFinal.length > 0 && filterArrayFinal.length === 0) {
            queryURL = 'https://newsapi.org/v2/everything?q=' + topicArrayFinal +   ' NOT (' + filterArrayFinal + ') &page=' + page + '&language=en' + '&apiKey=' + apiKey
            console.log('3'+ queryURL)
        } else if (topicArrayFinal.length === 0 && filterArrayFinal.length === 0) {
            // Just show them trending stories for the US 
            queryURL = 'https://newsapi.org/v2/top-headlines?country=' + country +  '&page=' + page + '&apiKey=' + apiKey 
            console.log('4'+ queryURL)
        } else console.log('you broke it')
        
        // Logging for testing
        console.log('filter length after ' + filterArrayFinal.length)
        console.log('topic length after' + topicArrayFinal.length)
        
        
        
        
        //API Call to Google News API
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
                
                
                // Loops through the response and appends them to the UI
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
                    
                    // Buckets the results from the score into positive, neutral, or negative sentiment buckets and displays them in the UI
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
                    
                    // Calls the analyzeSentiment function and passes content from the Google API call to it
                    analyzeSentiment(response.articles[i].content, callback);
                    
                }
                // Advances the page pulled from Google News API so it doesn't just pull the same articles over and over
                page += 1;
            };
        })
    };
    
    // Function for Calling the Call Google NLP API
    function analyzeSentiment(content, callback) {
        
        
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
    };
    
    // On Click Function Calls
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    
    // Topic Array
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
        console.log('topic array' + topicArray.sort());
    });
    
    // Filter Array
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
        console.log('filter Array' + filterArray.sort());
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
            console.log('topics already added' + topicssAlreadyAdded)
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
            console.log('filters already added' + filtersAlreadyAdded)
        }
    });
    
    $("#clear-newsfeed-button").click(function(e) {
        $("#MainDisplay").empty();
    });
    $("#reset-all-buttons").click(function() {
        $(".list-group-item-action").removeClass("list-group-item-success");
        $(".list-group-item-action").removeClass("list-group-item-danger");
    });
    
    // On click of submit button have the news articles displayed
    $("#filtered-news-button").on('click', displayingArticles); 
    
    // On click of submit button have the news articles displayed
    $("#filtered-news-button").on('click', displayingArticles);
    
    // Save my settings button stores the users name once its clicked
    $("#save-my-settings").on("click", function() {
        
        
        var username = $('#username').val().trim()
        
        localStorage.setItem('username', username)
        
        var user = localStorage.getItem("username");
        var ref = '/' + user
        console.log('nailedit)')
        // **** Store Click Data to Firebase in a JSON property called clickCount *****
        // **** Note how we are using the Firebase .set() method ****
        // **** .ref() refers to the path you want to save your data to
        // **** Since we left .ref() blank, it will save to the root directory
        database.ref(ref).set({
            filterArray: filterArray
        });
    });
    
}); // clousure to document on ready 



