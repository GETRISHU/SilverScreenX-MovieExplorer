# SilverScreenX

SilverScreenX is a modern, responsive movie streaming web application. It allows users to browse trending movies, search and filter by genre/year/language, view detailed information (including trailers, cast, and production), and enjoy a visually rich, interactive UI inspired by top streaming platforms.

---

## ✨ Features

- **Trending Movies Carousel:** Browse popular movies fetched from The Movie Database (TMDb) API.
- **Advanced Search & Filters:** Search by title, filter by genre, year, language, minimum rating, and adult content.
- **Movie Details:** View overview, ratings, genres, release date, director, cast, production, and trailers.
- **Responsive Design:** Fully optimized for desktop, tablet, and mobile.
- **Modern UI:** Built with Tailwind CSS, custom fonts, and smooth transitions.
- **Skeleton Loading:** Animated placeholders while data loads.
- **Pagination:** Easily navigate through multiple pages of results.
- **Scroll to Top:** Floating button for quick navigation.
- **Movie Detail Overlay:** Click a movie card for a popup with full details and trailer.
- **Error Handling:** User-friendly error messages if data fails to load.
- **Accessibility:** Semantic HTML, ARIA labels, and keyboard navigation.
- **Custom Scrollbars:** Enhanced sidebar scroll experience.
- **Contact & Privacy:** Dedicated pages for contacting the developer and privacy policy.
- **Assets:** Custom images and video assets for branding and UI.

---

## 📁 Project Structure

```
SilverscreenX/
│
├── assests/
│   ├── child.png
│   ├── Download.png
│   ├── IN-en-20250224-TRIFECTA-perspective_3a9c67b5-1d1d-49be-8499-d179f6389935_large.jpg
│   ├── tlescope.png
│   ├── tv.png
│
├── connect.html         # Contact page
├── index.html           # Home page (trending, intro, FAQ, etc.)
├── movie.html           # Main movie browser/search/filter page
├── privacy.html         # Privacy policy
├── README.md            # Project documentation
├── script.js            # Main JavaScript logic (API, UI, etc.)
├── index.css            # Custom styles (in addition to Tailwind)
```

---

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Edge, etc.)
- Internet connection (for fetching movie data from TMDb API)

### Running Locally

1. **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/SilverScreenX.git
    cd SilverScreenX
    ```

2. **Open `index.html` in your browser:**
    - Double-click `index.html` or use a local server (e.g., [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for VS Code).

3. **Browse Movies:**
    - Use the navigation bar or go directly to `movie.html` for advanced search and filtering.

---

## 🗂️ Main Pages

- **index.html** — Home page with trending movies, FAQ, and info sections.
- **movie.html** — Advanced movie search, filtering, and details.
- **connect.html** — Contact the developer.
- **privacy.html** — Privacy policy.

---

## 🛠️ Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **UI Framework:** Tailwind CSS (via CDN)
- **Fonts:** Poppins, Jersey 15, Big Shoulders Stencil, Playwrite AU SA (Google Fonts)
- **API:** [TMDb API](https://www.themoviedb.org/documentation/api)
- **Icons:** SVG icons (inline, no external dependency)
- **3D Background:** Vanta.js (for animated backgrounds)
- **No frameworks:** Pure JS for all logic and DOM manipulation

---

## ⚙️ Customization & Details

- **API Key:** The TMDb API key is hardcoded in `script.js`. For production, secure your API keys.
- **Assets:** All images and videos are in the `assests/` folder.
- **Styling:** Uses Tailwind CSS utility classes and a few custom styles in `index.css` and `<style>` blocks.
- **Fonts:** Custom Google Fonts for branding and headings.
- **Loading Skeletons:** `.skeleton` class for animated loading placeholders.
- **Movie Cards:** Hover effects, transitions, and responsive grid layout.
- **Movie Detail Overlay:** Accessible modal with ARIA roles and keyboard support.
- **Scroll to Top:** Appears after scrolling, smooth scrolls to top.
- **Error Handling:** Displays user-friendly messages if API fails.
- **Pagination:** Dynamic, with "Prev" and "Next" buttons, and page numbers.
- **Accessibility:** Uses semantic HTML, ARIA labels, and keyboard navigation for overlays.
- **Custom Scrollbars:** Enhanced for sidebar elements.
- **Contact & Privacy:** Simple, accessible static pages.

---

## 📸 Screenshots

## 📸 Screenshots

![My Image](./Screenshot%202026-05-20%20134925.png)
![My Image](./Screenshot%202026-05-20%20134940.png)
![My Image](./Screenshot%202026-05-20%20134952.png)
![My Image](./Screenshot%202026-05-20%20135007.png)
![My Image](./Screenshot%202026-05-20%20135022.png)
![My Image](./Screenshot%202026-05-20%20135052.png)
![My Image](./Screenshot%202026-05-20%20135114.png)



---

## 📄 License

This project is for educational/demo purposes. For commercial use, ensure compliance with TMDb API and third-party asset licenses.

---

## 📬 Contact

For questions or feedback, visit [connect.html](connect.html) or itzrishi102@gmail.com

---

**Enjoy exploring movies with