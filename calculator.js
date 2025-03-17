// Enhanced Calculator JavaScript

// DOM Elements
const display = document.getElementById("display");
const historyDisplay = document.getElementById("history-display");
const scientificPanel = document.getElementById("scientific-panel");
const themeSwitch = document.getElementById("theme-switch");
const dropdownBtn = document.getElementById("dropdown-btn");
const dropdownContent = document.querySelector(".dropdown-content");
const calcTypeDisplay = document.getElementById("calc-type-display");
const historyBtn = document.getElementById("history-btn");
const historyPanel = document.getElementById("history-panel");
const clearHistoryBtn = document.getElementById("clear-history");
const historyContent = document.querySelector(".history-content");

// Calculator state
let memory = 0;
let hasMemory = false;
let lastCalculation = "";
let calculationHistory = [];
let isScientificMode = false;

// Initialize the calculator
function initCalculator() {
    display.value = "";
    historyDisplay.textContent = "";
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('calculatorTheme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeSwitch.checked = true;
    }
    
    // Check for saved mode preference
    const savedMode = localStorage.getItem('calculatorMode');
    if (savedMode === 'scientific') {
        toggleScientificMode(true);
    }
    
    // Load saved history
    loadHistory();
}

// Event Listeners
window.addEventListener('DOMContentLoaded', initCalculator);

themeSwitch.addEventListener('change', function() {
    if (this.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('calculatorTheme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('calculatorTheme', 'light');
    }
});

dropdownBtn.addEventListener('click', function() {
    dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
});

// Close the dropdown when clicking outside
window.addEventListener('click', function(event) {
    if (!event.target.matches('#dropdown-btn') && !event.target.matches('.fa-chevron-down')) {
        dropdownContent.style.display = "none";
    }
});

// Calculator mode selection
document.querySelectorAll('.dropdown-content a').forEach(function(item) {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const type = this.getAttribute('data-type');
        calcTypeDisplay.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        dropdownContent.style.display = "none";
        
        if (type === 'scientific') {
            toggleScientificMode(true);
        } else {
            toggleScientificMode(false);
        }
    });
});

// Toggle scientific mode
function toggleScientificMode(enable) {
    isScientificMode = enable;
    if (enable) {
        scientificPanel.style.display = "grid";
        localStorage.setItem('calculatorMode', 'scientific');
    } else {
        scientificPanel.style.display = "none";
        localStorage.setItem('calculatorMode', 'standard');
    }
}

// History panel toggle
historyBtn.addEventListener('click', function() {
    historyPanel.classList.toggle('active');
});

// Clear history
clearHistoryBtn.addEventListener('click', function() {
    calculationHistory = [];
    historyContent.innerHTML = "";
    localStorage.removeItem('calculatorHistory');
});

// Basic calculator functions
function appendToDisplay(input) {
    // Add visual feedback
    const button = document.querySelector(`button[onclick="appendToDisplay('${input}')"]`);
    if (button) {
        button.classList.add('button-press');
        setTimeout(() => button.classList.remove('button-press'), 150);
    }
    
    // Handle display
    if (display.value === "Error") {
        display.value = "";
    }
    
    // Format for better readability (future enhancement)
    display.value += input;
}

function clearDisplay() {
    display.value = "";
    historyDisplay.textContent = "";
}

function clearEntry() {
    display.value = "";
}

function backspace() {
    display.value = display.value.slice(0, -1);
}

function toggleSign() {
    if (display.value !== "") {
        try {
            // Evaluate the expression first if it's complex
            if (display.value.match(/[+\-*/%]/)) {
                calculate();
            }
            display.value = (parseFloat(display.value) * -1).toString();
        } catch (error) {
            display.value = "Error";
        }
    }
}

function calculate() {
    try {
        if (display.value === "") return;
        
        // Save the expression
        const expression = display.value;
        historyDisplay.textContent = expression;
        
        // Handle percentage calculations
        const expressionWithPercentages = expression.replace(/(\d+\.?\d*)%/g, function(match, number) {
            return number / 100;
        });
        
        // Evaluate the expression
        const result = eval(expressionWithPercentages);
        
        // Format the result based on its value
        let formattedResult;
        if (Number.isInteger(result)) {
            formattedResult = result.toString();
        } else {
            // Show up to 8 decimal places, but remove trailing zeros
            formattedResult = parseFloat(result.toFixed(8)).toString();
        }
        
        // Update the display
        display.value = formattedResult;
        
        // Add to history
        addToHistory(expression, formattedResult);
        
    } catch (error) {
        display.value = "Error";
    }
}

