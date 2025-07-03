let display = document.getElementById('display');
let currentInput = '0';
let operator = null;
let previousInput = null;
let waitingForOperand = false;

function updateDisplay() {
    display.textContent = currentInput;
}

function inputNumber(num) {
    if (waitingForOperand) {
        currentInput = num;
        waitingForOperand = false;
    } else {
        currentInput = currentInput === '0' ? num : currentInput + num;
    }
    updateDisplay();
}

function inputDecimal() {
    if (waitingForOperand) {
        currentInput = '0.';
        waitingForOperand = false;
    } else if (currentInput.indexOf('.') === -1) {
        currentInput += '.';
    }
    updateDisplay();
}

function inputOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    if (previousInput === null) {
        previousInput = inputValue;
    } else if (operator) {
        const currentValue = previousInput || 0;
        const newValue = performCalculation(currentValue, inputValue, operator);

        currentInput = `${parseFloat(newValue.toFixed(7))}`;
        previousInput = newValue;
        updateDisplay();
    }

    waitingForOperand = true;
    operator = nextOperator;
}

function performCalculation(firstOperand, secondOperand, operator) {
    switch (operator) {
        case '+':
            return firstOperand + secondOperand;
        case '-':
            return firstOperand - secondOperand;
        case '*':
            return firstOperand * secondOperand;
        case '/':
            return secondOperand !== 0 ? firstOperand / secondOperand : 0;
        default:
            return secondOperand;
    }
}

function calculate() {
    const inputValue = parseFloat(currentInput);

    if (previousInput !== null && operator) {
        const newValue = performCalculation(previousInput, inputValue, operator);
        currentInput = `${parseFloat(newValue.toFixed(7))}`;
        previousInput = null;
        operator = null;
        waitingForOperand = true;
        updateDisplay();
    }
}

function clearAll() {
    currentInput = '0';
    previousInput = null;
    operator = null;
    waitingForOperand = false;
    updateDisplay();
}

function clearEntry() {
    currentInput = '0';
    updateDisplay();
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Add visual feedback for key press
    let button = null;
    
    if (key >= '0' && key <= '9') {
        button = [...document.querySelectorAll('button')].find(btn => btn.textContent === key);
        inputNumber(key);
    } else if (key === '.') {
        button = [...document.querySelectorAll('button')].find(btn => btn.textContent === '.');
        inputDecimal();
    } else if (key === '+') {
        button = [...document.querySelectorAll('button')].find(btn => btn.textContent === '+');
        inputOperator('+');
    } else if (key === '-') {
        button = [...document.querySelectorAll('button')].find(btn => btn.textContent === '−');
        inputOperator('-');
    } else if (key === '*') {
        button = [...document.querySelectorAll('button')].find(btn => btn.textContent === '×');
        inputOperator('*');
    } else if (key === '/') {
        event.preventDefault(); // Prevent browser search
        button = [...document.querySelectorAll('button')].find(btn => btn.textContent === '÷');
        inputOperator('/');
    } else if (key === 'Enter' || key === '=') {
        button = [...document.querySelectorAll('button')].find(btn => btn.textContent === '=');
        calculate();
    } else if (key === 'Escape') {
        button = [...document.querySelectorAll('button')].find(btn => btn.textContent === 'C');
        clearAll();
    } else if (key === 'Backspace') {
        button = [...document.querySelectorAll('button')].find(btn => btn.textContent === 'CE');
        clearEntry();
    }
    
    // Add visual feedback
    if (button) {
        button.classList.add('button-pressed');
        setTimeout(() => {
            button.classList.remove('button-pressed');
        }, 100);
    }
});

// Initialize display
updateDisplay();