$(document).ready(function()  {
    
    // Global Variables 
    // =============================================================================
    
    
    function displayingArticles() {
        // country (optional)
        country = 'us'
        // Registered API call 
        var apiKey = 'a5d3ce7509aa44c08d88ab9be804d0fb'
        
        
        // Query to pass to the API call 
        // top headlines 'https://newsapi.org/v2/top-headlines?q='
        // everything  https://newsapi.org/v2/everything?
        
        
        
        // Build the combined URL 
        
        // default q 
        country = 'us'
        // main topic of interest
        var main = 'Jeff Bezos'    // will become user input
        
        // subtopic of interest
        var sub1 = '' // will become user input
        
        // main topic of disinterest
        var mainNot = 'space' // will become user input
        
        // subtopic of disinterest
        // var sub1Not = //will become user input
        
        // SPACES ARE INTENTIONAL AND IMPORTANT!!
        
        var queryURL = ''
        
        // Building the URL based on user choices
        if (main && mainNot) {
            queryURL = 'https://newsapi.org/v2/everything?q=' + main +   ' NOT (' + mainNot + ') &apiKey=' + apiKey 
        } else queryURL = 'https://newsapi.org/v2/top-headlines?country=' + country+  '&apiKey=' + apiKey 


        console.log(queryURL)
        
        //API Call 
        $.ajax({
            url : queryURL,
            method : "GET"
        }).then (function(response){
            console.log(response)
            
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
            }
        });
    }
    
    // Function calls
    // ====================================================
    
    // On click of submit button have the news articles displayed
    $("#filtered-news-button").on('click', displayingArticles);
    
}); // clousure to document on ready 