// Scientific calculator functions
function calculateFunction(func) {
    try {
        let value = parseFloat(display.value);
        let result;
        let expression = "";
        
        switch (func) {
            case 'sqrt':
                expression = `√(${display.value})`;
                result = Math.sqrt(value);
                break;
            case 'square':
                expression = `(${display.value})²`;
                result = Math.pow(value, 2);
                break;
            case 'cube':
                expression = `(${display.value})³`;
                result = Math.pow(value, 3);
                break;
            case 'power':
                display.value += "^";
                return;
            case 'inverse':
                expression = `1/(${display.value})`;
                result = 1 / value;
                break;
            case 'sin':
                expression = `sin(${display.value})`;
                result = Math.sin(value * Math.PI / 180); // Using degrees
                break;
            case 'cos':
                expression = `cos(${display.value})`;
                result = Math.cos(value * Math.PI / 180); // Using degrees
                break;
            case 'tan':
                expression = `tan(${display.value})`;
                result = Math.tan(value * Math.PI / 180); // Using degrees
                break;
            case 'log':
                expression = `log(${display.value})`;
                result = Math.log10(value);
                break;
            case 'ln':
                expression = `ln(${display.value})`;
                result = Math.log(value);
                break;
            case 'pi':
                display.value = Math.PI.toString();
                return;
            default:
                return;
        }
        
        // Format the result
        if (Number.isInteger(result)) {
            result = result.toString();
        } else {
            result = parseFloat(result.toFixed(8)).toString();
        }
        
        // Update displays
        historyDisplay.textContent = expression;
        display.value = result;
        
        // Add to history
        addToHistory(expression, result);
        
    } catch (error) {
        display.value = "Error";
    }
}

// Memory functions
function memoryOperation(operation) {
    try {
        const currentValue = parseFloat(display.value || "0");
        
        switch (operation) {
            case 'mc': // Memory Clear
                memory = 0;
                hasMemory = false;
                break;
            case 'mr': // Memory Recall
                if (hasMemory) {
                    display.value = memory.toString();
                }
                break;
            case 'm+': // Memory Add
                memory += currentValue;
                hasMemory = true;
                break;
            case 'm-': // Memory Subtract
                memory -= currentValue;
                hasMemory = true;
                break;
            case 'ms': // Memory Store
                memory = currentValue;
                hasMemory = true;
                break;
        }
    } catch (error) {
        display.value = "Error";
    }
}

// History management
function addToHistory(expression, result) {
    const historyItem = {
        expression: expression,
        result: result,
        timestamp: new Date().getTime()
    };
    
    calculationHistory.unshift(historyItem); // Add to beginning
    
    // Limit history size
    if (calculationHistory.length > 50) {
        calculationHistory.pop();
    }
    
    // Save to local storage
    saveHistory();
    
    // Update history panel
    updateHistoryPanel();
}

function updateHistoryPanel() {
    historyContent.innerHTML = "";
    
    calculationHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        
        const historyExpression = document.createElement('div');
        historyExpression.classList.add('history-expression');
        historyExpression.textContent = item.expression;
        
        const historyResult = document.createElement('div');
        historyResult.classList.add('history-result');
        historyResult.textContent = item.result;
        
        historyItem.appendChild(historyExpression);
        historyItem.appendChild(historyResult);
        
        // Click to load this calculation
        historyItem.addEventListener('click', function() {
            display.value = item.result;
            historyDisplay.textContent = item.expression;
        });
        
        historyContent.appendChild(historyItem);
    });
}

function saveHistory() {
    localStorage.setItem('calculatorHistory', JSON.stringify(calculationHistory));
}

function loadHistory() {
    const savedHistory = localStorage.getItem('calculatorHistory');
    if (savedHistory) {
        calculationHistory = JSON.parse(savedHistory);
        updateHistoryPanel();
    }
}

// Handle keyboard input
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Number and operator keys
    if (/^[0-9.]$/.test(key)) {
        appendToDisplay(key);
    } else if (/^[+\-*/]$/.test(key)) {
        appendToDisplay(key);
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Escape') {
        clearDisplay();
    } else if (key === 'Backspace') {
        backspace();
    } else if (key === '%') {
        appendToDisplay('%');
    } else if (key === '(' || key === ')') {
        appendToDisplay(key);
    } else if (key === '^') {
        appendToDisplay('^');
    }
});

// Special handling for exponents and other complex operations
const originalEval = window.eval;
window.eval = function(expression) {
    // Replace ^ with ** for exponentiation
    expression = expression.replace(/(\d+\.?\d*)\^(\d+\.?\d*)/g, "Math.pow($1, $2)");
    
    return originalEval(expression);
};