const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test API
app.get('/', (req, res) => {
  res.send('Backend çalışıyor!');
});

// Anketler için basit bir API (şimdilik verileri memory'de tutalım)
let surveys = [];
let surveyResponses = [];

app.get('/surveys', (req, res) => {
  res.json(surveys);
});

app.get('/respond/:id', (req, res) => {
  const surveyId = parseInt(req.params.id);

  // Anketi bul
  const survey = surveys.find(s => s.id === surveyId);
  if (!survey) {
    return res.status(404).send('Anket bulunamadı');
  }

  // SurveyResponses dizisinde ilgili yanıtları bul
  const responses = surveyResponses
    .filter(response => response.surveyId === surveyId)
    .flatMap(r => r.responses); // Gelen yanıtları birleştir

  // Tam anketi yanıtlarla birlikte döndür
  const completeSurvey = {
    ...survey,
    responses // Yanıtlar artık düz bir dizi
  };

  console.log("Tam anket ve yanıtlar:", completeSurvey);
  res.status(200).json(completeSurvey);
});

app.get('/results/:id', (req, res) => {
  const surveyId = parseInt(req.params.id);
  const surveyResult = surveyResponses.filter(response => response.surveyId === surveyId);

  if (!surveyResult.length) {
    return res.status(404).send('Anket sonucu bulunamadı');
  }

  res.status(200).json(surveyResult);
});

app.post('/surveys', (req, res) => {
  const newSurvey = req.body;

  const today = new Date().toISOString().split("T")[0];
  let status = "Taslak";

  if (today >= newSurvey.startDate && today <= newSurvey.endDate) {
    status = "Yayında";
  } else if (today > newSurvey.endDate) {
    status = "Sona Ermiş";
  }

  // Sorulara benzersiz ID ekleyelim
  const updatedQuestions = newSurvey.questions.map(question => ({
    ...question,
    id: Date.now() + Math.random(), // Benzersiz ID
  }));

  const surveyId = Date.now();
  const surveyURL = `http://localhost:3000/respond/${surveyId}`;

  const completeSurvey = {
    ...newSurvey,
    id: surveyId,
    questions: updatedQuestions,
    status,
    surveyURL,
    responses: [],
  };

  surveys.push(completeSurvey);
  res.status(200).json(completeSurvey);
});

app.post('/respond/:id', (req, res) => {
  const surveyId = parseInt(req.params.id);
  const survey = surveys.find(s => s.id === surveyId);

  if (!survey) {
    return res.status(404).send('Anket bulunamadı');
  }

  // Gelen yanıtları al ve bir dizi olarak işle
  const responses = Array.isArray(req.body) ? req.body : req.body.responses || [];

  // Gelen yanıtları surveyResponses dizisine ekleyelim
  surveyResponses.push({ surveyId, responses });
  console.log("Kaydedilen yanıtlar:", surveyResponses);
  res.status(200).send('Yanıtlar başarıyla kaydedildi');
});



app.delete('/surveys/:id', (req, res) => {
  const surveyId = parseInt(req.params.id);
  surveys = surveys.filter(survey => survey.id !== surveyId);
  res.json({ message: 'Anket silindi' });
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.put('/surveys/:id', (req, res) => {
  const surveyId = parseInt(req.params.id);
  const updatedSurvey = req.body;

  const surveyIndex = surveys.findIndex(survey => survey.id === surveyId);

  if (surveyIndex === -1) {
    return res.status(404).send('Anket bulunamadı');
  }

  // Durum hesaplaması
  const today = new Date().toISOString().split('T')[0];
  let status = 'Taslak';
  if (today >= updatedSurvey.startDate && today <= updatedSurvey.endDate) {
    status = 'Yayında';
  } else if (today > updatedSurvey.endDate) {
    status = 'Sona Ermiş';
  }

  const oldQuestions = surveys[surveyIndex].questions;
  const newQuestions = updatedSurvey.questions;

  // Anketi güncelle
  surveys[surveyIndex] = {
    ...surveys[surveyIndex],
    ...updatedSurvey,
    status, // Durumu ekliyoruz
  };

  // Soru eşleştirme
  const questionMap = oldQuestions.reduce((map, oldQuestion) => {
    const updatedQuestion = newQuestions.find(q => q.id === oldQuestion.id);
    if (updatedQuestion) {
      map[oldQuestion.text] = updatedQuestion.text; // Eski metni yeni metinle eşleştiriyoruz
    }
    return map;
  }, {});

  // Yanıtları güncelle
  surveyResponses = surveyResponses.map(response => {
    if (response.surveyId === surveyId) {
      return {
        ...response,
        responses: response.responses.map(answer => ({
          ...answer,
          question: questionMap[answer.question] || answer.question,
        })),
      };
    }
    return response;
  });

  console.log('Güncellenen anket:', surveys[surveyIndex]);
  console.log('Güncellenen tüm yanıtlar:', surveyResponses);
  res.status(200).json(surveys[surveyIndex]);
});
