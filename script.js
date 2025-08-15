document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Dark/Light Mode Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

    // Change the icons inside the button based on previous settings
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        themeToggleLightIcon.classList.remove('hidden');
    } else {
        themeToggleDarkIcon.classList.remove('hidden');
    }

    themeToggleBtn.addEventListener('click', function() {
        // toggle icons inside button
        themeToggleDarkIcon.classList.toggle('hidden');
        themeToggleLightIcon.classList.toggle('hidden');

        // if set via local storage previously
        if (localStorage.getItem('color-theme')) {
            if (localStorage.getItem('color-theme') === 'light') {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            }

        // if NOT set via local storage previously
        } else {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            }
        }
        
        // Rerender chart on theme change
        if (typeof skillsChart !== 'undefined') {
            skillsChart.destroy();
            skillsChart = new Chart(ctx, getChartConfig());
        }
    });


    // Chart.js Radar Chart
    const ctx = document.getElementById('skillsChart').getContext('2d');
    
    const getChartConfig = () => {
        const isDarkMode = document.documentElement.classList.contains('dark');
        const gridColor = isDarkMode ? 'rgba(100, 116, 139, 0.3)' : 'rgba(51, 65, 85, 0.2)';
        const pointLabelColor = isDarkMode ? '#e2e8f0' : '#334155';
        const ticksColor = isDarkMode ? '#94a3b8' : '#475569';
        const ticksBackdropColor = isDarkMode ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.75)';

        return {
            type: 'radar',
            data: {
                labels: [
                    'Frontend Dev', 'Backend Dev', 'UI/UX Design',
                    'Database', 'DevOps', 'Problem Solving'
                ],
                datasets: [{
                    label: 'Tingkat Keahlian',
                    data: [9, 7, 8, 7, 6, 9],
                    fill: true,
                    backgroundColor: 'rgba(14, 165, 233, 0.2)',
                    borderColor: 'rgb(14, 165, 233)',
                    pointBackgroundColor: 'rgb(14, 165, 233)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(14, 165, 233)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: gridColor },
                        grid: { color: gridColor },
                        pointLabels: { font: { size: 14 }, color: pointLabelColor },
                        ticks: {
                            backdropColor: ticksBackdropColor,
                            color: ticksColor,
                            stepSize: 2
                        },
                        suggestedMin: 0,
                        suggestedMax: 10
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) { label += ': '; }
                                if (context.parsed.r !== null) {
                                    label += context.parsed.r + ' / 10';
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        };
    };
    
    let skillsChart = new Chart(ctx, getChartConfig());

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
             // Close mobile menu on click
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    });
});

let lastScrollY = window.scrollY;
const header = document.getElementById('main-header');

window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY) {
        // Scroll ke bawah → sembunyikan header
        header.classList.add('-translate-y-full');
    } else {
        // Scroll ke atas → tampilkan header
        header.classList.remove('-translate-y-full');
    }
    lastScrollY = window.scrollY;
});

// Ambil elemen tombol berdasarkan ID-nya
const scrollToTopBtn = document.getElementById("scroll-to-top");

// Fungsi untuk menampilkan atau menyembunyikan tombol
const toggleButtonVisibility = () => {
  // Jika posisi scroll vertikal lebih dari 200 piksel
  if (window.scrollY > 200) {
    // Tampilkan tombol dengan mengubah opacity-nya
    scrollToTopBtn.classList.remove('opacity-0');
    scrollToTopBtn.classList.add('opacity-100');
  } else {
    // Sembunyikan lagi tombolnya
    scrollToTopBtn.classList.remove('opacity-100');
    scrollToTopBtn.classList.add('opacity-0');
  }
};

// Fungsi untuk scroll ke atas halaman
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth" // Efek scroll yang halus
  });
};

// Tambahkan event listener saat window di-scroll
window.addEventListener("scroll", toggleButtonVisibility);

// Tambahkan event listener saat tombol di-klik
scrollToTopBtn.addEventListener("click", scrollToTop);


