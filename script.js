document.addEventListener("DOMContentLoaded", () => {
    // Load projects from projects.json
    fetch("projects.json")
        .then(response => response.json())
        .then(data => {
            const projectsContainer = document.getElementById("projects");
            data.projects.forEach((project, index) => {
                const projectCard = document.createElement("div");
                projectCard.className = "project-card";

                projectCard.innerHTML = `
                    <a href="${project.link}" target="_blank">
                        <img src="${project.image}" alt="${project.title}" class="project-image">
                        <div class="project-content">
                            <h2 class="project-title">${project.title}</h2>
                            <p class="project-date">Released: ${project.date}</p>
                            <p class="project-about">${project.about}</p>
                        </div>
                    </a>
                `;

                projectsContainer.appendChild(projectCard);

                // Track project clicks
                projectCard.addEventListener('click', () => {
                    countapi.hit('fluxhub', project.title).then((result) => {
                        console.log(`${project.title} clicked ${result.value} times`);
                    });
                });
            });
        })
        .catch(error => console.error('Error loading projects:', error));

    // Dark/Light theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        // Save the current theme in localStorage
        const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });

    // Load the theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
    }

    // Search functionality
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function () {
        const searchValue = searchInput.value.toLowerCase();
        const projects = document.querySelectorAll('.project-card');

        projects.forEach(project => {
            const title = project.querySelector('.project-title').textContent.toLowerCase();
            if (title.includes(searchValue)) {
                project.style.display = '';
            } else {
                project.style.display = 'none';
            }
        });
    });

    // Live visitor counter using CountAPI
    countapi.visits('fluxhub').then((result) => {
        document.getElementById('visitor-counter').textContent = `Visitors: ${result.value}`;
    });

    // Popup functionality
    const popup = document.getElementById('popup');
    const closeBtn = document.getElementById('close-btn');
    
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('open-popup')) {
            popup.style.display = 'flex';
        }
    });

    closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    popup.addEventListener('click', (event) => {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });
});
