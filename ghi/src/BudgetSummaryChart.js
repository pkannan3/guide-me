import React from "react";
import { Pie } from "react-chartjs-2";

function BudgetSummaryChart({ spent, remaining }) {
  // Conditionally set the remaining value to zero if it's negative
  const remainingValue = remaining < 0 ? 0 : remaining;

  const data = {
    labels: ["Spent", "Remaining"],
    datasets: [
      {
        data: [spent, remainingValue], // Use the modified remainingValue
        backgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "right",
      },
    },
  };

  return (
    <div style={{ width: "300px", height: "300px" }}>
      <Pie data={data} options={options} />
    </div>
  );
}

export default BudgetSummaryChart;
