const modal = {
    open() {
        // Abrir modal
        // Adiciona a class active-modal
        document
            .getElementById('modal-overlay')
            .classList.add('active-modal')
    },
    close() {
        // Fechar Modal
        // Remove a class active modal
        document
            .getElementById('modal-overlay')
            .classList.remove('active-modal')
    }
};
// seleciona o elemento para abrir/fechar o modal
document.querySelector('.button.new')
    .addEventListener('click', () => {
    modal.open()
});
document.querySelector('.modal-form .input-group.actions .button.cancel')
    .addEventListener('click', () => {
    modal.close()
});



const transactions = [
    {
        id: 1,
        description: 'Luz',
        amount: -40000,
        date: '03/10/2021'
    },
    {
        id: 1,
        description: 'Salario',
        amount: 400000,
        date: '03/10/2021'
    }
];

const balance = {
    incomes() {
        let income = 0;
        
        transactions.forEach((transaction) => {
            if(transaction.amount > 0) {
                income += transaction.amount;
            }
        })

        return income;
    },

    expenses() {
        let expense = 0;
        
        transactions.forEach((transaction) => {
            if(transaction.amount < 0) {
                expense += transaction.amount;
            }
        })

        return expense;
    },

    total() {
        return balance.incomes() + balance.expenses()
    },
};

const utils = {
    formatCurrent(value) {
        let signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        })

        return signal + value
    }
}

const DOM = {
    TransactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        let tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)

        DOM.TransactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction) {
        let cssClass = transaction.amount > 0 ? "income" : "expense"
        let amount = utils.formatCurrent(transaction.amount)

        let html = `
        <td class="description">${transaction.description}</td>
        <td class="${cssClass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td><img src="/assets/minus.svg" alt="Remover Transação"></td>
        `
        return html;
    },

    updateBalance() {
        document.getElementById('incomeDisplay').innerHTML = utils.formatCurrent(balance.incomes())
        document.getElementById('expenseDisplay').innerHTML = utils.formatCurrent(balance.expenses())
        document.getElementById('totalDisplay').innerHTML = utils.formatCurrent(balance.total())

    }
};

transactions.forEach((transaction) => {
    DOM.addTransaction(transaction)
})
DOM.updateBalance()