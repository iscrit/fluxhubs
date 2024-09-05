document.addEventListener("DOMContentLoaded", () => {
    // Project count animation
    const projectNumber = document.getElementById('project-number');
    let count = 0;
    const totalProjects = 2;

    const countAnimation = setInterval(() => {
        if (count < totalProjects) {
            count++;
            projectNumber.textContent = count;
        } else {
            clearInterval(countAnimation);
        }
    }, 100);

    // Load projects dynamically
    fetch("projects.json")
        .then(response => response.json())
        .then(data => {
            const projectsContainer = document.getElementById("projects");
            data.projects.forEach((project, index) => {
                const projectCard = document.createElement("div");
                projectCard.className = "project-card";

                projectCard.innerHTML = `
                    <a href="${project.link}" target="_blank" data-project-id="${index}">
                        <img src="${project.image}" alt="${project.title}" class="project-image">
                        <div class="project-content">
                            <h2 class="project-title">${project.title}</h2>
                            <p class="project-date">${project.date}</p>
                            <p class="project-about">${project.about}</p>
                        </div>
                    </a>
                `;

                projectsContainer.appendChild(projectCard);

                // Add click counter for each project
                const projectLink = projectCard.querySelector('a');
                projectLink.addEventListener('click', () => {
                    countapi.hit('fluxhub', `project_${index}`).then((result) => {
                        console.log(`Project ${index} clicked: ${result.value} times`);
                    });
                });
            });
        })
        .catch(error => console.error('Error loading projects:', error));

    // Search bar animation
    const searchIcon = document.querySelector('.search-icon');
    const searchInput = document.getElementById('search-input');

    searchIcon.addEventListener('click', () => {
        searchInput.focus();
    });

    searchInput.addEventListener('focus', () => {
        searchIcon.style.transform = 'translateX(10px)';
        searchInput.style.width = '250px';
        searchInput.style.opacity = '1';
    });

    searchInput.addEventListener('blur', () => {
        if (searchInput.value === '') {
            searchIcon.style.transform = 'translateX(0)';
            searchInput.style.width = '0';
            searchInput.style.opacity = '0';
            searchInput.style.marginLeft = '-40px';
        }
    });

    // Popup functionality
    const overlay = document.getElementById('overlay');
    const popup = document.getElementById('popup');
    const closeBtn = document.getElementById('close-btn');

    document.addEventListener('click', function(event) {
        const target = event.target;
        if (target.classList.contains('open-popup')) {
            overlay.style.display = 'flex';
        }
    });

    closeBtn.addEventListener('click', function() {
        overlay.style.display = 'none';
    });

    overlay.addEventListener('click', function(event) {
        if (event.target === overlay) {
            overlay.style.display = 'none';
        }
    });

    // Interactive background movement
    document.addEventListener('mousemove', (event) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        document.body.style.setProperty('--mouse-x', mouseX);
        document.body.style.setProperty('--mouse-y', mouseY);
    });

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light');
    });

    // Visitor count
    countapi.visits('fluxhub').then((result) => {
        document.getElementById('visitor-counter').textContent = `Visitors: ${result.value}`;
    });
});
