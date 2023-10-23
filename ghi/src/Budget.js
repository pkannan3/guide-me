import React, { useEffect, useState } from "react";
import BudgetUpdate from "./BudgetUpdate";
import BudgetChart from "./BudgetChart";

function BudgetForm() {
  const [budget, setBudget] = useState([]);
  const [formData, setFormData] = useState({
    expense_name: "",
    cost: "",
    category: "",
  });

  const fetchData = async () => {
    const url = `http://localhost:8000/expense`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      setBudget(data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    const url = `http://localhost:8000/expense/create`;
    const fetchConfig = {
      method: "post",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    };

    console.log(formData);

    const response = await fetch(url, fetchConfig);

    if (response.ok) {
      setFormData({
        expense_name: "",
        cost: "",
        category: "",
      });
      window.location.reload();
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
          <BudgetChart budget={budget} />
          <h1>Create a expense</h1>
          <form id="createBudget">
            <div className="form-floating mb-3">
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
                type="decimal"
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
                placeholder="category"
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
              onClick={() => handleSubmit()}
            >
              List your expenses
            </button>

            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Expense</th>
                  <th>Cost</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {budget?.map((singleBudget) => {
                  return (
                    <BudgetUpdate
                      key={singleBudget.expense_id}
                      budget={singleBudget}
                      budgets={{ budget, setBudget }}
                    />
                  );
                })}
              </tbody>
            </table>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BudgetForm;
