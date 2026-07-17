const API_URL = "http://127.0.0.1:8000";

const form = document.getElementById("expenseForm");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const descriptionInput = document.getElementById("description");

const expenseList = document.getElementById("expenseList");
const total = document.getElementById("total");

// Stores the id of the expense currently being edited
let editId = null;

// Load all expenses when the page opens
loadExpenses();


// =======================
// GET ALL EXPENSES
// =======================
async function loadExpenses() {
    const response = await fetch(`${API_URL}/expenses`);
    const expenses = await response.json();

    expenseList.innerHTML = "";
    let totalExpense = 0;

    expenses.forEach(expense => {
        totalExpense += expense.amount;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${expense.category}</td>
            <td>Rs. ${expense.amount}</td>
            <td>${expense.description}</td>
            <td>
                <button class="edit-btn" onclick="editExpense(${expense.id})">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="delete-btn" onclick="deleteExpense(${expense.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        expenseList.appendChild(row);
    });

    total.innerHTML = `Total : Rs. ${totalExpense}`;
}


// =======================
// ADD OR UPDATE EXPENSE
// =======================
form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const expense = {
        category: categoryInput.value,
        amount: Number(amountInput.value),
        description: descriptionInput.value
    };

    // If editId is null, add a new expense
    if (editId === null) {
        await fetch(`${API_URL}/expenses`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(expense)
        });
    }
    // Otherwise update the existing expense
    else {
        await fetch(`${API_URL}/expenses/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(expense)
        });

        editId = null;
        form.querySelector("button").innerText = "Add Expense";
    }

    form.reset();
    loadExpenses();
});


// =======================
// DELETE EXPENSE
// =======================
async function deleteExpense(id) {
    const confirmDelete = confirm("Delete this expense?");
    if (!confirmDelete) return;

    await fetch(`${API_URL}/expenses/${id}`, {
        method: "DELETE"
    });

    loadExpenses();
}


// =======================
// EDIT EXPENSE
// =======================
async function editExpense(id) {
    const response = await fetch(`${API_URL}/expenses/${id}`);
    const expense = await response.json();

    categoryInput.value = expense.category;
    amountInput.value = expense.amount;
    descriptionInput.value = expense.description;

    editId = expense.id;
    form.querySelector("button").innerText = "Update Expense";
}