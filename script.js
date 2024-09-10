document.addEventListener("DOMContentLoaded", () => {
    // Load projects from projects.json
    fetch("projects.json")
        .then(response => response.json())
        .then(data => {
            const projectsContainer = document.getElementById("projects");
            data.projects.forEach((project) => {
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
                    }).catch(error => console.error('Error tracking click:', error));
                });
            });

            // Hide loader and show projects
            const loader = document.getElementById('loader');
            const projectsSection = document.getElementById('projects');
            setTimeout(() => {
                loader.style.display = 'none';
                projectsSection.style.opacity = 1;
            }, 2000); // Adjust the delay as needed
        })
        .catch(error => console.error('Error loading projects:', error));

    // Dark/Light theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            // Save the current theme in localStorage
            const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
        });
    }

    // Load the theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
    }

    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
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
    }

    // Live visitor counter using CountAPI
    countapi.visits('fluxhub')
        .then((result) => {
            document.getElementById('visitor-counter').textContent = `Visitors: ${result.value}`;
        })
        .catch(error => {
            console.error('Error fetching visitor count:', error);
            document.getElementById('visitor-counter').textContent = 'Visitors: Error';
        });

    // Popup functionality
    const popup = document.getElementById('popup');
    const closeBtn = document.getElementById('close-btn');
    
    function openPopup() {
        if (popup) {
            popup.style.display = 'flex';
            popup.setAttribute('aria-hidden', 'false');
        }
    }

    function closePopup() {
        if (popup) {
            popup.style.display = 'none';
            popup.setAttribute('aria-hidden', 'true');
        }
    }

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('open-popup')) {
            openPopup();
        } else if (event.target === closeBtn || (popup && event.target === popup)) {
            closePopup();
        }
    });

    // Example: Open the popup after 2 seconds for demonstration
    setTimeout(openPopup, 2000);
});
