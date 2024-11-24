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

  const surveyId = Date.now(); // Benzersiz ID

  // Survey URL oluşturuluyor
  // const surveyURL = `${req.protocol}://${req.get('host')}/respond/${surveyId}`;
  const surveyURL = `http://localhost:3000/respond/${surveyId}`;
  
  const completeSurvey = {
    ...newSurvey,
    id: surveyId,
    status, // Durum ekleniyor
    surveyURL // URL ekleniyor
  };

  console.log('Oluşturulan anket backend:', completeSurvey); // Backend tarafında da loglayalım

  surveys.push(completeSurvey);
  res.status(200).json(completeSurvey); // Başarı yanıtı dönülüyor
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

  // Güncellemek istediğimiz anketi bulalım
  const surveyIndex = surveys.findIndex(survey => survey.id === surveyId);

  if (surveyIndex === -1) {
    return res.status(404).send('Anket bulunamadı');
  }

  // Anketi güncelle
  surveys[surveyIndex] = {
    ...surveys[surveyIndex], // Önceki anket verilerini koruyalım
    ...updatedSurvey // Yeni verilerle güncelle
  };

  console.log('Güncellenen anket:', surveys[surveyIndex]);
  res.status(200).json(surveys[surveyIndex]); // Güncellenen anketi yanıt olarak gönder
});
console.log("Tüm kayıtlı yanıtlar:", surveyResponses);
