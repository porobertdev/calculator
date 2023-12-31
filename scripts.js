function add(a, b) {
    return a + b;
}

function substract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function createClickEvents() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach( btn => btn.addEventListener('click', clickHandler));
    const body = document.querySelector('body');
    body.addEventListener('keydown', clickHandler);

    function clickHandler(event) {
        let value;
        let btnType;
        let deleteCount;

        if (event.type == 'click') {
            value = event.target.textContent;
            btnType = event.target.classList[1];
        } else {
            // it's KB that was pressed
            value = event.key;

            // don't do anything if the key pressed isn't supported
            if (!validKeys.concat(operators).includes(value)) {
                return;
            }
            
            // convert PC's keys to the corresponding HTML textContent.
            switch (true) {
                case (value == '*'):
                    value = 'x';
                    break;
                case (value == '/'):
                    value = '÷';
                    break;
                case (value == 'Enter'):
                    value = '=';
                    break;
                case (value == 'c'):
                    value = 'C';
            }

            btnType = (operators.includes(value)) ? 'operator' : 'num';
        }

        if (value == 'C') {
            operation = [];
            display('clear');
            return;
        } else if (value == 'Backspace') {
            if (operation.at(-1).length > 1) {
                // it's a number with digits
                operation[operation.length - 1] = operation[operation.length - 1].slice(0, -1);
            } else {
                // it's an operator
                operation.pop();
            }
            display('operation');
            return;
        }
        
        /*
            if user tries to add an operator on first index, or
            tries to add an operator twice in row, or
            tries to add equal before having 3 valid operands
        */
        if (btnType == 'operator') {
            if (operation.length == 0 || operators.includes(operation.at(-1)) ||
                operation.length < 3 && value == '=') {
                return;
            }
        }

        // Workaround: don't allow two dots in one number
        if (value == '.') {
            if (operation.at(-1).split('').filter( item => item == '.').length == 1) {
                return;
            }
        }

        /*
            we need to push the number or operator to the array only
            if it's the first index, or the previous index is an operator.
            Otherwise, that means the user wants to add more digits to the
            number, so just append them to the last index.
        */
        if (operation.length == 0 || operators.includes(operation.at(-1)) || btnType == 'operator') {
            operation.push(value)
        } else if (btnType == 'num') {
            operation[operation.length - 1] += value;
        }

        /*
            if array has 3 valid operands, we need to calculate
            the current operation when adding one more operator.
        */
        if (operation.length == 4) {
            deleteCount = (operation.at(-1) == '=') ? 4 : 3;
            operation.splice(0, deleteCount, operate(+operation[0], operation[1], +operation[2]));
            }
        

        display('operation');
    }
}

function operate(a, operator, b) {
    switch (true) {
        case (operator == '+'):
            result = add(a, b);
            break;
        case (operator == '-'):
            result = substract(a, b);
            break;
        case (operator == 'x'):
            result = multiply(a, b);
            break;
        case (operator == '÷'):
            result = divide(a, b);
    }
    
    // Thanks @StackOverflow: https://stackoverflow.com/a/11832950/21600888
    result = Math.round(result * 100) / 100;

    display('result');
    return result;
}

function display(type) {
    switch (true) {
        case (type == 'operation'):
            displayOperation.textContent = operation.slice(0, 3).join('');
            break;
        case (type == 'result'):
            displayResult.textContent = result;
            break;
        case (type == 'clear'):
            displayOperation.textContent = '';
            displayResult.textContent = '';
    }
}

const validKeys = ['0','1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '*', '/', 'Enter', 'c', 'Backspace'];
const operators = ['+', '-', 'x', '÷', '='];
let operation = [];

const displayOperation = document.querySelector('.operation');
const displayResult = document.querySelector('.result');
createClickEvents();