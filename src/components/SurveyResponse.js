import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function SurveyResponse() {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);

  // Anketi backend'den çekme
  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/respond/${id}`);
        setSurvey(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Anket yüklenirken bir hata oluştu:', error);
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [id]);

  // Yanıtların değiştirilmesini yönetme
  const handleResponseChange = (question, answer) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [question]: answer,
    }));
  };

  // Yanıtları gönderme
  const handleSubmit = async (event) => {
    event.preventDefault(); // Sayfa yenilemeyi engelle
    try {
      const responseArray = Object.keys(responses).map((question) => ({
        question,
        answer: responses[question],
      }));

      await axios.post(`http://localhost:5000/respond/${id}`, responseArray);
      alert('Yanıtlar başarıyla kaydedildi!');
      setResponses({}); // Yanıtları sıfırla
    } catch (error) {
      console.error('Yanıtlar kaydedilirken bir hata oluştu:', error);
      alert('Yanıtlar kaydedilemedi, lütfen tekrar deneyin.');
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (!survey) {
    return <div>Anket bulunamadı.</div>;
  }

  return (
    <div>
      <h2>{survey.title}</h2>
      <p>{survey.description}</p>
      <form onSubmit={handleSubmit}>
        {survey.questions.map((question, index) => (
          <div key={index}>
            <label>{question.text}</label>
            {question.type === 'multiple-choice' && (
              <div>
                {question.options.map((option, optIndex) => (
                  <div key={optIndex}>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      onChange={(e) => handleResponseChange(question.text, e.target.value)}
                    />
                    {option}
                  </div>
                ))}
              </div>
            )}
            {question.type === 'open-ended' && (
              <div>
                <input
                  type="text"
                  onChange={(e) => handleResponseChange(question.text, e.target.value)}
                />
              </div>
            )}
            {question.type === 'yes-no' && (
              <div>
                <input
                  type="radio"
                  name={`question-${index}`}
                  value="Evet"
                  onChange={(e) => handleResponseChange(question.text, e.target.value)}
                />
                Evet
                <input
                  type="radio"
                  name={`question-${index}`}
                  value="Hayır"
                  onChange={(e) => handleResponseChange(question.text, e.target.value)}
                />
                Hayır
              </div>
            )}
          </div>
        ))}
        <button type="submit">Yanıtları Gönder</button>
      </form>
    </div>
  );
}

export default SurveyResponse;
