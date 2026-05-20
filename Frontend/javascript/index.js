// API Config
const apiKey = '3fd2be6f0c70a2a598f084ddfb75487c';
const baseImgUrl = 'https://image.tmdb.org/t/p/w500';
let currentPage = 1;
let movies = [];

// DOM elements
const maindiv = document.getElementById("trend");
const movieDetail = document.getElementById("movieDetail");
const detailContent = document.getElementById("detailContent");
const closeDetail = document.getElementById("closeDetail");

// Fetch movies from API
async function fetchMovies(page) {
    try {
        const url = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${page}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.results) {
            movies = data.results.map(movie => ({
                ...movie,
                saved: false
            }));
            createMovieCards();
            initSplide();
        }
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

// Fetch movie details including genres
async function fetchMovieDetails(movieId) {
    try {
        const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
    }
}

// Create movie cards
function createMovieCards() {
    const list = document.querySelector('.splide__list');
    
    if (!list) {
        console.error("Splide list element not found!");
        return;
    }
    
    list.innerHTML = ''; // Clear existing content
    
    movies.forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("movie-card", "splide__slide");
        
        const img = document.createElement("img");
        img.src = movie.poster_path ? `${baseImgUrl}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster';
        img.alt = movie.title;
        img.loading = "lazy";
        
        const saveBtn = document.createElement("button");
        saveBtn.classList.add("save-btn");
        saveBtn.innerHTML = '<i class="far fa-bookmark"></i>';
        if (movie.saved) {
            saveBtn.classList.add("saved");
            saveBtn.innerHTML = '<i class="fas fa-bookmark"></i>';
        }
        
        saveBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            movie.saved = !movie.saved;
            if (movie.saved) {
                saveBtn.classList.add("saved");
                saveBtn.innerHTML = '<i class="fas fa-bookmark"></i>';
            } else {
                saveBtn.classList.remove("saved");
                saveBtn.innerHTML = '<i class="far fa-bookmark"></i>';
            }
        });
        
        card.appendChild(img);
        card.appendChild(saveBtn);
        
        card.addEventListener('click', () => {
            showMovieDetail(movie);
        });
        
        list.appendChild(card);
    });
}

// Show movie details
async function showMovieDetail(movie) {
    // Show loading state
    detailContent.innerHTML = `
        <div class="d-flex justify-content-center align-items-center" style="height: 300px;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
    
    movieDetail.classList.add("active");
    document.body.style.overflow = "hidden";
    
    // Fetch additional details
    const details = await fetchMovieDetails(movie.id);
    
    // Format date
    const releaseDate = movie.release_date ? new Date(movie.release_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : 'Unknown';
    
    // Format runtime
    const runtime = details?.runtime ? 
        `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` : 
        'Unknown';
    
    // Create HTML
    detailContent.innerHTML = `
        <img src="${movie.backdrop_path ? `${baseImgUrl}${movie.backdrop_path}` : 'https://via.placeholder.com/800x450?text=No+Backdrop'}" 
             alt="${movie.title}" 
             class="detail-poster">
        <div class="detail-info">
            <h1 class="detail-title">${movie.title}</h1>
            <div class="detail-meta">
                <span class="detail-rating">
                    <i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}/10
                </span>
                <span class="detail-badge">${releaseDate}</span>
                <span class="detail-badge">${runtime}</span>
                <span class="detail-badge">${details?.original_language?.toUpperCase() || 'N/A'}</span>
            </div>
            
            ${details?.genres?.length ? `
            <div class="detail-genres">
                ${details.genres.map(genre => `
                    <span class="genre-badge">${genre.name}</span>
                `).join('')}
            </div>
            ` : ''}
            
            <h5>Overview</h5>
            <p class="detail-overview">${movie.overview || 'No overview available.'}</p>
            
            ${details?.homepage ? `
            <a href="${details.homepage}" target="_blank" class="btn btn-danger">
                <i class="fas fa-external-link-alt"></i> Official Website
            </a>
            ` : ''}
        </div>
    `;
}

// Initialize Splide
function initSplide() {
    new Splide('#trend', {
        type: 'loop',
        perPage: 6,
        gap: '1rem',
        padding: { right: '5rem' },
        breakpoints: {
            1200: { perPage: 3 },
            992: { perPage: 3, padding: 0 },
            576: { perPage: 3, padding: 0 }
        }
    }).mount();
}

// Close movie details
closeDetail.addEventListener('click', () => {
    movieDetail.classList.remove("active");
    document.body.style.overflow = "auto";
});

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    fetchMovies(currentPage);
});

