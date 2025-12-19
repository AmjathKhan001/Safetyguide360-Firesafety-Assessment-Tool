// Question weights (importance scores) - Updated with correct question mapping
const questionWeights = {
    q1: 3,    // Number of floors
    q2: 2,    // Number of families
    q3: 1,    // Floor number
    q4: 8,    // Fire extinguisher in residence
    q5: 5,    // Fire extinguisher in common area
    q6: 6,    // Fire sprinkler
    q7: 8,    // Smoke detector
    q8: 3,    // Used extinguisher before
    q9: 2,    // Neighbor used extinguisher
    q10: 4,   // Firemen visit
    q11: 2,   // Building age
    q12: 3,   // Distance to fire station
    q13: 4,   // Fire drill conducted
    q14: 1,   // Balcony
    q15: 10,  // Escape routes (MOST IMPORTANT)
    q16: 2,   // Car parking
    q17: 4,   // Extinguisher in parking
    q18: 3,   // Workplace extinguisher
    q19: 5,   // Manual call point
    q20: 6,   // Fire blanket
    q21: 7,   // Fire hydrant system
    q22: 4    // ISI awareness
};

// Maximum possible score
const maxScore = Object.values(questionWeights).reduce((a, b) => a + b, 0);

// Positive answers for scoring - Updated to match your form
const positiveAnswers = {
    q1: ['2', '3-4'],  // Lower buildings are generally safer
    q2: ['1-5', '6-10'], // Smaller number of families
    q3: ['0', '1', '2'], // Lower floors safer for evacuation
    q4: 'yes',      // Extinguisher in residence
    q5: 'yes',      // Extinguisher in common area
    q6: 'yes',      // Fire sprinkler
    q7: 'yes',      // Smoke detector
    q8: 'yes',      // Used extinguisher (experience is good)
    q9: 'no',       // No neighbor incidents
    q10: 'no',      // No firemen visits (no emergencies)
    q11: '<4',      // Newer building
    q12: '<5',      // Close to fire station
    q13: 'yes',     // Fire drill conducted
    q14: 'yes',     // Has balcony (alternative escape)
    q15: ['2', '3', '4'],  // Multiple escape routes
    q16: 'yes',     // Has designated parking
    q17: 'yes',     // Extinguisher in parking
    q18: 'yes',     // Workplace has extinguisher
    q19: 'yes',     // Manual call point
    q20: 'yes',     // Fire blanket
    q21: 'yes',     // Fire hydrant
    q22: 'yes'      // Aware of ISI marks
};

// Recommendations for each question - Updated to match categories
const recommendations = {
    q1: "💡 Consider: Higher buildings require more safety measures. Ensure all fire safety systems are properly maintained.",
    q2: "💡 Note: More families mean higher evacuation complexity. Regular drills are essential.",
    q3: "💡 Tip: Higher floors need more escape route planning. Know your building's evacuation plan.",
    q4: "🚨 HIGH PRIORITY: Install at least one ABC-type fire extinguisher in your residence. Keep it accessible and know how to use it.",
    q5: "⚠️ MEDIUM PRIORITY: Ensure fire extinguishers are available in common areas. They should be visible and easily accessible.",
    q6: "💡 RECOMMENDED: Consider installing fire sprinklers. They provide automatic protection even when you're not home.",
    q7: "🚨 HIGH PRIORITY: Install smoke detectors on every floor, especially near bedrooms. Test them monthly and replace batteries annually.",
    q8: "💡 EXPERIENCE: Practice using fire extinguishers regularly. Remember PASS: Pull, Aim, Squeeze, Sweep.",
    q9: "💡 AWARENESS: Learn from neighbors' experiences. Share safety knowledge within your building community.",
    q10: "⚠️ WARNING: If there have been fire incidents, review and improve your safety measures immediately.",
    q11: "💡 NOTE: Older buildings may need electrical safety upgrades. Check wiring and fire safety systems regularly.",
    q12: "⚠️ CONSIDERATION: If far from fire station, invest in better on-site firefighting equipment and training.",
    q13: "🚨 HIGH PRIORITY: Conduct fire drills at least twice a year. All residents should know evacuation routes and assembly points.",
    q14: "💡 TIP: Balconies can serve as secondary escape routes. Keep them clear and accessible at all times.",
    q15: "🚨 CRITICAL: Ensure at least 2 clear escape routes. Remove all obstructions immediately. Practice using different exits.",
    q16: "💡 SAFETY: Designated parking areas should be well-ventilated and free from fire hazards.",
    q17: "⚠️ MEDIUM PRIORITY: Install fire extinguishers in parking areas. Vehicle fires can spread quickly.",
    q18: "💡 AWARENESS: Your workplace safety matters too. Ensure proper fire safety measures at your office/school.",
    q19: "⚠️ MEDIUM PRIORITY: Manual call points help quick alarm activation. Ensure they're accessible and functional.",
    q20: "🚨 HIGH PRIORITY: Keep a fire blanket in kitchen. It's essential for grease fires. Know how to use it properly.",
    q21: "⚠️ MEDIUM PRIORITY: Fire hydrant systems should be regularly inspected and maintained. Know their locations.",
    q22: "💡 IMPORTANT: Always purchase BIS/ISI marked fire safety equipment (IS 15683). Look for the ISI mark for quality assurance."
};

