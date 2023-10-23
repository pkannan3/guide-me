import React, { useState } from "react";

function BudgetUpdate(props) {
  const { budget } = props;
  const { setBudget } = props.budgets;
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    expense_name: "",
    cost: "",
    category: "",
  });

  const handleDelete = async (expense_id) => {
    try {
      await fetch(`http://localhost:8000/expense/${expense_id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
    window.location.reload();
  };

  const handleFormChange = (e) => {
    const value = e.target.value;
    const inputName = e.target.name;

    setFormData({
      ...formData,
      [inputName]: value,
    });
  };

  const handleUpdate = async (expense_id) => {
    const url = `http://localhost:8000/expense/${expense_id}`;
    const fetchConfig = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    };

    const response = await fetch(url, fetchConfig);

    if (response.ok) {
      const updatedExpense = await response.json();

      setBudget((prevBudget) => {
        const newBudget = [...prevBudget];
        const budgetIndex = prevBudget.findIndex(
          (budgetItem) => budgetItem.expense_id === expense_id
        );

        newBudget[budgetIndex] = updatedExpense;

        return newBudget;
      });

      setFormData({
        expense_name: "",
        cost: "",
        category: "",
      });
      setModalVisible(false);
    } else {
      console.error("Error:", response.status);
    }
  };

  return (
    <>
      <tr key={budget.expense_id}>
        <td>{budget.expense_name}</td>
        <td>{budget.cost}</td>
        <td>{budget.category}</td>
        <td>
          <button type="button" onClick={() => handleDelete(budget.expense_id)}>
            Delete
          </button>
        </td>
        <td>
          <button type="button" onClick={() => setModalVisible(true)}>
            Update
          </button>
          {modalVisible && (
            <div>
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
              <button
                type="button"
                onClick={() => handleUpdate(budget.expense_id)}
              >
                Update
              </button>
            </div>
          )}
        </td>
      </tr>
    </>
  );
}

export default BudgetUpdate;
