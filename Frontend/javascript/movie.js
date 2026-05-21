    // Initialize Vanta
    VANTA.NET({
      el: "#vanta-bg",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
      scale: 1,
      scaleMobile: 1,
      color: 0x4f46e5,
      backgroundColor: 0x111827,
      points: 14,
      maxDistance: 19,
    });

    // TMDB API Key (replace with your own if you want!)
    const apiKey = "3fd2be6f0c70a2a598f084ddfb75487c";

    // State variables
    let currentPage = 1,
      totalPages = 1,
      genres = [],
      years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i),
      languages = [];
    let currentSearch = "",
      personId = "",
      currentGenre = "",
      currentYear = "",
      currentLanguage = "",
      currentSort = "popularity.desc",
      minVote = "",
      adultOnly = false;

    // DOM references
    const movieList = document.getElementById("movie");
    const loadingSkeleton = document.getElementById("loadingSkeleton");
    const paginationContainer = document.getElementById("pagination");
    const searchInput = document.getElementById("searchInput");
    const peopleInput = document.getElementById("peopleInput");
    const genreFilter = document.getElementById("genreFilter");
    const yearFilter = document.getElementById("yearFilter");
    const languageFilter = document.getElementById("languageFilter");
    const sortFilter = document.getElementById("sortFilter");
    const minVoteFilter = document.getElementById("minVoteFilter");
    const adultToggle = document.getElementById("adultToggle");
    const scrollToTopBtn = document.getElementById("scrollToTop");
    const closeDetail = document.getElementById("closeDetail");

    // Populate genres dropdown
    async function fetchGenres() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`
        );
        const data = await res.json();
        genres = data.genres || [];
        genres.forEach((genre) => {
          const opt = document.createElement("option");
          opt.value = genre.id;
          opt.textContent = genre.name;
          genreFilter.appendChild(opt);
        });
      } catch (err) {
        console.error("Error fetching genres", err);
      }
    }

    // Populate languages dropdown
    async function fetchLanguages() {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/configuration/languages?api_key=${apiKey}`
        );
        const data = await res.json();
        languages = data || [];
        languages.forEach((lang) => {
          const opt = document.createElement("option");
          opt.value = lang.iso_639_1;
          opt.textContent = lang.english_name;
          languageFilter.appendChild(opt);
        });
      } catch {
        // ignore
      }
    }

    // Populate year dropdown
    years.forEach((year) => {
      const opt = document.createElement("option");
      opt.value = year;
      opt.textContent = year;
      yearFilter.appendChild(opt);
    });

    // Helper debounce function
    function debounce(fn, delay = 600) {
      let timer;
      return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
      };
    }

    // Determine if all filters/search are empty
    function filtersAreEmpty() {
      return (
        searchInput.value.trim() === "" &&
        peopleInput.value.trim() === "" &&
        genreFilter.value === "" &&
        yearFilter.value === "" &&
        languageFilter.value === "" &&
        minVoteFilter.value === "" &&
        !adultToggle.checked
      );
    }

    // Lazy load images using Intersection Observer
    function initializeLazyLoad() {
      if ("IntersectionObserver" in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target;
              const src = img.dataset.src;
              if (src) {
                // Create a new image to preload
                const tempImg = new Image();
                tempImg.onload = () => {
                  img.src = src;
                  img.removeAttribute("data-src");
                  img.classList.add("loaded");
                };
                tempImg.onerror = () => {
                  img.src = "https://via.placeholder.com/500x750?text=Error";
                  img.removeAttribute("data-src");
                };
                tempImg.src = src;
              }
              observer.unobserve(img);
            }
          });
        }, { rootMargin: "50px" });

        document.querySelectorAll("img[data-src]").forEach((img) => {
          imageObserver.observe(img);
        });
      } else {
        // Fallback for older browsers
        document.querySelectorAll("img[data-src]").forEach((img) => {
          img.src = img.dataset.src;
        });
      }
    }

    // Fetch movies helper
    async function fetchMovies(page = 1) {
      loadingSkeleton.classList.remove("hidden");
      movieList.innerHTML = "";
      currentPage = page;

      // Reset search if filters empty
      if (filtersAreEmpty()) {
        personId = "";
        currentSearch = "";
      }

      let url = "";
      const usePerson = !!personId;

      if (currentSearch) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&page=${page}&query=${encodeURIComponent(
          currentSearch
        )}`;
        if (adultOnly) url += "&include_adult=true";
        if (currentLanguage) url += `&with_original_language=${currentLanguage}`;
        if (minVote) url += `&vote_average.gte=${minVote}`;
      } else if (usePerson) {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${page}&with_people=${personId}&sort_by=${currentSort}`;
        if (currentGenre) url += `&with_genres=${currentGenre}`;
        if (currentYear) url += `&primary_release_year=${currentYear}`;
        if (currentLanguage) url += `&with_original_language=${currentLanguage}`;
        if (minVote) url += `&vote_average.gte=${minVote}`;
        url += `&include_adult=${adultOnly ? "true" : "false"}`;
      } else {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${page}&sort_by=${currentSort}`;
        if (currentGenre) url += `&with_genres=${currentGenre}`;
        if (currentYear) url += `&primary_release_year=${currentYear}`;
        if (currentLanguage) url += `&with_original_language=${currentLanguage}`;
        if (minVote) url += `&vote_average.gte=${minVote}`;
        url += `&include_adult=${adultOnly ? "true" : "false"}`;
      }

      try {
        const response = await fetch(url);
        const data = await response.json();
        totalPages = data.total_pages;
        loadingSkeleton.classList.add("hidden");

        if (!data.results || data.results.length === 0) {
          movieList.innerHTML = `
            <div class="col-span-full text-center py-12">
              <h3 class="text-2xl font-semibold text-gray-400">No movies found</h3>
              <p class="text-gray-500 mt-2">Try another search or filter.</p>
            </div>`;
          updatePagination();
          return;
        }

        data.results.forEach((movie) => {
          if (!movie.poster_path) return;
          const card = document.createElement("div");
          card.className =
            "movie-card rounded-xl overflow-hidden bg-gray-800 border border-gray-700 hover:border-blue-500 transition-all cursor-pointer";
          card.innerHTML = `
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 750'%3E%3Crect fill='%23374151' width='500' height='750'/%3E%3C/svg%3E" 
              data-src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
              alt="${movie.title}"
              loading="lazy"
              class="w-full h-64 sm:h-72 lg:h-80 object-cover hover:brightness-110 transition-all duration-300"
              onerror="this.src='https://via.placeholder.com/500x750?text=No+Image'">
            <div class="p-4">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-lg truncate">${movie.title}</h3>
                <span class="flex items-center bg-[#BB2D3B] px-2 py-1 rounded text-sm font-medium">${movie.vote_average.toFixed(
                  1
                )}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.8１.588-1.8１h3.46１a1 １ 0 00.95１-.69l１.０７-3.２９２z" />
                  </svg>
                </span>
              </div>
              <div class="flex justify-between text-sm text-gray-400">
                <span>${movie.release_date ? movie.release_date.substring(0, 4) : "N/A"}</span>
                <span>${getGenreNames(movie.genre_ids)}</span>
              </div>
            </div>
          `;
          card.addEventListener("click", () => showMovieDetail(movie));
          movieList.appendChild(card);
        });

        updatePagination();
        initializeLazyLoad();
      } catch (err) {
        loadingSkeleton.classList.add("hidden");
        movieList.innerHTML = `<div class="col-span-full text-center py-12"><h3 class="text-2xl font-semibold text-red-400">Error loading movies</h3><p class="text-gray-500 mt-2">Please try again later</p></div>`;
        updatePagination();
      }
    }

    function getGenreNames(genreIds = []) {
      if (!genreIds.length) return "Unknown";
      return genreIds
        .map((id) => {
          const genre = genres.find((g) => g.id === id);
          return genre ? genre.name : "";
        })
        .filter(Boolean)
        .slice(0, 2)
        .join(", ");
    }

    function updatePagination() {
      paginationContainer.innerHTML = "";
      if (totalPages <= 1) return;
      if (currentPage > 1) {
        const prevBtn = document.createElement("button");
        prevBtn.textContent = "Previous";
        prevBtn.className =
          "px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors";
        prevBtn.onclick = () => {
          fetchMovies(currentPage - 1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        };
        paginationContainer.appendChild(prevBtn);
      }
      let startPage = Math.max(1, currentPage - 1),
        endPage = Math.min(totalPages, currentPage + 1);
      if (currentPage === totalPages && currentPage > 2) startPage--;
      for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.textContent = i;
        pageBtn.className = `px-4 py-2 rounded-md transition-colors ${
          i === currentPage ? "bg-blue-600 text-white" : "bg-gray-800 hover:bg-gray-700"
        }`;
        pageBtn.onclick = () => {
          fetchMovies(i);
          window.scrollTo({ top: 0, behavior: "smooth" });
        };
        paginationContainer.appendChild(pageBtn);
      }
      if (currentPage < totalPages) {
        const nextBtn = document.createElement("button");
        nextBtn.textContent = "Next";
        nextBtn.className =
          "px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors";
        nextBtn.onclick = () => {
          fetchMovies(currentPage + 1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        };
        paginationContainer.appendChild(nextBtn);
      }
    }

    // Show movie detail overlay with more info and trailers
    async function showMovieDetail(movie) {
      const overlay = document.getElementById("movieDetailOverlay");
      const detailBox = document.getElementById("detailContent");

      // Show overlay immediately with cached data
      detailBox.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 750'%3E%3Crect fill='%23374151' width='500' height='750'/%3E%3C/svg%3E" 
              data-src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
              alt="${movie.title}"
              loading="lazy"
              class="w-full rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              onerror="this.src='https://via.placeholder.com/500x750?text=No+Image'">
            ${
              movie.backdrop_path
                ? `<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 281'%3E%3Crect fill='%23374151' width='500' height='281'/%3E%3C/svg%3E" 
                    data-src="https://image.tmdb.org/t/p/w500${movie.backdrop_path}" 
                    alt="${movie.title}" 
                    loading="lazy"
                    class="w-full rounded-lg mt-4 shadow-lg">`
                : ""
            }
          </div>
          <div class="lg:col-span-2">
            <div class="flex justify-between items-start mb-2">
              <h2 id="detailTitle" class="text-3xl font-bold">${movie.title}</h2>
                         </div>
            <div class="flex flex-wrap gap-2 mb-3 items-center">
              ${movie.genre_ids ? movie.genre_ids.map((id) => {
                const genre = genres.find((g) => g.id === id);
                return genre ? `<span class="px-3 py-1 bg-[#BB2D3B] rounded-full text-sm">${genre.name}</span>` : "";
              }).join("") : ""}
               <a
                  href="#"
                  id="officialSiteLink"
                  style="display:none;"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#BB2D3B] text-[#BB2D3B] hover:bg-[#BB2D3B] hover:text-white transition-all duration-300 text-sm font-semibold"
                >
                  Visit Official Site

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z"/>
                    <path d="M5 5h5V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-5h-2v5H5V5z"/>
                  </svg>
                </a>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              <div class="bg-gray-800 p-3 rounded-lg">
                <div class="text-gray-400 text-xs">Release Date</div>
                <div class="font-semibold">${movie.release_date || "N/A"}</div>
              </div>
              <div class="bg-gray-800 p-3 rounded-lg">
                <div class="text-gray-400 text-xs">Rating</div>
                <div class="font-semibold flex items-center">
                  ${movie.vote_average?.toFixed(1) || "?"}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <div class="bg-gray-800 p-3 rounded-lg">
                <div class="text-gray-400 text-xs">Popularity</div>
                <div class="font-semibold">${movie.popularity?.toFixed(0) || "?"}</div>
              </div>
            </div>
            <div class="text-sm text-gray-300 mb-2"><strong>Director:</strong> <span id="directorName">Loading...</span></div>
            <div class="text-sm text-gray-300 mb-4"><strong>Cast:</strong> <span id="castNames">Loading...</span></div>
            <div class="text-sm text-gray-300 mb-4"><strong>Production:</strong> <span id="prodNames">Loading...</span></div>
            <h3 class="text-xl font-bold mb-2">Overview</h3>
            <p class="text-gray-200 mb-6">${movie.overview || "No overview available."}</p>
            <div id="trailerContainer"></div>
          </div>
        </div>
      `;

      overlay.classList.remove("hidden");
      document.body.style.overflow = "hidden";
      initializeLazyLoad();

      // Load additional data in background (non-blocking)
      try {
        const resp = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&append_to_response=credits,videos`
        );
        const result = await resp.json();

        const director = result.credits?.crew.find((p) => p.job === "Director");
        const castList = result.credits?.cast.slice(0, 5) || [];
        const production = (result.production_companies || [])
          .slice(0, 2)
          .map((c) => c.name)
          .join(", ");

        // Update director
        document.getElementById("directorName").textContent = director?.name || "N/A";
        // Update cast
        document.getElementById("castNames").textContent = castList.length 
          ? castList.map((c) => c.name).join(", ") 
          : "N/A";
        // Update production
        document.getElementById("prodNames").textContent = production || "N/A";
        // Show official site link if available
        if (result.homepage) {
          const officialLink = document.getElementById("officialSiteLink");
          officialLink.href = result.homepage;
          officialLink.style.display = "inline-flex";
          officialLink.title = "Visit Official Website";
        }

        // Load trailer if available
        if (result.videos && result.videos.results.length) {
          const yt = result.videos.results.find((v) => 
            v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
          ) || result.videos.results.find((v) => v.site === "YouTube");

          if (yt && yt.key) {
            const trailerHTML = `
              <div class="mb-4">
                <div class="aspect-video bg-gray-800 rounded mb-3 flex items-center justify-center cursor-pointer hover:bg-gray-700" id="youtubeThumb" style="background-image: url('https://img.youtube.com/vi/${yt.key}/maxresdefault.jpg'); background-size: cover; background-position: center;">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div class="text-sm text-gray-400 mb-2">Sorry for the delay. Click to watch trailer on youtube </div>
                <a href="https://www.youtube.com/watch?v=${yt.key}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 rounded-full bg-[#BB2D3B] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
                  Watch Trailer on YouTube
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 3h7v7h-2V6.414l-9.293 9.293-1.414-1.414L17.586 5H14V3z" />
                  </svg>
                </a>
              </div>
            `;
            const trailerContainer = document.getElementById("trailerContainer");
            if (trailerContainer) {
              trailerContainer.innerHTML = trailerHTML;
              // Add click handler for lazy-loaded iframe
              document.getElementById("youtubeThumb").addEventListener("click", (e) => {
                e.preventDefault();
                document.getElementById("youtubeThumb").outerHTML = `
                  <iframe
                    width="100%"
                    height="100%"
                    class="rounded mb-3"
                    src="https://www.youtube.com/embed/${yt.key}?autoplay=1"
                    title="YouTube trailer"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
                  </iframe>
                `;
              });
            }
          }
        }
      } catch (err) {
        console.error("Error loading detail", err);
        // Gracefully handle errors - overlay still shows with basic info
      }
    }

    // Listeners for inputs & filters
    searchInput.addEventListener(
      "input",
      debounce(() => {
        personId = "";
        currentSearch = searchInput.value.trim();
        fetchMovies(1);
      }, 600)
    );
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        personId = "";
        currentSearch = searchInput.value.trim();
        fetchMovies(1);
      }
    });

    peopleInput.addEventListener(
      "input",
      debounce(async () => {
        const q = peopleInput.value.trim();
        if (!q) {
          personId = "";
          fetchMovies(1);
          return;
        }
        try {
          const resp = await fetch(
            `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${encodeURIComponent(q)}`
          );
          const data = await resp.json();
          if (data.results && data.results.length) {
            personId = data.results[0].id;
            searchInput.value = "";
            fetchMovies(1);
          } else {
            personId = "";
            fetchMovies(1);
          }
        } catch {
          personId = "";
          fetchMovies(1);
        }
      }, 600)
    );

    genreFilter.addEventListener("change", () => {
      currentGenre = genreFilter.value;
      fetchMovies(1);
    });
    yearFilter.addEventListener("change", () => {
      currentYear = yearFilter.value;
      fetchMovies(1);
    });
    languageFilter.addEventListener("change", () => {
      currentLanguage = languageFilter.value;
      fetchMovies(1);
    });
    sortFilter.addEventListener("change", () => {
      currentSort = sortFilter.value;
      fetchMovies(1);
    });
    minVoteFilter.addEventListener("change", () => {
      minVote = minVoteFilter.value;
      fetchMovies(1);
    });
    adultToggle.addEventListener("change", () => {
      adultOnly = adultToggle.checked;
      fetchMovies(1);
    });

    // Close overlay
    closeDetail.addEventListener("click", () => {
      document.getElementById("movieDetailOverlay").classList.add("hidden");
      document.body.style.overflow = "auto";
    });

    // Scroll to top button
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 320) {
        scrollToTopBtn.classList.remove("opacity-0", "invisible");
        scrollToTopBtn.classList.add("opacity-100", "visible");
      } else {
        scrollToTopBtn.classList.add("opacity-0", "invisible");
        scrollToTopBtn.classList.remove("opacity-100", "visible");
      }
    });
    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Initialize filters and movies on DOM ready
    document.addEventListener("DOMContentLoaded", async () => {
      await fetchGenres();
      await fetchLanguages();
      fetchMovies(1);
    });