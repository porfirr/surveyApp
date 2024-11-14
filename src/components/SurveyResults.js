import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // URL parametresini almak için useParams ekliyoruz
import SurveyResultsChart from './SurveyResultsChart';

function SurveyResults() {
  const { id } = useParams(); // URL'deki anket ID'sini alıyoruz
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/respond/${id}`); // Güncel rotaya istek atıyoruz
        setResults(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Sonuçlar yüklenirken bir hata oluştu:', error);
      }
    };

    if (id) {
      fetchResults(); // Eğer ID varsa isteği yapıyoruz
    }
  }, [id]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (!results.length) {
    return <div>Bu ankete ait sonuç bulunamadı.</div>;
  }

  return (
    <div>
      <h2>Anket Sonuçları</h2>
      <ul>
        {results.map((result, index) => (
          <li key={index}>
            {result.responses.map((response, resIndex) => (
              <div key={resIndex}>
                <strong>{response.question}</strong>: {response.answer}
              </div>
            ))}
          </li>
        ))}
      </ul>

      {/* Grafik Bileşenini Gösteriyoruz */}
      <SurveyResultsChart results={results} />
    </div>
  );
}

export default SurveyResults;
