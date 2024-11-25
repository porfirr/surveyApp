import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

// Chart.js bileşenlerini kaydediyoruz
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function SurveyResultsChart({ type, labels, data }) {
  // Renkler dizisi
  const colors = [
    'rgba(255, 99, 132, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 159, 64, 0.6)',
  ];

  const borderColors = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
  ];

  if (type === 'yes-no') {
    // Evet/Hayır için Pie Chart
    return (
      <Pie
        data={{
          labels,
          datasets: [
            {
              data,
              backgroundColor: colors,
              borderColor: borderColors,
              borderWidth: 1,
            },
          ],
        }}
        options={{
          plugins: {
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  const total = tooltipItem.dataset.data.reduce((acc, val) => acc + val, 0);
                  const value = tooltipItem.raw;
                  const percentage = ((value / total) * 100).toFixed(2);
                  return `${tooltipItem.label}: ${value} (${percentage}%)`;
                },
              },
            },
          },
        }}
      />
    );
  }

  // Çoktan Seçmeli ve Açık Uçlu Sorular için Bar Chart
  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: 'Cevaplanma Sayısı',
            data,
            backgroundColor: colors.slice(0, labels.length), // Her veri noktasına farklı bir renk
            borderColor: borderColors.slice(0, labels.length),
            borderWidth: 1,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Cevaplar', // X ekseni açıklaması
            },
          },
          y: {
            title: {
              display: true,
              text: 'Cevaplanma Sayısı', // Y ekseni açıklaması
            },
            ticks: {
              stepSize: 1,
              callback: (value) => (Number.isInteger(value) ? value : null),
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                const total = tooltipItem.dataset.data.reduce((acc, val) => acc + val, 0);
                const value = tooltipItem.raw;
                const percentage = ((value / total) * 100).toFixed(2);
                return `${tooltipItem.label}: ${value} (${percentage}%)`;
              },
            },
          },
          legend: {
            display: false, // Cevap Sayısı başlığını gizler
          },
        },
      }}
    />
  );
}

export default SurveyResultsChart;
