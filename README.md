<h1>Anket Uygulaması</h1>  

Bu proje, bir anket uygulaması geliştirmek amacıyla oluşturulmuş bir React ve Node.js tabanlı uygulamadır. Kullanıcılar yeni anketler oluşturabilir, mevcut anketleri düzenleyebilir, yanıt verebilir ve anket sonuçlarını görüntüleyebilir.


<h2>Özellikler</h2>

<h3>Anket Oluşturma</h3>  

• Kullanıcılar anket başlığı, açıklaması, başlangıç ve bitiş tarihlerini belirleyebilir.

• Sorular, "Evet/Hayır", "Çoktan Seçmeli" veya "Açık Uçlu" olarak seçilebilir.

• Çoktan seçmeli sorulara seçenek eklenebilir.


<h3>Anket Düzenleme ve Silme</h3>

• Oluşturulan anketler üzerinde düzenleme yapılabilir.

• İstenmeyen anketler silinebilir.


<h3>Yanıt Verme</h3>

• Kullanıcılar anket sorularını yanıtlayabilir.


<h3>Anket Sonuçları Görüntüleme</h3>

• Anket sonuçları hem grafikler hem de listeler ile görselleştirilir.

• "Evet/Hayır" soruları pasta grafiğiyle; "Çoktan Seçmeli" ve "Açık Uçlu" sorular ise sütun grafiğiyle gösterilir.

<h2>Kullanılan Teknolojiler</h2>

<h3>Frontend</h3>

• React.js

• CSS 
      
<h3>Backend</h3>

• Node.js

• Express.js

      
<h1>Kurulum</h1>

<h2>Gereksinimler</h2>

• Node.js (v14 veya üstü)

• npm (Node.js ile birlikte gelir)

<h2>Adımlar</h2>

<h3>1- Projeyi Klonlayın</h3>

  ```
  git clone https://github.com/kullanici/anket-uygulamasi.git
  cd anket-uygulamasi
  ```

<h3>2- Backend Kurulumu</h3>
  
  ```
  cd backend
  npm install
  npm start
  ```
  
  Backend sunucusu http://localhost:5000 adresinde çalışacaktır.

<h3>3- Frontend Kurulumu</h3>
  
  ```
  cd frontend
  npm install
  npm start
  ```

  Frontend uygulaması http://localhost:3000 adresinde çalışacaktır.

<h1>Kullanım</h1>

• Anket Oluşturma:

  Uygulamanın anasayfasına gidin ve anket bilgilerini doldurun.
  "Soru Ekle" butonuyla soruları ekleyin ve "Anketi Oluştur" butonuna tıklayın.
  
• Anketi Düzenleme ve Silme:

  Oluşturulan anketlerin altındaki "Düzenle" veya "Sil" butonlarına tıklayın.
  
• Yanıt Verme:

  Anketin altındaki "Yanıt Ver" butonuna tıklayın ve soruları cevaplayın.
  
• Sonuçları Görüntüleme:

  Anketin altındaki "Sonuçları Görüntüle" butonuna tıklayın.
  Grafik ve liste halinde sonuçları inceleyin.

  
<h1>Dosya Yapısı</h1>

  ```
  anket-uygulamasi/
  ├── backend/
  │   ├── server.js       # Backend API ve sunucu ayarları
  │   └── package.json    # Backend bağımlılıkları
  ├── frontend/
  │   ├── src/
  │   │   ├── components/ # React bileşenleri
  │   │   ├── styles.css  # Genel CSS dosyası
  │   │   └── App.js      # Uygulamanın ana dosyası
  │   └── package.json    # Frontend bağımlılıkları
  ├── README.md           # Bu doküman
  └── .gitignore          # Git ignore kuralları
  ```


<h1>API Endpointleri</h1>

  <h2>GET /surveys</h2>
    Tüm anketleri listeler.
  
  <h2>POST /surveys</h2>
    Yeni bir anket oluşturur.
  
  <h2>PUT /surveys/:id</h2>
    Mevcut bir anketi günceller.
  
  <h2>DELETE /surveys/:id</h2>
    Bir anketi siler.
  
  <h2>POST /respond/:id</h2>
    Bir ankete yanıt gönderir.
  
  <h2>GET /respond/:id</h2>
    Belirli bir ankete ait tüm yanıtları döndürür.


<h1>Geliştirici Notları</h1>

  • Backend ve frontend arasındaki iletişim axios kullanılarak sağlanmaktadır.
  
  • Backend geçici olarak bellekte veri tutmaktadır. Daha kalıcı bir çözüm için bir veritabanı entegrasyonu (örneğin, MongoDB) önerilir.
