import React, { useState, useEffect } from 'react';

function SurveyForm({ 
  addSurvey,
  updateSurvey,          // Yeni prop: anketi güncelleme fonksiyonu
  editingSurvey,         // Yeni prop: düzenlenen anket
  setEditingSurvey       // Yeni prop: düzenleme modunu kapatma fonksiyonu
}) {
  const [title, setTitle] = useState(editingSurvey ? editingSurvey.title : '');  // Eğer düzenleniyorsa mevcut anket bilgilerini getiriyoruz
  const [description, setDescription] = useState(editingSurvey ? editingSurvey.description : '');
  const [startDate, setStartDate] = useState(editingSurvey ? editingSurvey.startDate : '');
  const [endDate, setEndDate] = useState(editingSurvey ? editingSurvey.endDate : '');
  const [questions, setQuestions] = useState(editingSurvey ? editingSurvey.questions : []);

  // Yeni bir soru ekleme fonksiyonu
  const addQuestion = () => {
    setQuestions([...questions, { text: '', type: 'multiple-choice', options: [''] }]);
  };

  // Seçenek ekleme fonksiyonu
  const addOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push('');
    setQuestions(newQuestions);
  };

  // Soru güncelleme fonksiyonu
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  // Seçenek güncelleme fonksiyonu
  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  useEffect(() => {
    if (editingSurvey) {
      setTitle(editingSurvey.title);
      setDescription(editingSurvey.description);
      setStartDate(editingSurvey.startDate);
      setEndDate(editingSurvey.endDate);
      setQuestions(editingSurvey.questions);
    }
  }, [editingSurvey, setTitle, setDescription, setStartDate, setEndDate, setQuestions]);
  
  // Anket oluşturma ve formu sıfırlama
  const handleSubmit = (e) => {
    e.preventDefault();

    // Eğer düzenleme modundaysak, anketi güncelle
    if (editingSurvey) {
      const updatedSurvey = {
        ...editingSurvey,
        title,
        description,
        startDate,
        endDate,
        questions
      };
      updateSurvey(updatedSurvey);
      setEditingSurvey(null); // Düzenleme modundan çıkıyoruz
    } else {
      // Yeni anket ekleme işlemi
      addSurvey(title, description, questions, startDate, endDate);
    }

    // Formu sıfırla
    setTitle('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setQuestions([]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Anket Başlığı:</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required
        />
      </div>

      <div>
        <label>Anket Açıklaması:</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required
        />
      </div>

      <div>
        <label>Başlangıç Tarihi:</label>
        <input 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)} 
          required
        />
      </div>

      <div>
        <label>Bitiş Tarihi:</label>
        <input 
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)} 
          required
        />
      </div>

      <h3>Sorular</h3>
      {questions.map((question, index) => (
        <div key={index}>
          <input 
            type="text" 
            placeholder="Soru Metni" 
            value={question.text} 
            onChange={(e) => handleQuestionChange(index, 'text', e.target.value)} 
            required
          />

          <select 
            value={question.type} 
            onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
          >
            <option value="multiple-choice">Çoktan Seçmeli</option>
            <option value="open-ended">Açık Uçlu</option>
            <option value="yes-no">Evet/Hayır</option>
          </select>

          {question.type === 'multiple-choice' && (
            <div>
              <h4>Seçenekler:</h4>
              {question.options.map((option, optIndex) => (
                <input 
                  key={optIndex} 
                  type="text" 
                  placeholder={`Seçenek ${optIndex + 1}`} 
                  value={option} 
                  onChange={(e) => handleOptionChange(index, optIndex, e.target.value)} 
                  required
                />
              ))}
              <button type="button" onClick={() => addOption(index)}>Seçenek Ekle</button>
            </div>
          )}
        </div>
      ))}
      <button type="button" onClick={addQuestion}>
        Soru Ekle
      </button>
      <button type="submit">
        {editingSurvey ? 'Anketi Güncelle' : 'Anketi Oluştur'}
      </button>
    </form>
  );
}

export default SurveyForm;
