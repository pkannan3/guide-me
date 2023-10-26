import React, { useEffect, useState } from "react";
import BudgetUpdate from "./BudgetUpdate";
import BudgetChart from "./BudgetChart";
import BudgetSummaryChart from "./BudgetSummaryChart";

function BudgetForm({ tripId }) {
  const [budget, setBudget] = useState([]);
  const [formData, setFormData] = useState({
    expense_name: "",
    cost: "",
    category: "",
    trip_id: tripId,
  });
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [budgetedAmount, setBudgetedAmount] = useState(0);
  const [spentAmount, setSpentAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudgetedAmount, setNewBudgetedAmount] = useState(budgetedAmount); // Initialize with the current budgetedAmount

  const fetchData = async () => {
    const url = `http://localhost:8000/trips/${tripId}/expense/`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      setBudget(data);

      // Calculate the total spent amount
      const totalSpent = data.reduce((acc, item) => acc + item.cost, 0);
      setSpentAmount(totalSpent);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tripId]);

  useEffect(() => {
    const remaining = budgetedAmount - spentAmount;
    setRemainingAmount(remaining);
  }, [budgetedAmount, spentAmount]);

  const handleEditBudget = () => {
    setIsEditingBudget(true);
  };

  const handleSaveBudget = async () => {
    const url = `http://localhost:8000/trips/${tripId}/update_budgeted_amount`;
    const fetchConfig = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ budgetedAmount: newBudgetedAmount }),
    };

    console.log(
      "Data being sent in PUT request:",
      JSON.stringify({ budgetedAmount: newBudgetedAmount })
    );

    const response = await fetch(url, fetchConfig);
    if (response.ok) {
      const updatedBudget = await response.json();

      setBudget((prevBudget) => {
        return prevBudget.map((budgetItem) =>
          budgetItem.trip_id === tripId ? updatedBudget : budgetItem
        );
      });

      setIsEditingBudget(false);
      setBudgetedAmount(newBudgetedAmount);
    } else {
      console.error("Error:", response.status);
    }
  };

  const handleSubmit = async () => {
    const url = `http://localhost:8000/trips/${tripId}/expense/create`;
    const fetchConfig = {
      method: "post",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, fetchConfig);

    if (response.ok) {
      setFormData({
        expense_name: "",
        cost: "",
        category: "",
      });
      fetchData();
    }
  };

  const handleFormChange = (e) => {
    const value = e.target.value;
    const inputName = e.target.name;

    setFormData({
      ...formData,
      [inputName]: value,
    });
  };

  return (
    <div className="row">
      <div className="offset-3 col-6">
        <div className="shadow p-4 mt-4">
          <BudgetSummaryChart spent={spentAmount} remaining={remainingAmount} />
          <div>
            {isEditingBudget ? (
              <div>
                <label htmlFor="budgetedAmount">Budget:</label>
                <input
                  type="number"
                  className="form-control"
                  id="budgetedAmount"
                  value={newBudgetedAmount}
                  onChange={(e) =>
                    setNewBudgetedAmount(parseFloat(e.target.value))
                  }
                />
                <button onClick={handleSaveBudget}>Save</button>
              </div>
            ) : (
              <div>
                <h3>
                  Budgeted Amount: ${budgetedAmount}
                  <button onClick={handleEditBudget}>Edit</button>
                </h3>
              </div>
            )}
          </div>
          <div>
            <h3>Total Spent: ${spentAmount}</h3>
          </div>
          <div>
            <h3>Remaining: ${remainingAmount}</h3>
          </div>

          <BudgetChart budget={budget} />

          <table className="table table-striped">
            <thead>
              <tr>
                <th>Expense</th>
                <th>Cost</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {budget?.map((singleBudget) => (
                <BudgetUpdate
                  key={singleBudget.expense_id}
                  budget={singleBudget}
                  budgets={{ budget, setBudget }}
                />
              ))}
            </tbody>
          </table>

          {!showExpenseForm && (
            <button
              className="btn btn-primary"
              onClick={() => setShowExpenseForm(true)}
            >
              Add Expense
            </button>
          )}

          {showExpenseForm && (
            <form id="createBudget">
              <div className="form-floating mb-3">
                <h1>Create an expense</h1>
                <input
                  value={formData.expense_name}
                  onChange={handleFormChange}
                  placeholder="Expense Name"
                  required
                  type="text"
                  id="expense_name"
                  name="expense_name"
                  className="form-control"
                />
                <label htmlFor="expense_name">Expense Name</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  value={formData.cost}
                  onChange={handleFormChange}
                  placeholder="Cost"
                  required
                  type="number"
                  id="cost"
                  name="cost"
                  className="form-control"
                />
                <label htmlFor="cost">Cost</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  value={formData.category}
                  onChange={handleFormChange}
                  placeholder="Category"
                  required
                  type="text"
                  id="category"
                  name="category"
                  className="form-control"
                />
                <label htmlFor="category">Category</label>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Add Expense
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default BudgetForm;
