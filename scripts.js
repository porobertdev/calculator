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

    function clickHandler(event) {
        let value = event.target.textContent;
        let btnType = event.target.classList[1];
        console.log(value);

        if (operation.length == 0 || operators.includes(operation.at(-1)) || btnType == 'operator') {
            operation.push(value)
        } else if (btnType == 'num') {
            operation[operation.length - 1] += value;
        }

        if (operation.length == 4) {
             operation.splice(0, 3, operate(+operation[0], operation[1], +operation[2]));
        }

        console.log(operation);
    }
}

let operators = ['+', '-', 'x', '÷'];
let operation = [];
createClickEvents();