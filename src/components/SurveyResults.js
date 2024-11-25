import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import SurveyResultsChart from './SurveyResultsChart';

function SurveyResults() {
  const { id } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  const groupAnswers = (answers) => {
    const grouped = {};
    answers.forEach((answer) => {
      grouped[answer] = (grouped[answer] || 0) + 1;
    });
    return grouped;
  };

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/respond/${id}`);
        console.log('Gelen sonuçlar:', response.data);
  
        // Gelen veriyi işliyoruz
        const processedResults = {
          ...response.data,
          responses: Array.isArray(response.data.responses) ? response.data.responses : []
        };
  
        console.log('İşlenen sonuçlar:', processedResults); // İşlenen veriyi loglayın
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

      {Object.entries(
        results.responses.reduce((acc, response) => {
          if (!acc[response.question]) {
            acc[response.question] = [];
          }
          acc[response.question].push(response.answer);
          return acc;
        }, {})
      ).map(([question, answers]) => {
        const groupedAnswers = groupAnswers(answers);
        const labels = Object.keys(groupedAnswers);
        const counts = Object.values(groupedAnswers);

        const questionType = results.questions.find((q) => q.text === question)?.type;

        return (
          <div key={question} className="question-card">
            <h3>{question}</h3>
            <ul>
              {labels.map((label, idx) => (
                <li key={idx}>
                  {label} - {counts[idx]} kez
                </li>
              ))}
            </ul>
            <SurveyResultsChart type={questionType} labels={labels} data={counts} />
          </div>
        );
      })}
    </div>
  );
}

export default SurveyResults;
