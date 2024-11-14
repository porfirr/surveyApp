import React from "react";
import { useParams } from "react-router-dom";

function SurveyDetail({ surveys }) {
  const { id } = useParams(); // URL'deki ID'yi alıyoruz
  const survey = surveys.find((s) => s.id === parseInt(id));

  // Konsola log ekleyelim
  console.log("Survey ID from URL:", id);
  console.log("Available Surveys:", surveys);
 

  if (!survey) {
    return <h2>Anket Bulunamadı</h2>;
  }
  
  return (
    <div>
      <h2>{survey.title}</h2>
      <p>{survey.description}</p>
      <p>Başlangıç Tarihi: {survey.startDate}</p>
      <p>Bitiş Tarihi: {survey.endDate}</p>
      <p>Durum: {survey.status}</p>
      <h3>Sorular:</h3>
      <ul>
        {survey.questions.length > 0 ? (
          survey.questions.map((question, index) => (
            <li key={index}>
              {question.text} - {question.type === 'multiple-choice' ? 'Çoktan Seçmeli' : question.type === 'open-ended' ? 'Açık Uçlu' : 'Evet/Hayır'}
              {question.type === 'multiple-choice' && (
                <ul>
                  {question.options.map((option, optIndex) => (
                    <li key={optIndex}>{option}</li>
                  ))}
                </ul>
              )}
            </li>
          ))
        ) : (
          <p>Soru eklenmemiş.</p>
        )}
      </ul>
    </div>
  );
}

export default SurveyDetail;
