// ===== Animal Identifier JavaScript with Gemini API =====

// Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyC98hxe-BiAec3PVMQ7o1ug9KS2UOvQkfQ';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

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
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== File Upload & Animal Identification =====
function initUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const uploadPreview = document.getElementById('uploadPreview');
    const previewImage = document.getElementById('previewImage');
    const removeImage = document.getElementById('removeImage');
    const identifyBtn = document.getElementById('identifyBtn');
    const resultArea = document.getElementById('resultArea');
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    const uploadContent = document.querySelector('.upload-content');
    
    let currentImageBase64 = null;
    let currentImageSrc = null;
    
    if (!uploadArea || !fileInput) return;
    
    // Click to upload
    uploadArea.addEventListener('click', (e) => {
        if (!e.target.closest('.remove-image')) {
            fileInput.click();
        }
    });
    
    // Drag and drop
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
        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
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
            const base64Data = e.target.result;
            currentImageSrc = base64Data;
            previewImage.src = base64Data;
            currentImageBase64 = base64Data.split(',')[1];
            uploadContent.style.display = 'none';
            uploadPreview.classList.add('active');
            identifyBtn.disabled = false;
            resultArea.classList.remove('active');
            errorState.classList.remove('active');
        };
        reader.readAsDataURL(file);
    }
    
    if (removeImage) {
        removeImage.addEventListener('click', (e) => {
            e.stopPropagation();
            resetUpload();
        });
    }
    
    if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', () => {
            resetUpload();
            errorState.classList.remove('active');
        });
    }
    
    function resetUpload() {
        previewImage.src = '';
        currentImageBase64 = null;
        currentImageSrc = null;
        uploadContent.style.display = 'block';
        uploadPreview.classList.remove('active');
        identifyBtn.disabled = true;
        fileInput.value = '';
        resultArea.classList.remove('active');
        errorState.classList.remove('active');
    }
    
    if (identifyBtn) {
        identifyBtn.addEventListener('click', async () => {
            if (!currentImageBase64) return;
            
            identifyBtn.disabled = true;
            identifyBtn.innerHTML = '<span class="btn-icon">⏳</span> Analyzing...';
            loadingState.classList.add('active');
            resultArea.classList.remove('active');
            errorState.classList.remove('active');
            
            try {
                const animalData = await identifyAnimal(currentImageBase64);
                showResult(animalData, currentImageSrc);
            } catch (error) {
                console.error('Error:', error);
                showError(error.message);
            } finally {
                identifyBtn.innerHTML = '<span class="btn-icon">🔍</span> Identify Animal';
                identifyBtn.disabled = false;
                loadingState.classList.remove('active');
            }
        });
    }
    
    async function identifyAnimal(imageBase64) {
        const prompt = `Analyze this image and identify the animal. Respond with ONLY a valid JSON object (no markdown, no code blocks).

If there IS an animal:
{
    "found": true,
    "name": "Common name",
    "scientificName": "Scientific name",
    "confidencePercent": 95,
    "habitat": "Natural habitat",
    "diet": "Diet type and details",
    "size": "Typical size",
    "conservationStatus": "Conservation status",
    "description": "2-3 sentence description",
    "funFacts": ["Fact 1", "Fact 2", "Fact 3"]
}

If NO animal found:
{
    "found": false,
    "message": "What's in the image"
}

Return ONLY JSON, nothing else.`;

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt },
                        { inline_data: { mime_type: "image/jpeg", data: imageBase64 } }
                    ]
                }],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 1024
                }
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || 'API request failed');
        }

        const data = await response.json();
        let text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        
        if (!text) throw new Error('No response from AI');
        
        // Clean markdown formatting
        text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        const result = JSON.parse(text);
        
        if (!result.found) {
            throw new Error(result.message || 'No animal detected in this image');
        }
        
        return result;
    }
    
    function showResult(data, imageSrc) {
        document.getElementById('resultImagePreview').src = imageSrc;
        document.getElementById('animalName').textContent = data.name || 'Unknown';
        document.getElementById('scientificName').textContent = data.scientificName || '';
        document.getElementById('confidenceScore').textContent = (data.confidencePercent || 90) + '%';
        document.getElementById('habitat').textContent = data.habitat || '--';
        document.getElementById('diet').textContent = data.diet || '--';
        document.getElementById('size').textContent = data.size || '--';
        
        const statusEl = document.getElementById('status');
        statusEl.textContent = data.conservationStatus || '--';
        statusEl.className = 'detail-value';
        
        const status = (data.conservationStatus || '').toLowerCase();
        if (status.includes('vulnerable')) {
            statusEl.classList.add('status-vulnerable');
        } else if (status.includes('endangered')) {
            statusEl.classList.add('status-endangered');
        } else if (status.includes('least concern')) {
            statusEl.classList.add('status-least-concern');
        }
        
        document.getElementById('description').textContent = data.description || '';
        
        const funFactsList = document.getElementById('funFacts');
        funFactsList.innerHTML = '';
        if (data.funFacts && data.funFacts.length > 0) {
            data.funFacts.forEach(fact => {
                const li = document.createElement('li');
                li.textContent = fact;
                funFactsList.appendChild(li);
            });
            document.getElementById('funFactsBox').style.display = 'block';
        } else {
            document.getElementById('funFactsBox').style.display = 'none';
        }
        
        resultArea.classList.add('active');
        
        setTimeout(() => {
            resultArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
    
    function showError(message) {
        document.getElementById('errorMessage').textContent = message || 'Please try with a clearer image of an animal.';
        errorState.classList.add('active');
        
        setTimeout(() => {
            errorState.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
            if (!isActive) item.classList.add('active');
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
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.feature-card, .step, .animal-tile, .faq-item, .section-header').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        el.style.transitionDelay = `${i * 0.05}s`;
        observer.observe(el);
    });
    
    const style = document.createElement('style');
    style.textContent = `.animate-in { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(style);
}
