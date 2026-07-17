from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Allow the browser to call this server from a different origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# Our "database" — just a list, kept in memory
class Expense(BaseModel):
    id: int = 0
    category: str
    amount: float
    description: str


expenses: List[Expense] = []
next_id = 1


@app.get("/expenses/{expense_id}")
def get_expense(expense_id: int):
    for e in expenses:
        if e.id == expense_id:
            return e
    return {"error": "not found"}


@app.get("/expenses")
def get_expenses():
    return expenses


@app.post("/expenses")
def add_expense(expense: Expense):
    global next_id
    expense.id = next_id
    next_id += 1
    expenses.append(expense)
    return expense


@app.put("/expenses/{expense_id}")
def update_expense(expense_id: int, updated_expense: Expense):
    for e in expenses:
        if e.id == expense_id:
            e.category = updated_expense.category
            e.amount = updated_expense.amount
            e.description = updated_expense.description
            return e
    return {"error": "not found"}


@app.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int):
    for e in expenses:
        if e.id == expense_id:
            expenses.remove(e)
            break
    return {"status": "deleted"}