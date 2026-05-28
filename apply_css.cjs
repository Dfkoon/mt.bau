const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'pages', 'Quiz.css');

const premiumCSS = `
/* ========================================= */
/* 🌟🌟🌟 PREMIUM GLASSMORPHISM OVERRIDES 🌟🌟🌟 */
/* ========================================= */

/* Dark, sleek background for the whole page */
.quiz-page, .quiz-page-container {
    background: linear-gradient(135deg, #09090e 0%, #151522 100%) !important;
    color: #ffffff;
}

/* Hero Section Enhancement */
.quiz-hero {
    position: relative;
    min-height: 400px;
    border-radius: 0 0 30px 30px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.hero-overlay {
    background: linear-gradient(to bottom, rgba(9, 9, 14, 0.2), #09090e) !important;
}

.hero-title {
    background: linear-gradient(to right, #fff, #a5b4fc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 30px rgba(165, 180, 252, 0.3);
}

/* Glassmorphism Cards */
.quiz-category-card.glass-card {
    background: rgba(255, 255, 255, 0.03) !important;
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-radius: 24px;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
}

.quiz-category-card.glass-card:hover {
    transform: translateY(-12px) scale(1.02) !important;
    border-color: var(--category-color, #fff) !important;
    box-shadow: 0 15px 45px rgba(0, 0, 0, 0.5), 0 0 20px rgba(var(--primary-rgb, 255, 255, 255), 0.2) !important;
    background: rgba(255, 255, 255, 0.06) !important;
}

.quiz-category-card h3 {
    font-weight: 800;
    letter-spacing: 0.5px;
}

/* Start Button within Card */
.start-btn {
    border-radius: 50px !important;
    background: rgba(255,255,255,0.05) !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 0.9rem;
}

.quiz-category-card:hover .start-btn {
    background: var(--category-color) !important;
    border-color: var(--category-color) !important;
    box-shadow: 0 0 15px var(--category-color);
}

/* Option Buttons (Answers) */
.option-row-premium {
    background: rgba(255, 255, 255, 0.02) !important;
    border: 1px solid rgba(255, 255, 255, 0.05) !important;
    border-radius: 16px !important;
    padding: 1.25rem 1.5rem !important;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
    position: relative;
    overflow: hidden;
}

.option-row-premium:hover {
    background: rgba(255, 255, 255, 0.06) !important;
    border-color: rgba(255, 255, 255, 0.2) !important;
    transform: translateX(5px);
}

.option-row-premium.selected {
    background: rgba(var(--category-color-rgb, 33, 150, 243), 0.15) !important;
    border-color: var(--category-color, #2196f3) !important;
    box-shadow: 0 0 20px rgba(var(--category-color-rgb, 33, 150, 243), 0.2);
    transform: scale(1.02);
}

/* Progress Bar Glowing Effect */
.quiz-progress-bar {
    height: 8px !important;
    background: rgba(255,255,255,0.05) !important;
    border-radius: 50px !important;
    overflow: hidden;
    margin-bottom: 2rem;
}

.progress-fill {
    height: 100% !important;
    border-radius: 50px !important;
    box-shadow: 0 0 15px currentColor !important;
    transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1) !important;
}

/* Results Screen Glow */
.score-circle {
    box-shadow: 0 0 40px rgba(var(--primary-rgb), 0.3), inset 0 0 20px rgba(0,0,0,0.5);
    border: none !important;
    position: relative;
}

.score-circle::before {
    content: '';
    position: absolute;
    inset: -10px;
    border-radius: 50%;
    background: conic-gradient(var(--primary) var(--percentage), transparent 0);
    opacity: 0.3;
    filter: blur(15px);
    z-index: -1;
}

.premium-score-wrapper .score-progress-circle {
    filter: drop-shadow(0 0 8px currentColor);
    transition: stroke-dashoffset 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Review Cards */
.review-card {
    background: rgba(255, 255, 255, 0.02) !important;
    border: 1px solid rgba(255, 255, 255, 0.05) !important;
    border-radius: 16px !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
}

.review-card.correct {
    border-right: 4px solid #10b981 !important;
    background: linear-gradient(90deg, rgba(16, 185, 129, 0.05) 0%, transparent 100%) !important;
}

.review-card.incorrect {
    border-right: 4px solid #ef4444 !important;
    background: linear-gradient(90deg, rgba(239, 68, 68, 0.05) 0%, transparent 100%) !important;
}

.status-badge.pass {
    background: rgba(16, 185, 129, 0.2) !important;
    color: #10b981 !important;
    box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
}

.status-badge.fail {
    background: rgba(239, 68, 68, 0.2) !important;
    color: #ef4444 !important;
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
}
`;

fs.appendFileSync(cssPath, premiumCSS);
console.log('CSS updated successfully!');
