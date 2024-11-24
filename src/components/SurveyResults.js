import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import SurveyResultsChart from './SurveyResultsChart';

function SurveyResults() {
  const { id } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/respond/${id}`);
        console.log('Gelen sonuçlar:', response.data);

        // Gelen veriyi kontrol ediyoruz
        const processedResults = {
          ...response.data,
          responses: Array.isArray(response.data.responses) ? response.data.responses : [] // Diziye dönüştür
        };

        setResults(processedResults);
        setLoading(false);
      } catch (error) {
        console.error('Sonuçlar yüklenirken bir hata oluştu:', error);
        setLoading(false);
      }
    };

    if (id) {
      fetchResults();
    }
  }, [id]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (!results || results.responses.length === 0) {
    return <div>Bu ankete ait sonuç bulunamadı.</div>;
  }

  return (
    <div>
      <h2>Anket Sonuçları</h2>
      <table>
        <thead>
          <tr>
            <th>Soru</th>
            <th>Cevap</th>
          </tr>
        </thead>
        <tbody>
          {results.responses.map((response, index) => (
            <tr key={index}>
              <td>{response.question}</td>
              <td>{response.answer}</td>
            </tr>
          ))}
        </tbody>
      </table>
  
      {/* Grafik Bileşenini Gösteriyoruz */}
      <SurveyResultsChart results={results.responses} />
    </div>
  );
  
}

export default SurveyResults;
