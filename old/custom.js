
let audience_score_enabled = false;

let score = 0;

let choiceMade = false;

function getRandomMovies() {
    const randomIndexes = [];
    while (randomIndexes.length < 2) {
        const randomIndex = Math.floor(Math.random() * movies.length);
        if (!randomIndexes.includes(randomIndex)) {
            randomIndexes.push(randomIndex);
        }
    }
    console.log([movies[randomIndexes[0]], movies[randomIndexes[1]]])
    return [movies[randomIndexes[0]], movies[randomIndexes[1]]];
}

function displayRandomMovies() {
    // Get two random movies
    const [randomMovie1, randomMovie2] = getRandomMovies();

    // Update movie titles
    document.getElementById('movieTitle1').innerText = randomMovie1.title;
    document.getElementById('movieTitle2').innerText = randomMovie2.title;

    // Update movie posters
    document.getElementById('moviePoster1').src = randomMovie1.posterUrl;
    document.getElementById('moviePoster2').src = randomMovie2.posterUrl;
}

import movieAPI from './apikey.js';
async function fetchMoviePoster(movieTitle) {
    const apiKey = movieAPI; // Replace 'YOUR_API_KEY' with your actual API key from TMDB
    const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieTitle)}`;
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Check if any movies were found
        if (data.results.length > 0) {
            // Assuming the first result is the most relevant one
            const movie = data.results[0];
            const posterPath = movie.poster_path;
            
            if (posterPath) {
                // Construct the full URL for the poster
                return `https://image.tmdb.org/t/p/w500/${posterPath}`;
            } else {
                return 'Poster not available';
            }
        } else {
            return 'Movie not found';
        }
    } catch (error) {
        console.error('Error fetching movie poster:', error);
        return null;
    }
}

async function preloadMoviePosters() {
    for (const movie of movies) {
        const posterUrl = await fetchMoviePoster(movie.title);
        movie.posterUrl = posterUrl;
    }
}


function displayPopup() {
    document.getElementById('popupOverlay').style.display = 'block';
}

function hidePopup() {
    document.getElementById('popupOverlay').style.display = 'none';
}

document.getElementById('playBtn').addEventListener('click', function() {
    hidePopup();

});


preloadMoviePosters().then(() => {
    // Introduce a delay of 2 seconds before hiding the loading overlay and showing the content
    setTimeout(() => {
        // Hide loading overlay and show content
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('content').style.display = 'block';
    }, 2000); // 2000 milliseconds = 2 seconds
    // Call displayRandomMovies to initially display two random movies
displayRandomMovies();

});

// Add event listeners to each movie container
document.getElementById('movie1').addEventListener('click', function() {
    checkUserChoice(0); // 0 represents the index of the first movie
});

document.getElementById('movie2').addEventListener('click', function() {
    checkUserChoice(1); // 1 represents the index of the second movie
});


function checkUserChoice(userChoiceIndex) {
    const [movie1, movie2] = getRandomMovies();
    
    let scoreToCompare1, scoreToCompare2;
    
    // Determine which score to compare based on audience_score_enabled
    if (audience_score_enabled) {
        scoreToCompare1 = movie1.audience_score;
        scoreToCompare2 = movie2.audience_score;
    } else {
        scoreToCompare1 = movie1.critic_score;
        scoreToCompare2 = movie2.critic_score;
    }

    // Compare scores with the user's choice
    if (scoreToCompare1 > scoreToCompare2 && userChoiceIndex === 0) {
        // User is correct
        score++;
        document.getElementById('nextbutton').style.visibility = 'visible'; // Reveal the "Try Again" button
    } else if (scoreToCompare2 > scoreToCompare1 && userChoiceIndex === 1) {
        // User is correct
        score++;
        document.getElementById('nextbutton').style.visibility = 'visible'; // Reveal the "Try Again" button

    } else {
        // User is wrong
        score = 0;
        document.getElementById('tryAgainBtn').style.visibility = 'visible'; // Reveal the "Try Again" button
    }

    // Update the score displayed on the page
    document.getElementById('score').innerText = score;

    // Populate the score fields with the scores of the movies
    document.getElementById('movie1Score').innerText = scoreToCompare1;
    document.getElementById('movie2Score').innerText = scoreToCompare2;
}


// Add event listener to the toggle switch
document.getElementById('audienceScoreToggle').addEventListener('change', function() {
    audience_score_enabled = this.checked; // Update audience_score_enabled based on the toggle switch state

    if (audience_score_enabled) {
        // Update the game to use audience scores
        console.log("Audience score enabled");
    } else {
        // Update the game to use critic scores
        console.log("Critic score enabled");
    }
});

window.onload = displayPopup;

document.addEventListener("DOMContentLoaded", function() {
    const toggleSwitch = document.getElementById('audienceScoreToggle');
    const audienceText = document.querySelector('.headersection h1');
    const audienceSubText = document.querySelector('.headersection h2 em');

    toggleSwitch.addEventListener('change', function() {
        if (this.checked) {
            // Audience score enabled
            audienceText.textContent = "Which of these Best Picture Nominees is preferred by General Audiences?";
            audienceSubText.textContent = "The general audience score for each film is an aggregate from iMDB, RT Audience Score and MC Audience Score";
        } else {
            // Audience score disabled
            audienceText.textContent = "Which of these Best Picture Nominees is preferred by Critics?";
            audienceSubText.textContent = "The critic score for each film is an aggregate from Letterboxd, RT Critic Score and MC Critic Score";
        }
    });
});

document.getElementById('tryAgainBtn').addEventListener('click', function() {
    score = 0;
    document.getElementById('score').innerText = score;
    document.getElementById('tryAgainBtn').style.visibility = 'hidden'; // Hide the "Try Again" button
    const movieContainers = document.querySelectorAll('.movie');
    
    // Apply the hidden class to initiate the scaling animation for each movie container
    movieContainers.forEach(function(container) {
        container.classList.add('hidden');
        
        // After a short delay, remove the hidden class to trigger the animation back to scale 1
        setTimeout(() => {
                    // Populate the score fields with the scores of the movies
        document.getElementById('movie1Score').innerText = '';
        document.getElementById('movie2Score').innerText = '';
            displayRandomMovies();
            container.classList.remove('hidden');
        }, 500); // Adjust the delay as needed
    });
});


document.getElementById('nextbutton').addEventListener('click', function() {
    const movieContainers = document.querySelectorAll('.movie');
    
    // Apply the hidden class to initiate the scaling animation for each movie container
    movieContainers.forEach(function(container) {
        container.classList.add('hidden');
        
        // After a short delay, remove the hidden class to trigger the animation back to scale 1
        setTimeout(() => {
                    // Populate the score fields with the scores of the movies
        document.getElementById('movie1Score').innerText = '';
        document.getElementById('movie2Score').innerText = '';
            displayRandomMovies();
            container.classList.remove('hidden');
        }, 500); // Adjust the delay as needed
    });
    document.getElementById('nextbutton').style.visibility = 'hidden'; // Hide the "Try Again" button
});