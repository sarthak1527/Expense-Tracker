const form = document.querySelector('form');
const amount = document.querySelector("#Amount");
const category = document.querySelector("#category");
const description = document.querySelector("#description");
const tbody = document.querySelector("tbody");
const totalDisplay = document.querySelector("#total");

let total = 75; // matches the pre-existing Food row in the HTML
updateTotal();

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!amount.value || !description.value.trim()) {
    alert("Please fill in all fields");
    return;
  }

  const expenseAmount = parseFloat(amount.value);

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${category.value}</td>
    <td>${expenseAmount}</td>
    <td>${description.value}</td>
    <td><button class="delete-btn">Delete :)</button></td>
  `;
  row.dataset.amount = expenseAmount;

  tbody.appendChild(row);

  total += expenseAmount;
  updateTotal();

  form.reset();
});

tbody.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const row = e.target.closest("tr");
    const rowAmount = parseFloat(row.dataset.amount) || parseFloat(row.children[1].textContent) || 0;
    total -= rowAmount;
    row.remove();
    updateTotal();
  }
});

function updateTotal() {
  totalDisplay.textContent = `Total: $${total.toFixed(2)}`;
}