import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SurveyForm from './components/SurveyForm';
import SurveyDetail from "./components/SurveyDetail";
import SurveyResponse from './components/SurveyResponse';
import SurveyResults from './components/SurveyResults';
import SurveyList from './components/SurveyList';
import axios from 'axios';
import './styles.css';

function App() {
  const [surveys, setSurveys] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [questions, setQuestions] = useState([]);
  const [editingSurvey, setEditingSurvey] = useState(null);

  // Backend'den anketleri çekmek için useEffect kullanıyoruz
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get('http://localhost:5000/surveys');
        console.log('Backend’den gelen anketler:', response.data); // Yanıtı kontrol edelim
        setSurveys(response.data);
        console.log('Anketler başarıyla yüklendi:', response.data);
      } catch (error) {
        console.error('Anketler yüklenirken bir hata oluştu:', error);
      }
    };

    fetchSurveys();
  }, []);

  const addSurvey = async (title, description, questions, startDate, endDate) => {
    const newSurvey = {
      title,
      description,
      questions,
      startDate,
      endDate
    };
  
    try {
      const response = await axios.post('http://localhost:5000/surveys', newSurvey);
      const savedSurvey = response.data;
  
      // Gelen anketin surveyURL'sinin oluşturulup oluşturulmadığını kontrol et
      if (!savedSurvey.surveyURL) {
        console.error('Anket URL\'si oluşturulmadı:', savedSurvey);
      } else {
        console.log('Anket başarıyla kaydedildi:', savedSurvey);
      }
  
      // Yeni anketi state'e ekle
      setSurveys([...surveys, savedSurvey]);
    } catch (error) {
      console.error('Anket kaydedilemedi:', error);
    }
  };
  
  
  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url)
      .then(() => alert("Link panoya kopyalandı!"))
      .catch((err) => console.error("Link kopyalanamadı", err));
  };

  // Anketi backend'den silmek için deleteSurvey fonksiyonunu güncelledik
  const deleteSurvey = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/surveys/${id}`);
      setSurveys(surveys.filter(survey => survey.id !== id));
      console.log('Anket başarıyla silindi.');
    } catch (error) {
      console.error('Anket silinirken bir hata oluştu:', error);
    }
  };

  const updateSurvey = async (updatedSurvey) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/surveys/${updatedSurvey.id}`,
        updatedSurvey
      );
      const updatedSurveyData = response.data;
  
      // Surveys dizisini güncelleyin
      const updatedSurveys = surveys.map((survey) =>
        survey.id === updatedSurveyData.id ? updatedSurveyData : survey
      );
  
      setSurveys(updatedSurveys); // SurveyList'in güncellenmesi için
      console.log("Anket başarıyla güncellendi:", updatedSurveyData);
    } catch (error) {
      console.error("Anket güncellenemedi:", error);
    }
  };
  
  const handleEdit = (survey) => {
    setTitle(survey.title);
    setDescription(survey.description);
    setStartDate(survey.startDate);
    setEndDate(survey.endDate);
    setQuestions(survey.questions);
    setEditingSurvey(survey);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1>Anket Uygulaması</h1>
              <p>Yeni bir anket oluşturmak için formu doldurun.</p>
  
              {/* Anket oluşturma formu */}
              <SurveyForm
                addSurvey={addSurvey}
                title={title}
                description={description}
                startDate={startDate}
                endDate={endDate}
                questions={questions}
                setTitle={setTitle}
                setDescription={setDescription}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                setQuestions={setQuestions}
                updateSurvey={updateSurvey}
                editingSurvey={editingSurvey}
                setEditingSurvey={setEditingSurvey}
              />
  
              {/* Anket listesi */}
              <SurveyList
                surveys={surveys}
                handleEdit={handleEdit}
                deleteSurvey={deleteSurvey}
                handleCopyLink={handleCopyLink}
              />
            </div>
          }
        />
        <Route
          path="/survey/:id"
          element={<SurveyDetail surveys={surveys} />}
        />
        <Route path="/respond/:id" element={<SurveyResponse surveys={surveys} />} />
        <Route path="/results/:id" element={<SurveyResults />} />
      </Routes>
    </Router>
  );  
}

export default App;
