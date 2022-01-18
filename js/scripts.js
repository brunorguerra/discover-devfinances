const modal = {
  open() {
    // Abrir modal
    // Adiciona a class active-modal
    document.getElementById("modal-overlay").classList.add("active-modal");
  },
  close() {
    // Fechar Modal
    // Remove a class active modal
    document.getElementById("modal-overlay").classList.remove("active-modal");
    Form.clearFields();
  },
};
// seleciona o elemento para abrir/fechar o modal
document.querySelector(".button.new").addEventListener("click", () => {
  modal.open();
});
document
  .querySelector(".modal-form .input-group.actions .button.cancel")
  .addEventListener("click", () => {
    modal.close();
  });

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev-finances:transactions")) || [];
  },
  set(transaction) {
    localStorage.setItem(
      "dev-finances:transactions",
      JSON.stringify(transaction)
    );
  },
};

const balance = {
  all: Storage.get(),

  add(transaction) {
    balance.all.push(transaction);

    app.reload();
  },

  remove(index) {
    balance.all.splice(index, 1);

    app.reload();
  },

  incomes() {
    let income = 0;

    balance.all.forEach((transaction) => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      }
    });

    return income;
  },

  expenses() {
    let expense = 0;

    balance.all.forEach((transaction) => {
      if (transaction.amount < 0) {
        expense += transaction.amount;
      }
    });

    return expense;
  },

  total() {
    return balance.incomes() + balance.expenses();
  },
};

const utils = {
  formatAmount(value) {
    value = Number(value) * 100;

    return value;
  },

  formatDate(value) {
    const splittedDate = value.split("-");

    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },

  formatCurrent(value) {
    let signal = Number(value) < 0 ? "-" : "";

    value = String(value).replace(/\D/g, "");
    value = Number(value) / 100;

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return signal + value;
  },
};

const DOM = {
  TransactionsContainer: document.querySelector("#data-table tbody"),

  addTransaction(transaction, index) {
    let tr = document.createElement("tr");
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);

    DOM.TransactionsContainer.appendChild(tr);
  },

  innerHTMLTransaction(transaction, index) {
    let cssClass = transaction.amount > 0 ? "income" : "expense";
    let amount = utils.formatCurrent(transaction.amount);

    let html = `
        <td class="description">${transaction.description}</td>
        <td class="${cssClass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td><img onclick="balance.remove(${index})" src="/assets/minus.svg" alt="Remover Transação"></td>
        `;
    return html;
  },

  updateBalance() {
    document.getElementById("incomeDisplay").innerHTML = utils.formatCurrent(
      balance.incomes()
    );
    document.getElementById("expenseDisplay").innerHTML = utils.formatCurrent(
      balance.expenses()
    );
    document.getElementById("totalDisplay").innerHTML = utils.formatCurrent(
      balance.total()
    );
  },

  clearTransaction() {
    DOM.TransactionsContainer.innerHTML = "";
  },
};

const app = {
  init() {
    balance.all.forEach(DOM.addTransaction);
    DOM.updateBalance();
    Storage.set(balance.all);
  },
  reload() {
    DOM.clearTransaction();
    app.init();
  },
};

const Form = {
  description: document.querySelector("input#description"),
  amount: document.querySelector("input#amount"),
  date: document.querySelector("input#date"),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    };
  },

  validateFields() {
    let { description, amount, date } = Form.getValues();

    if (
      description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === ""
    ) {
      throw new Error("Preencha todos os campos");
    }
  },

  formatValues() {
    let { description, amount, date } = Form.getValues();

    amount = utils.formatAmount(amount);
    date = utils.formatDate(date);

    return {
      description,
      amount,
      date,
    };
  },

  clearFields() {
    document.getElementById("error").classList.remove("active-error");
    (Form.description.value = ""),
      (Form.amount.value = ""),
      (Form.date.value = "");
  },

  submit(event) {
    event.preventDefault();

    try {
      Form.validateFields();

      const transaction = Form.formatValues();

      balance.add(transaction);

      Form.clearFields();

      modal.close();
    } catch (error) {
      document.getElementById("error").classList.add("active-error");
    }
  },
};

app.init();
