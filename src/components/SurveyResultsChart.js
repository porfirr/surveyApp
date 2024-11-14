import React from 'react';
import { Bar } from 'react-chartjs-2';

function SurveyResultsChart({ results }) {
  const data = {
    labels: results.map((result) => result.responses.map((r) => r.question)), // Sorular
    datasets: [
      {
        label: 'Cevaplar',
        data: results.map((result) => result.responses.length), // Cevap sayısı
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={data} />;
}

export default SurveyResultsChart;
