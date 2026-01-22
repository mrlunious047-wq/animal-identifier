// ===== Animal Identifier JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initUpload();
    initFAQ();
    initTabs();
    initAnimations();
});

// ===== Navigation =====
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '12px 0';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '16px 0';
            navbar.style.boxShadow = 'none';
        }
    });
    
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
        });
    }
}

// ===== File Upload =====
function initUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const uploadPreview = document.getElementById('uploadPreview');
    const previewImage = document.getElementById('previewImage');
    const removeImage = document.getElementById('removeImage');
    const identifyBtn = document.getElementById('identifyBtn');
    const resultArea = document.getElementById('resultArea');
    const uploadContent = document.querySelector('.upload-content');
    
    if (!uploadArea || !fileInput) return;
    
    uploadArea.addEventListener('click', (e) => {
        if (e.target !== removeImage && !e.target.closest('.remove-image')) {
            fileInput.click();
        }
    });
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });
    
    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            uploadContent.style.display = 'none';
            uploadPreview.classList.add('active');
            identifyBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }
    
    if (removeImage) {
        removeImage.addEventListener('click', (e) => {
            e.stopPropagation();
            previewImage.src = '';
            uploadContent.style.display = 'block';
            uploadPreview.classList.remove('active');
            identifyBtn.disabled = true;
            fileInput.value = '';
            resultArea.classList.remove('active');
        });
    }
    
    if (identifyBtn) {
        identifyBtn.addEventListener('click', () => {
            identifyBtn.innerHTML = '<span class="btn-icon">⏳</span> Analyzing...';
            identifyBtn.disabled = true;
            
            setTimeout(() => {
                showResult();
                identifyBtn.innerHTML = '<span class="btn-icon">🔍</span> Identify Animal';
                identifyBtn.disabled = false;
            }, 2000);
        });
    }
    
    function showResult() {
        const animals = [
            {
                name: 'African Lion',
                scientific: 'Panthera leo',
                confidence: '94%',
                emoji: '🦁',
                habitat: 'African Savanna',
                diet: 'Carnivore',
                size: '1.2m tall',
                status: 'Vulnerable',
                description: 'The lion is a large cat of the genus Panthera native to Africa and India. It has a muscular, broad-chested body; a short, rounded head; round ears; and a hairy tuft at the end of its tail.'
            },
            {
                name: 'Red Fox',
                scientific: 'Vulpes vulpes',
                confidence: '96%',
                emoji: '🦊',
                habitat: 'Northern Hemisphere',
                diet: 'Omnivore',
                size: '45-90cm',
                status: 'Least Concern',
                description: 'The red fox is the largest of the true foxes and one of the most widely distributed members of the order Carnivora, being present across the entire Northern Hemisphere.'
            },
            {
                name: 'Bengal Tiger',
                scientific: 'Panthera tigris',
                confidence: '91%',
                emoji: '🐅',
                habitat: 'Indian Subcontinent',
                diet: 'Carnivore',
                size: '1.1m tall',
                status: 'Endangered',
                description: 'The Bengal tiger is a tiger subspecies native to the Indian subcontinent. It is the most numerous tiger subspecies and accounts for about half of all wild tigers.'
            },
            {
                name: 'Gray Wolf',
                scientific: 'Canis lupus',
                confidence: '89%',
                emoji: '🐺',
                habitat: 'North America, Eurasia',
                diet: 'Carnivore',
                size: '80-85cm tall',
                status: 'Least Concern',
                description: 'The wolf is a large canine native to Eurasia and North America. It is the largest extant member of the family Canidae, with males averaging 40 kg and females 37 kg.'
            },
            {
                name: 'Giant Panda',
                scientific: 'Ailuropoda melanoleuca',
                confidence: '97%',
                emoji: '🐼',
                habitat: 'Central China',
                diet: 'Herbivore',
                size: '1.2-1.9m',
                status: 'Vulnerable',
                description: 'The giant panda is a bear species endemic to China. It is characterized by its bold black-and-white coat and rotund body. The name "giant panda" is sometimes used to distinguish it from the red panda.'
            },
            {
                name: 'Bald Eagle',
                scientific: 'Haliaeetus leucocephalus',
                confidence: '95%',
                emoji: '🦅',
                habitat: 'North America',
                diet: 'Carnivore',
                size: '70-102cm',
                status: 'Least Concern',
                description: 'The bald eagle is a bird of prey found in North America. A sea eagle, it has two known subspecies and forms a species pair with the white-tailed eagle.'
            }
        ];
        
        const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
        
        document.getElementById('animalName').textContent = randomAnimal.name;
        document.getElementById('scientificName').textContent = randomAnimal.scientific;
        document.getElementById('confidenceScore').textContent = randomAnimal.confidence;
        document.getElementById('resultImage').textContent = randomAnimal.emoji;
        document.getElementById('habitat').textContent = randomAnimal.habitat;
        document.getElementById('diet').textContent = randomAnimal.diet;
        document.getElementById('size').textContent = randomAnimal.size;
        document.getElementById('status').textContent = randomAnimal.status;
        document.getElementById('description').textContent = randomAnimal.description;
        
        const statusEl = document.getElementById('status');
        statusEl.className = 'detail-value';
        if (randomAnimal.status === 'Vulnerable') {
            statusEl.classList.add('status-vulnerable');
        } else if (randomAnimal.status === 'Endangered') {
            statusEl.classList.add('status-endangered');
        }
        
        resultArea.classList.add('active');
        
        setTimeout(() => {
            resultArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
}

// ===== FAQ Accordion =====
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            faqItems.forEach(i => i.classList.remove('active'));
            
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// ===== Encyclopedia Tabs =====
function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const tiles = document.querySelectorAll('.animal-tile');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;
            
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            tiles.forEach(tile => {
                if (category === 'all' || tile.dataset.category === category) {
                    tile.style.display = 'block';
                    tile.style.animation = 'fadeInUp 0.4s ease-out';
                } else {
                    tile.style.display = 'none';
                }
            });
        });
    });
}

// ===== Scroll Animations =====
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const animateElements = document.querySelectorAll(
        '.feature-card, .step, .animal-tile, .faq-item, .section-header'
    );
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        el.style.transitionDelay = `${index * 0.05}s`;
        observer.observe(el);
    });
    
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// ===== Smooth scroll for all anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});
