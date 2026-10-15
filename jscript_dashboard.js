const username = localStorage.getItem("username");

if (!username) {
    window.location.href = "login.html";
} else {
    document.getElementById("welcomeText").textContent =
        "Welcome, " + username + "!";
}

const name = localStorage.getItem("name");

if (name) {
    document.getElementById("welcomeText").innerText = "Welcome, " + name;
}

const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const type = document.getElementById('type');
const filterSelect = document.getElementById('filterCategory');


const dummyTransactions = [
    { id: 1, text: 'Salary', amount: 0, type: 'income', category: 'Salary' },
    { id: 2, text: 'Lunch', amount: 0, type: 'expense', category: 'Food' },
    { id: 3, text: 'Rent', amount: 0, type: 'expense', category: 'Bills' },
];

let transactions = dummyTransactions;


let myChart = null;




function addTransaction(e) {
    e.preventDefault();

    
    const textValue = text.value;
    const amountValue = parseFloat(amount.value);
    const categoryValue = category.value;
    const typeValue = type.value;

    
    if (textValue.trim() === '' || isNaN(amountValue)) {
        alert('Please add a text and amount');
        return;
    }

    
    let finalAmount = amountValue;
    if (typeValue === 'expense') {
        finalAmount = -Math.abs(amountValue);
    } else {
        finalAmount = Math.abs(amountValue); 
    }

    
    const transaction = {
        id: generateID(),
        text: textValue,
        amount: finalAmount,
        category: categoryValue,
        type: typeValue
    };

    
    transactions.push(transaction);

    
    addTransactionDOM(transaction);
    updateValues();
    updateChart();

    
    text.value = '';
    amount.value = '';
}


function generateID() {
    return Math.floor(Math.random() * 100000000);
}


function addTransactionDOM(transaction, filter = 'all') {
    
    if (filter !== 'all' && transaction.category !== filter) {
        return; 
    }

    
    const sign = transaction.amount < 0 ? '-' : '+';

    const item = document.createElement('li');

    
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        ${transaction.text} 
        <span class="small-text">(${transaction.category})</span> 
        <span>${sign}₱${Math.abs(transaction.amount)}</span>
    `;

    list.appendChild(item);
}


function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
        -1
    ).toFixed(2);

    balance.innerText = `₱ ${total}`;
    money_plus.innerText = `+₱ ${income}`;
    money_minus.innerText = `-₱ ${expense}`;
}


function filterTransactions() {
    const filterValue = filterSelect.value;
    
    
    list.innerHTML = '';
    
    
    transactions.forEach(transaction => {
        addTransactionDOM(transaction, filterValue);
    });
}


function initChart() {
    const ctx = document.getElementById('financeChart').getContext('2d');
    
    myChart = new Chart(ctx, {
        type: 'doughnut', 
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                data: [0, 0], 
                backgroundColor: ['#00b894', '#d63031'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#e0e0e0' }
                }
            }
        }
    });
}


function updateChart() {
    
    const amounts = transactions.map(transaction => transaction.amount);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0);
    const expense = amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1;

    
    myChart.data.datasets[0].data = [income, expense];
    myChart.update();
}


form.addEventListener('submit', addTransaction);


function init() {
    list.innerHTML = '';
    transactions.forEach(transaction => addTransactionDOM(transaction));
    updateValues();
    initChart();
}


init();