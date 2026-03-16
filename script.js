// Global variables
let isPlaying = false;
let currentPage = 1;
let noClickCount = 0;
const music = document.getElementById('bg-music');
const playBtn = document.getElementById('play-btn');
const playIcon = document.getElementById('play-icon');
const vinyl = document.getElementById('vinyl');
const progress = document.getElementById('progress');

// Initialize floating hearts background
function createFloatingHearts() {
    const container = document.getElementById('floating-hearts');
    const colors = ['💖', '💕', '💗', '💓', '💝', '😍', '✨'];
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'bg-heart';
        heart.textContent = colors[Math.floor(Math.random() * colors.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 5 + 10) + 's';
        heart.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(heart);
        
        setTimeout(() => heart.remove(), 15000);
    }, 2000);
}

// Page Navigation
function nextPage(pageNum) {
    const current = document.getElementById(`page-${currentPage}`);
    const next = document.getElementById(`page-${pageNum}`);
    
    current.classList.remove('active');
    current.classList.add('hidden-left');
    
    setTimeout(() => {
        current.classList.add('hidden');
        current.classList.remove('hidden-left');
        next.classList.remove('hidden');
        
        setTimeout(() => {
            next.classList.add('active');
        }, 50);
    }, 300);
    
    currentPage = pageNum;
    
    // Start progress bar on music page
    if (pageNum === 2) {
        setTimeout(() => {
            progress.style.width = '30%';
        }, 500);
    }
}

// Music Controls
function toggleMusic() {
    if (isPlaying) {
        music.pause();
        playIcon.setAttribute('data-lucide', 'play');
        vinyl.classList.add('paused');
        lucide.createIcons();
        isPlaying = false;
    } else {
        music.play().catch(e => console.log('Audio play failed:', e));
        playIcon.setAttribute('data-lucide', 'pause');
        vinyl.classList.remove('paused');
        lucide.createIcons();
        isPlaying = true;
        
        // Simulate progress
        let width = 30;
        const interval = setInterval(() => {
            if (!isPlaying) {
                clearInterval(interval);
                return;
            }
            width += 0.5;
            if (width > 100) width = 0;
            progress.style.width = width + '%';
        }, 1000);
    }
}

// Reason Cards Toggle Function (Ganti dari Photo Carousel)
function toggleReason(card) {
    const front = card.querySelector('.front');
    const back = card.querySelector('.back');
    const isRevealed = !back.classList.contains('hidden');
    
    if (isRevealed) {
        // Flip back
        back.classList.add('hidden');
        front.classList.remove('hidden');
        card.classList.remove('bg-pink-50', 'ring-2', 'ring-pink-300');
        
        // Remove floating animation from icon
        const iconContainer = front.querySelector('div');
        iconContainer.classList.remove('animate-bounce');
    } else {
        // Reveal answer
        front.classList.add('hidden');
        back.classList.remove('hidden');
        card.classList.add('bg-pink-50', 'ring-2', 'ring-pink-300');
        
        // Add bounce animation to icon container
        const iconContainer = front.querySelector('div');
        iconContainer.classList.add('animate-bounce');
        
        // Create mini heart burst
        createMiniHearts({ 
            clientX: card.getBoundingClientRect().left + card.offsetWidth/2, 
            clientY: card.getBoundingClientRect().top + card.offsetHeight/2,
            target: card
        });
    }
}

// Mini hearts effect when tapping special card
function createMiniHearts(event) {
    const rect = event.target.closest('.col-span-2') || event.target;
    const hearts = ['💖', '💕', '💗', '💓', '💝'];
    
    for (let i = 0; i < 6; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'mini-heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = (Math.random() * 100) + '%';
            heart.style.top = '50%';
            heart.style.animationDelay = (Math.random() * 0.5) + 's';
            
            if (event.target && event.target.closest) {
                // If called from card click
                event.target.closest('#reasons-grid').appendChild(heart);
            } else {
                document.body.appendChild(heart);
            }
            
            setTimeout(() => heart.remove(), 1500);
        }, i * 100);
    }
}

// No Button Logic (Funny escape)
function sayNo() {
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    
    noClickCount++;
    
    if (noClickCount === 1) {
        noBtn.textContent = 'Yakin? 🥺';
        noBtn.classList.add('bg-pink-100');
    } else if (noClickCount === 2) {
        noBtn.textContent = 'Beneran nih? 😢';
        noBtn.style.transform = 'translateX(-20px)';
    } else if (noClickCount === 3) {
        // Make button run away
        noBtn.classList.add('no-escape');
        noBtn.style.position = 'absolute';
        noBtn.style.transform = `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)`;
        noBtn.textContent = 'Tangkap dulu! 😝';
        
        // Make yes button bigger
        yesBtn.style.transform = 'scale(1.2)';
        yesBtn.textContent = 'Pilih akuu! ❤️';
    } else {
        // Random position
        const x = Math.random() * 200 - 100;
        const y = Math.random() * 200 - 100;
        noBtn.style.transform = `translate(${x}px, ${y}px)`;
        noBtn.textContent = ['Gamau!', 'Skip!', 'Next!', 'Nope!'][Math.floor(Math.random() * 4)];
    }
    
    // Create floating hearts around yes button
    createHeartBurst(yesBtn);
}

// Yes Button Logic
function sayYes() {
    // Celebration effects
    createHeartRain();
    createConfetti();
    
    setTimeout(() => {
        nextPage(5);
    }, 1000);
}

// Heart Burst Effect
function createHeartBurst(element) {
    const rect = element.getBoundingClientRect();
    const hearts = ['💖', '💕', '💗', '💓'];
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart-particle';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = (rect.left + rect.width / 2 + (Math.random() * 60 - 30)) + 'px';
            heart.style.top = (rect.top + (Math.random() * 20)) + 'px';
            document.body.appendChild(heart);
            
            setTimeout(() => heart.remove(), 4000);
        }, i * 100);
    }
}

// Heart Rain Effect
function createHeartRain() {
    const hearts = ['💖', '💕', '💗', '💓', '💝', '😍', '💘', '❤️'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.position = 'fixed';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = '-50px';
            heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
            heart.style.zIndex = '9999';
            heart.style.animation = `fall ${Math.random() * 2 + 2}s linear forwards`;
            heart.style.pointerEvents = 'none';
            document.body.appendChild(heart);
            
            setTimeout(() => heart.remove(), 4000);
        }, i * 100);
    }
}

// Confetti Effect
function createConfetti() {
    const colors = ['#ec4899', '#a855f7', '#f472b6', '#c084fc', '#fbcfe8'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }, i * 50);
    }
}

// Add fall animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(${Math.random() * 360}deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createFloatingHearts();
    
    // Simulate typing effect for page 4
    const texts = document.querySelectorAll('[class*="typing-text-"]');
    texts.forEach((text, index) => {
        text.style.opacity = '0';
        setTimeout(() => {
            text.style.transition = 'opacity 0.5s';
            text.style.opacity = '1';
        }, 1000 + (index * 800));
    });
});

// Prevent context menu on images (optional)
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});