// Information Boxes
const information = document.getElementById('whycome')

function informationBox(title, description, imageURL) {
    const div = document.createElement('div')
    div.classList.add('infobox');

    const heading = document.createElement('h4')
    heading.textContent = title;

    const info = document.createElement('h6')
    info.textContent = description;
    info.style.color="#BBBBC3";

    const corimg = document.createElement('img')
    corimg.src = imageURL;
    corimg.alt = title;

    div.append(heading,info,corimg);
    information.appendChild(div);
}

informationBox("Enjoy on your TV",
     "Watch on smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players and more.", 
     "../../assests/TV.png");
informationBox("Download your shows to watch offline",
     "Save your favourites easily and always have something to watch.", 
     "../../assests/Download.png");
informationBox("Watch everywhere",
     "Stream unlimited movies and TV shows on your phone, tablet, laptop and TV.", 
     "../../assests/tlescope.png");
informationBox("Create profiles for kids",
     "Send kids on adventures with their favourite characters in a space made just for them ΓÇö free with your membership.", 
     "../../assests/child.png");

// Frequently Asked Questions
$(document).ready(function() {
    $("#clickme").on("click", function() {
        $("#SilverScreenX").slideToggle("slow");
    });
    $("#cost").on("click", function() {
        $("#cost1").slideToggle("slow");
    });
    $("#where").on("click", function() {
        $("#where1").slideToggle("slow");
    });
    $("#cancel").on("click", function() {
        $("#cancel1").slideToggle("slow");
    });
    $("#canwatch").on("click", function() {
        $("#canwatch1").slideToggle("slow");
    });
    $("#kid").on("click", function() {
        $("#kid1").slideToggle("slow");
    });
});

//clerk authentication
window.addEventListener("load", async function () {

    await window.Clerk.load({
        publishableKey: "pk_test_Z3Jvd2luZy1yYXR0bGVyLTEzLmNsZXJrLmFjY291bnRzLmRldiQ"
    });

    const loginModalEl = document.getElementById("loginModal");

    const loginModal = new bootstrap.Modal(loginModalEl, {
        backdrop: true,
        keyboard: true
    });

    let modalShown = false;

    const loginButton = document.getElementById("show-login");
    if (loginButton) {
        loginButton.addEventListener("click", () => {
            if (!window.Clerk.user) {
                document.getElementById("app").innerHTML =
                    `<div id="sign-in"></div>`;

                window.Clerk.mountSignIn(
                    document.getElementById("sign-in")
                );
            }

            loginModal.show();
            document.body.classList.add("blur-bg");
        });
    }

    // Auto popup after user scrolls
    window.addEventListener("scroll", () => {

        if (!modalShown) {

            modalShown = true;

            setTimeout(() => {

                // Only show if user not logged in
                if (!window.Clerk.user) {

                    loginModal.show();

                    document.body.classList.add("blur-bg");

                    document.getElementById("app").innerHTML =
                        `<div id="sign-in"></div>`;

                    window.Clerk.mountSignIn(
                        document.getElementById("sign-in")
                    );
                }

            }, 1000); // 1 second
        }
    });

    // Remove blur when modal closes
    loginModalEl.addEventListener("hidden.bs.modal", function () {
        document.body.classList.remove("blur-bg");
    });

    // User button if logged in
    if (window.Clerk.user) {

        document.getElementById("app").innerHTML =
            `<div id="user-button"></div>`;

        window.Clerk.mountUserButton(
            document.getElementById("user-button")
        );
    }
});

// Bottom Email Form Submission
// Form submission handling
document.addEventListener('DOMContentLoaded', function() {
    // Handle hero section form
    const emailForm = document.getElementById('emailForm');
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            if (validateEmail(email)) {
                // Here you would typically send the email to your backend
                alert('Thank you! We\'ll be in touch soon.');
                emailForm.reset();
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }

    // Handle bottom form
    const bottomEmailForm = document.getElementById('bottomEmailForm');
    if (bottomEmailForm) {
        bottomEmailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = bottomEmailForm.querySelector('input[type="email"]').value;
            if (validateEmail(email)) {
                // Here you would typically send the email to your backend
                alert('Thank you! We\'ll be in touch soon.');
                bottomEmailForm.reset();
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }
});

// Email validation function
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

//Fooetr Year Update
  document.getElementById("footer").innerHTML =
    `&copy; ${new Date().getFullYear()} SilverScreenX. All Rights Reserved.`;


