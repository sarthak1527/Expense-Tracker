const API_URL = "http://127.0.0.1:8000";
const list = document.getElementById("list");

// GET — load expenses from the server and show them
async function loadExpenses() {
    const res = await fetch(`${API_URL}/expenses`);
    const expenses = await res.json();

    list.innerHTML = "";
    expenses.forEach((expense) => {
        const li = document.createElement("li");
        li.innerHTML = `${expense.name} - Rs. ${expense.amount}
            <button onclick="removeExpense(${expense.id})">Remove</button>`;
        list.appendChild(li);
    });
}

// POST — send a new expense to the server
async function addExpense() {
    const name = document.getElementById("name").value;
    const amount = document.getElementById("amount").value;

    await fetch(`${API_URL}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, amount: Number(amount) }),
    });

    loadExpenses(); // refresh the list on screen
}

// Assignment --> PUT — update an existing expense  
// async function updateExpense(id, name, amount) {
//     await fetch(`${API_URL}/expenses/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, amount: Number(amount) }),
//     });

//     loadExpenses();
// }

// DELETE — remove one expense from the server
async function removeExpense(id) {
    await fetch(`${API_URL}/expenses/${id}`, { method: "DELETE" });
    loadExpenses();
}

loadExpenses(); // show whatever's already on the server when the page opens