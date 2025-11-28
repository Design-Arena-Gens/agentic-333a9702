// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    // Mobile sidebar toggle
    const createMobileMenuButton = () => {
        if (window.innerWidth <= 768) {
            let menuBtn = document.getElementById('mobile-menu-btn');
            if (!menuBtn) {
                menuBtn = document.createElement('button');
                menuBtn.id = 'mobile-menu-btn';
                menuBtn.innerHTML = '☰';
                menuBtn.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
                    color: white;
                    border: none;
                    font-size: 1.8rem;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.4);
                    z-index: 1100;
                    transition: all 0.3s ease;
                `;
                document.body.appendChild(menuBtn);

                menuBtn.addEventListener('click', () => {
                    const sidebar = document.querySelector('.sidebar');
                    sidebar.classList.toggle('active');
                    menuBtn.innerHTML = sidebar.classList.contains('active') ? '✕' : '☰';
                });

                // Close sidebar when clicking outside
                document.addEventListener('click', (e) => {
                    const sidebar = document.querySelector('.sidebar');
                    const menuBtn = document.getElementById('mobile-menu-btn');
                    if (sidebar.classList.contains('active') &&
                        !sidebar.contains(e.target) &&
                        e.target !== menuBtn) {
                        sidebar.classList.remove('active');
                        menuBtn.innerHTML = '☰';
                    }
                });
            }
        }
    };

    createMobileMenuButton();
    window.addEventListener('resize', createMobileMenuButton);

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = {
                nom: document.getElementById('nom').value,
                email: document.getElementById('email').value,
                sujet: document.getElementById('sujet').value,
                message: document.getElementById('message').value,
                date: new Date().toLocaleString('fr-FR')
            };

            // In a real application, this would send data to a server
            // For now, we'll just save to localStorage and show success message

            // Get existing comments
            let comments = JSON.parse(localStorage.getItem('comments') || '[]');
            comments.unshift(formData);
            // Keep only last 10 comments
            comments = comments.slice(0, 10);
            localStorage.setItem('comments', JSON.stringify(comments));

            // Show success message
            const formMessage = document.getElementById('formMessage');
            formMessage.className = 'form-message success';
            formMessage.textContent = 'Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.';
            formMessage.style.display = 'block';

            // Reset form
            contactForm.reset();

            // Reload comments
            loadComments();

            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        });
    }

    // Load and display comments
    function loadComments() {
        const commentsList = document.getElementById('commentsList');
        if (commentsList) {
            const comments = JSON.parse(localStorage.getItem('comments') || '[]');

            if (comments.length === 0) {
                commentsList.innerHTML = '<p class="loading-comments">Aucun commentaire pour le moment. Soyez le premier à nous contacter !</p>';
            } else {
                commentsList.innerHTML = comments.map(comment => `
                    <div class="comment-item">
                        <div class="comment-header">
                            <span class="comment-author">${escapeHtml(comment.nom)}</span>
                            <span class="comment-date">${comment.date}</span>
                        </div>
                        <div class="comment-subject"><strong>Sujet:</strong> ${getSubjectLabel(comment.sujet)}</div>
                        <div class="comment-message">${escapeHtml(comment.message)}</div>
                    </div>
                `).join('');
            }
        }
    }

    // Helper function to escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Get subject label
    function getSubjectLabel(value) {
        const labels = {
            'question': 'Question technique',
            'suggestion': 'Suggestion',
            'erreur': 'Signaler une erreur',
            'autre': 'Autre'
        };
        return labels[value] || value;
    }

    // Load comments on page load
    loadComments();

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards and sections
    document.querySelectorAll('.card, .component-box, .type-card, .timeline-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Code syntax highlighting (simple)
    document.querySelectorAll('code').forEach(block => {
        block.style.fontFamily = "'Courier New', monospace";
    });

    // Add copy button to code blocks
    document.querySelectorAll('.code-example').forEach(block => {
        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copier';
        copyBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 5px 10px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.85rem;
        `;
        block.style.position = 'relative';
        block.appendChild(copyBtn);

        copyBtn.addEventListener('click', () => {
            const code = block.querySelector('pre').textContent;
            navigator.clipboard.writeText(code).then(() => {
                copyBtn.textContent = 'Copié !';
                setTimeout(() => {
                    copyBtn.textContent = 'Copier';
                }, 2000);
            });
        });
    });

    // Interactive hover effects for diagrams
    document.querySelectorAll('.diagram-block, .cpu-block, .mem-zone').forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        el.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Progress indicator for reading
    const createProgressBar = () => {
        const progressBar = document.createElement('div');
        progressBar.id = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #2563eb 0%, #3b82f6 100%);
            z-index: 10000;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / documentHeight) * 100;
            progressBar.style.width = progress + '%';
        });
    };

    createProgressBar();

    // Table of contents generator for long pages
    const generateTOC = () => {
        const article = document.querySelector('.content-article');
        if (!article) return;

        const headings = article.querySelectorAll('h3');
        if (headings.length < 3) return; // Only generate TOC if there are 3+ h3 headings

        const toc = document.createElement('div');
        toc.className = 'table-of-contents';
        toc.style.cssText = `
            background: var(--white);
            padding: 25px;
            border-radius: 12px;
            margin: 30px 0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            border-left: 5px solid var(--secondary-blue);
        `;

        const tocTitle = document.createElement('h4');
        tocTitle.textContent = 'Table des matières';
        tocTitle.style.marginTop = '0';
        toc.appendChild(tocTitle);

        const tocList = document.createElement('ul');
        tocList.style.cssText = `
            list-style: none;
            margin-left: 0;
            padding-left: 0;
        `;

        headings.forEach((heading, index) => {
            const id = 'section-' + index;
            heading.id = id;

            const li = document.createElement('li');
            li.style.marginBottom = '8px';

            const link = document.createElement('a');
            link.href = '#' + id;
            link.textContent = heading.textContent;
            link.style.cssText = `
                color: var(--secondary-blue);
                text-decoration: none;
                transition: color 0.3s ease;
            `;
            link.addEventListener('mouseenter', () => {
                link.style.color = 'var(--primary-blue-dark)';
            });
            link.addEventListener('mouseleave', () => {
                link.style.color = 'var(--secondary-blue)';
            });

            li.appendChild(link);
            tocList.appendChild(li);
        });

        toc.appendChild(tocList);

        // Insert TOC after first section
        const firstSection = article.querySelector('.content-section');
        if (firstSection) {
            firstSection.after(toc);
        }
    };

    // Only generate TOC on content pages (not index or contact)
    if (document.querySelector('.content-article') &&
        !window.location.pathname.endsWith('index.html') &&
        !window.location.pathname.endsWith('contact.html') &&
        window.location.pathname !== '/') {
        generateTOC();
    }

    // Search functionality (basic)
    const addSearchBox = () => {
        // This is a placeholder for future search functionality
        // Could be implemented with a search index and fuzzy matching
    };

    console.log('Architecture des Ordinateurs - Site chargé avec succès!');
});
