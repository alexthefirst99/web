// Wait for window load event
window.addEventListener('load', function () {
    // Select the preloader element
    const preloader = document.getElementById('preloader');

    // Add 'loaded' class to body to trigger transitions
    document.body.classList.add('loaded');

    // Fade out preloader
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(function () {
            preloader.style.display = 'none';
        }, 500); // Wait for transition to finish
    }

    // Navbar Toggle Logic
    const toggleBtn = document.querySelector('.navbar-toggle');
    const collapseMenu = document.querySelector('.navbar-collapse');

    if (toggleBtn && collapseMenu) {
        toggleBtn.addEventListener('click', function () {
            collapseMenu.classList.toggle('show');
            // Optional: Toggle icon between bars and times (X)
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                if (collapseMenu.classList.contains('show')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
});
