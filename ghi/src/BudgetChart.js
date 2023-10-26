import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function BudgetChart(props) {
  const { budget } = props;

  const initialColors = budget.reduce((acc, budgetItem) => {
    if (!acc[budgetItem.category]) {
      acc[
        budgetItem.category
      ] = `rgb(${randomNumber()}, ${randomNumber()}, ${randomNumber()})`;
    }
    return acc;
  }, {});

  const [colors, setColors] = useState(initialColors);

  function randomNumber() {
    return Math.round(Math.random() * 255);
  }

  const data = {
    labels: budget.reduce((acc, budgetItem) => {
      if (!acc.includes(budgetItem.category)) {
        acc.push(budgetItem.category);
      }
      return acc;
    }, []),
    datasets: [
      {
        label: "Expense Categories",
        data: Object.values(
          budget.reduce((acc, budgetItem) => {
            if (!acc[budgetItem.category]) {
              acc[budgetItem.category] = 0;
            }
            acc[budgetItem.category] += budgetItem.cost;
            return acc;
          }, {})
        ),
        backgroundColor: Object.values(colors),
      },
    ],
  };

  useEffect(() => {
    const newColors = budget.reduce((acc, budgetItem) => {
      if (!acc[budgetItem.category]) {
        acc[
          budgetItem.category
        ] = `rgb(${randomNumber()}, ${randomNumber()}, ${randomNumber()})`;
      }
      return acc;
    }, {});
    setColors(newColors);
  }, [budget]);

  return (
    <>
      <div style={{ width: "300px", height: "300px" }}>
        <Pie data={data} />
      </div>
    </>
  );
}

export default BudgetChart;