// Visitor Counter
let visitorCount = localStorage.getItem('fireSafetyVisitors') || Math.floor(Math.random() * 2000) + 1000;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateProgress();
    updateVisitorCounter();
    
    // Add change listeners to all inputs
    const form = document.getElementById('fireSafetyForm');
    if (form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('change', updateProgress);
        });
        
        // Handle form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateAndShowResults();
        });
    }
    
    // Initialize footer visitor count
    const footerCounter = document.getElementById('footerVisitorCount');
    if (footerCounter) {
        footerCounter.textContent = formatNumber(visitorCount);
    }
});

// Update progress bar
function updateProgress() {
    const form = document.getElementById('fireSafetyForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input[type="radio"]:checked, input[type="number"]:not(:placeholder-shown), select:not([value=""])');
    
    const totalQuestions = 22; // Total questions in the form
    const answered = inputs.length;
    const percentage = Math.round((answered / totalQuestions) * 100);
    
    // Update progress bar
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    const progressStats = document.getElementById('progressStats');
    
    if (progressFill) progressFill.style.width = percentage + '%';
    if (progressPercent) progressPercent.textContent = percentage + '%';
    if (progressStats) progressStats.textContent = answered + ' of ' + totalQuestions + ' questions answered';
}

// Visitor Counter Functionality
function updateVisitorCounter() {
    // Increment visitor count on each page load
    visitorCount = parseInt(visitorCount) + 1;
    localStorage.setItem('fireSafetyVisitors', visitorCount);
    
    // Update all counter displays
    const counterElements = [
        document.getElementById('visitorCount'),
        document.getElementById('footerVisitorCount')
    ];
    
    counterElements.forEach(element => {
        if (element) {
            element.textContent = formatNumber(visitorCount);
        }
    });
    
    // Simulate live updates every 30 seconds
    setInterval(() => {
        visitorCount = parseInt(visitorCount) + Math.floor(Math.random() * 3) + 1;
        localStorage.setItem('fireSafetyVisitors', visitorCount);
        
        counterElements.forEach(element => {
            if (element) {
                element.textContent = formatNumber(visitorCount);
            }
        });
    }, 30000);
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Calculate score
function calculateScore() {
    const form = document.getElementById('fireSafetyForm');
    if (!form) return null;
    
    let totalScore = 0;
    let maxPossible = 0;
    let missingAnswers = [];
    let riskAreas = [];
    
    // Calculate for each question
    for (let i = 1; i <= 22; i++) {
        const questionKey = 'q' + i;
        const weight = questionWeights[questionKey];
        
        if (!weight) continue; // Skip if no weight defined
        
        maxPossible += weight;
        
        const element = form.querySelector(`[name="${questionKey}"]`);
        if (!element) continue;
        
        let answer;
        
        // Get answer based on input type
        if (element.type === 'radio') {
            const selected = form.querySelector(`[name="${questionKey}"]:checked`);
            answer = selected ? selected.value : null;
        } else if (element.type === 'number') {
            answer = element.value;
        } else {
            answer = element.value;
        }
        
        if (!answer) {
            missingAnswers.push(i);
            continue;
        }
        
        // Check if answer is positive
        const positiveAnswer = positiveAnswers[questionKey];
        let isPositive = false;
        
        if (Array.isArray(positiveAnswer)) {
            isPositive = positiveAnswer.includes(answer);
        } else {
            isPositive = answer === positiveAnswer;
        }
        
        if (isPositive) {
            totalScore += weight;
        } else {
            // Add to risk areas if negative answer
            riskAreas.push({
                question: i,
                questionKey: questionKey,
                answer: answer,
                recommendation: recommendations[questionKey] || "Review this safety aspect",
                weight: weight
            });
        }
    }
    
    // Calculate percentage score
    const percentageScore = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;
    
    return {
        score: totalScore,
        maxPossible: maxPossible,
        percentage: percentageScore,
        missing: missingAnswers,
        riskAreas: riskAreas,
        totalQuestions: 22,
        answered: 22 - missingAnswers.length
    };
}

// Get safety level based on score
function getSafetyLevel(percentage) {
    if (percentage >= 85) {
        return {
            level: "Excellent Safety",
            color: "#34bf49",
            icon: "✅",
            description: "Your building has excellent fire safety measures. Maintain regular checks and continue safety awareness."
        };
    } else if (percentage >= 70) {
        return {
            level: "Good Safety",
            color: "#8BC34A",
            icon: "👍",
            description: "Good fire safety measures in place. Address the recommendations below to achieve excellent safety."
        };
    } else if (percentage >= 50) {
        return {
            level: "Moderate Safety",
            color: "#ff9900",
            icon: "⚠️",
            description: "Moderate fire safety. Important improvements needed. Focus on high priority recommendations."
        };
    } else if (percentage >= 30) {
        return {
            level: "Needs Improvement",
            color: "#ff9900",
            icon: "🔔",
            description: "Significant fire safety improvements required. Address critical issues immediately."
        };
    } else {
        return {
            level: "High Risk",
            color: "#ff4c4c",
            icon: "🚨",
            description: "Immediate action required to address critical fire safety issues. Safety should be top priority."
        };
    }
}

// Calculate and show results
function calculateAndShowResults() {
    const results = calculateScore();
    if (!results) {
        alert('Please fill in the form to get your safety score.');
        return;
    }
    
    const safetyLevel = getSafetyLevel(results.percentage);
    
    // Store results in sessionStorage for report.html
    sessionStorage.setItem('fireSafetyResults', JSON.stringify({
        score: results.percentage,
        safetyLevel: safetyLevel,
        riskAreas: results.riskAreas,
        missing: results.missing,
        answered: results.answered,
        timestamp: new Date().toISOString()
    }));
    
    // Redirect to report page
    window.location.href = 'report.html';
}

// Enhanced PDF Download Function
function downloadPDF() {
    const results = JSON.parse(sessionStorage.getItem('fireSafetyResults'));
    
    if (!results) {
        alert('Please complete the assessment first.');
        window.location.href = 'index.html';
        return;
    }
    
    // Create a printable version
    const printWindow = window.open('', '_blank');
    const reportDate = new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const criticalRisks = results.riskAreas.filter(r => r.recommendation.includes('🚨 CRITICAL') || r.recommendation.includes('🚨 HIGH PRIORITY'));
    const highRisks = results.riskAreas.filter(r => r.recommendation.includes('🚨 HIGH PRIORITY') && !r.recommendation.includes('🚨 CRITICAL'));
    const mediumRisks = results.riskAreas.filter(r => !r.recommendation.includes('🚨 CRITICAL') && !r.recommendation.includes('🚨 HIGH PRIORITY'));
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Fire Safety Assessment Report - ${reportDate}</title>
            <style>
                body { 
                    font-family: 'Segoe UI', Arial, sans-serif; 
                    margin: 40px; 
                    color: #000000; 
                    background: white;
                    line-height: 1.6;
                }
                .header { 
                    text-align: center; 
                    margin-bottom: 40px; 
                    border-bottom: 3px solid #ff4c4c; 
                    padding-bottom: 20px; 
                }
                h1 { 
                    color: #ff4c4c; 
                    margin-bottom: 10px;
                    font-size: 28px;
                }
                .score-section { 
                    margin: 30px 0; 
                    padding: 25px; 
                    background: #f0f4f8; 
                    border-radius: 10px; 
                    border: 2px solid #0099e5;
                }
                .score-circle { 
                    width: 120px; 
                    height: 120px; 
                    border-radius: 50%; 
                    background: #ff4c4c; 
                    color: white; 
                    display: flex; 
                    flex-direction: column; 
                    justify-content: center; 
                    align-items: center; 
                    margin: 0 auto 20px; 
                }
                .score-value { 
                    font-size: 2.5rem; 
                    font-weight: bold; 
                }
                .recommendations-grid {
                    display: grid;
                    gap: 20px;
                    margin: 30px 0;
                }
                .priority-section {
                    margin: 20px 0;
                    padding: 20px;
                    border-radius: 8px;
                }
                .critical { background: #ffebee; border-left: 4px solid #ff4c4c; }
                .high { background: #fff3e0; border-left: 4px solid #ff9900; }
                .medium { background: #e8f5e9; border-left: 4px solid #34bf49; }
                .priority-title {
                    font-weight: bold;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .recommendation-item {
                    margin: 10px 0;
                    padding: 10px;
                    background: white;
                    border-radius: 5px;
                    border: 1px solid #e0e0e0;
                }
                .footer { 
                    margin-top: 40px; 
                    padding-top: 20px; 
                    border-top: 2px solid #ccc; 
                    font-size: 12px; 
                    color: #666;
                    text-align: center;
                }
                .contact-info {
                    background: #e3f2fd;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                }
                @media print { 
                    body { 
                        font-size: 12pt; 
                        margin: 20px;
                    }
                    .score-circle {
                        width: 100px;
                        height: 100px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Fire Safety Assessment Report</h1>
                <p><strong>Generated on:</strong> ${reportDate}</p>
                <p><strong>Safety Score:</strong> ${results.score}% - ${results.safetyLevel.level}</p>
            </div>
            
            <div class="score-section">
                <h2>Assessment Summary</h2>
                <div class="score-circle">
                    <span class="score-value">${results.score}%</span>
                    <span>Safety Score</span>
                </div>
                <p><strong>Safety Level:</strong> ${results.safetyLevel.level}</p>
                <p><strong>Safety Description:</strong> ${results.safetyLevel.description}</p>
                <p><strong>Total Recommendations:</strong> ${results.riskAreas.length} areas need improvement</p>
                <p><strong>Questions Answered:</strong> ${results.answered}/22</p>
            </div>
            
            <h2>Safety Recommendations</h2>
            
            ${criticalRisks.length > 0 ? `
            <div class="priority-section critical">
                <div class="priority-title">🚨 Critical Priorities (${criticalRisks.length})</div>
                ${criticalRisks.map(risk => `
                    <div class="recommendation-item">
                        ${risk.recommendation}
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            ${highRisks.length > 0 ? `
            <div class="priority-section high">
                <div class="priority-title">⚠️ High Priorities (${highRisks.length})</div>
                ${highRisks.map(risk => `
                    <div class="recommendation-item">
                        ${risk.recommendation}
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            ${mediumRisks.length > 0 ? `
            <div class="priority-section medium">
                <div class="priority-title">💡 Medium Priorities (${mediumRisks.length})</div>
                ${mediumRisks.map(risk => `
                    <div class="recommendation-item">
                        ${risk.recommendation}
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            <div class="contact-info">
                <h3>Need Professional Help?</h3>
                <p><strong>Amjath Khan - Fire & Life Safety Consultant</strong></p>
                <p>📞 Phone: +91-9750816163</p>
                <p>📧 Email: contact@amjathkhan.com</p>
                <p>🌐 Website: www.amjathkhan.com</p>
            </div>
            
            <div class="footer">
                <p>© ${new Date().getFullYear()} Fire Safety Assessment Tool | Based on BIS Standards IS 2190</p>
                <p>For professional fire safety audits, contact: Amjath Khan - +91-9750816163</p>
                <p><strong>Disclaimer:</strong> This is a self-assessment tool only. It does not replace professional fire safety audits or compliance certifications. Always consult with certified fire safety professionals for official assessments.</p>
                <p>Report generated from: https://firesafetyassessmenttool.vercel.app</p>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
        printWindow.print();
        setTimeout(() => {
            printWindow.close();
        }, 500);
    }, 1000);
}

// Utility function for Amazon tracking
function trackAmazonClick() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'amazon_click', {
            'event_category': 'affiliate',
            'event_label': 'fire_safety_store_click'
        });
    }
}

// Utility function for coffee tracking
function trackCoffeeClick() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'coffee_click', {
            'event_category': 'support',
            'event_label': 'buy_me_coffee_click'
        });
    }
}

// Utility function for tool tracking
function trackToolClick(toolName) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'tool_click', {
            'event_category': 'tools',
            'event_label': toolName
        });
    }
}
