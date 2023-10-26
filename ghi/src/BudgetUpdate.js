import React, { useState } from "react";

function BudgetUpdate(props) {
  const { budget } = props;
  const { setBudget } = props.budgets;
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    expense_name: budget.expense_name,
    cost: budget.cost,
    category: budget.category,
  });
  const [editMode, setEditMode] = useState(false);

  const handleDelete = async (expense_id) => {
    try {
      await fetch(`http://localhost:8000/expense/${expense_id}`, {
        method: "DELETE",
      });
      window.location.reload();
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async (expense_id) => {
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
        return prevBudget.map((budgetItem) =>
          budgetItem.expense_id === expense_id ? updatedExpense : budgetItem
        );
      });

      setEditMode(false);
      setModalVisible(false);
    } else {
      console.error("Error:", response.status);
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
    <>
      <tr key={budget.expense_id}>
        <td>
          {editMode ? (
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
          ) : (
            budget.expense_name
          )}
        </td>
        <td>
          {editMode ? (
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
          ) : (
            budget.cost
          )}
        </td>
        <td>
          {editMode ? (
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
          ) : (
            budget.category
          )}
        </td>
        <td>
          {editMode ? (
            <button type="button" onClick={() => handleSave(budget.expense_id)}>
              Save
            </button>
          ) : (
            <button type="button" onClick={handleEdit}>
              Edit
            </button>
          )}
          <button type="button" onClick={() => handleDelete(budget.expense_id)}>
            Delete
          </button>
        </td>
      </tr>
    </>
  );
}

export default BudgetUpdate;
