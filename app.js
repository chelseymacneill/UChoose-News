$(document).ready(function()  {
    
    // Global Variables 
    // =============================================================================
    
    
 function displayingArticles() {
     
        var q = "bitcoin"
        var apiKey = "a5d3ce7509aa44c08d88ab9be804d0fb"
        var queryURL = "https://newsapi.org/v2/everything?q=" + q + "&apiKey=" + apiKey
        
        
        $.ajax({
            url : queryURL,
            method : "GET"
        }).then (function(response){
            console.log(response)
            
            // Returns an article for 
            for (var i = 0; i < 25; i++) {
                
                // Creating a div to hold the movie
                var articles = $("<div id='articles'>");
                
                // Storing the title of the article 
                var pTitle = $("<p>").text("Title: " + response.articles[i].title)
                console.log(response.articles[i].title)
                // Displaying the title
                articles.append(pTitle)
                
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