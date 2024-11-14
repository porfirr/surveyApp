import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SurveyResponse = ({ surveys }) => {
  const { id } = useParams(); // URL'deki anket ID'sini al
  const survey = surveys.find(s => s.id === parseInt(id)); // İlgili anketi bul
  
  const [answers, setAnswers] = useState({}); // Kullanıcının yanıtları

  if (!survey) {
    return <p>Anket bulunamadı.</p>;
  }

  // Kullanıcının soruları yanıtlamasını sağlayan fonksiyon
  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  // Yanıt gönderme işlemi
  const handleSubmit = async (surveyId, responses) => {
    try {
      const response = await axios.post(`http://localhost:5000/responses/${surveyId}`, responses);
      console.log('Yanıtlar başarıyla kaydedildi');
    } catch (error) {
      console.error('Yanıtlar kaydedilemedi:', error);
    }
  };

  return (
    <div>
      <h2>{survey.title}</h2>
      <p>{survey.description}</p>
      <form onSubmit={handleSubmit}>
        {survey.questions.map((question, index) => (
          <div key={index}>
            <p>{question.text}</p>
            {question.type === 'multiple-choice' ? (
              question.options.map((option, optIndex) => (
                <label key={optIndex}>
                  <input 
                    type="radio" 
                    name={`question-${index}`} 
                    value={option} 
                    onChange={() => handleAnswerChange(index, option)} 
                    required
                  />
                  {option}
                </label>
              ))
            ) : question.type === 'open-ended' ? (
              <textarea 
                onChange={(e) => handleAnswerChange(index, e.target.value)} 
                required
              />
            ) : (
              <div>
                <label>
                  <input 
                    type="radio" 
                    name={`question-${index}`} 
                    value="yes" 
                    onChange={() => handleAnswerChange(index, 'yes')} 
                    required
                  /> Evet
                </label>
                <label>
                  <input 
                    type="radio" 
                    name={`question-${index}`} 
                    value="no" 
                    onChange={() => handleAnswerChange(index, 'no')} 
                    required
                  /> Hayır
                </label>
              </div>
            )}
          </div>
        ))}
        <button type="submit">Yanıtları Gönder</button>
      </form>
    </div>
  );
};

export default SurveyResponse;
