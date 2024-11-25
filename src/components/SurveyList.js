import React from "react";
import { useNavigate } from "react-router-dom";

function SurveyList({ surveys, handleEdit, deleteSurvey }) {
  const navigate = useNavigate(); // useNavigate burada tanımlanabilir

  return (
    <ul>
      {surveys.map((survey, index) => (
        <li key={index}>
          <strong>{survey.title}</strong>: {survey.description}
          <p>Başlangıç Tarihi: {survey.startDate}</p>
          <p>Bitiş Tarihi: {survey.endDate}</p>
          <p>Durum: {survey.status ? survey.status : "Durum bilgisi yok"}</p>
          <p>
            <a href={`/respond/${survey.id}`}>Yanıt Ver</a>
            <a
              href={`/results/${survey.id}`}
              target="_self"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <button>
                Sonuçları Görüntüle
              </button>
            </a>
          </p>
          <p>
            Paylaşım Linki:{" "}
            {survey.surveyURL ? (
              <a href={survey.surveyURL} target="_blank" rel="noopener noreferrer">
                {survey.surveyURL}
              </a>
            ) : (
              "Link oluşturulmadı"
            )}
          </p>
          <button onClick={() => handleEdit(survey)}>Düzenle</button>
          <button onClick={() => deleteSurvey(survey.id)}>Sil</button>
        </li>
      ))}
    </ul>
  );
}

export default SurveyList;
