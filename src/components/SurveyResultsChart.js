import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '../styles.css';

// Chart.js bileşenlerini kaydediyoruz
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SurveyResultsChart({ results }) {
  // Cevapları gruplayarak her cevabın kaç kez seçildiğini sayıyoruz
  const answerCounts = results.reduce((acc, response) => {
    acc[response.answer] = (acc[response.answer] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(answerCounts), // Cevapları grafik etiketleri olarak kullanıyoruz
    datasets: [
      {
        label: 'Cevap Sayısı',
        data: Object.values(answerCounts),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Yükseklik ve genişliği daha iyi kontrol etmek için
    plugins: {
      legend: {
        display: false, // Grafiğin üstündeki açıklamayı kaldırır (ör. "Cevap Sayısı")
      },
      title: {
        display: false, // "Anket Sonuçları" başlığını kaldırır
      },
    },
    scales: {
      x: {
        title: {
          display: false, // X ekseninde herhangi bir başlık istemiyorsanız
        },
      },
      y: {
        ticks: {
          stepSize: 1, // Yalnızca tam sayıları göstermek için
          callback: function (value) {
            if (Number.isInteger(value)) return value; // Sadece tam sayıları göster
            return null;
          },
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <Bar data={data} options={options} />
    </div>
  );  
}

export default SurveyResultsChart;
