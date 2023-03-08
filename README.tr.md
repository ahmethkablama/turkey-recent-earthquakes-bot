<p align="center">
  <a href="https://github.com/ahmethkablama/turkey-recent-earthquakes-bot/blob/main/README.tr.md">Türkçe</a> |
  <a href="https://github.com/ahmethkablama/turkey-recent-earthquakes-bot/blob/main/README.md">İngilizce</a>
</p>

# Türkiye'de Gerçekleşen Son Depremler Botu 

Kandilli Rasathanesi Ve Deprem Araştırma Enstitüsünden (KOERI) alınan verilerle son depremleri çağırabilir, depremlerin büyüklüğüne veya konumuna göre listeleyebilir, en son gerçekleşen depremi belirlenen kişi ve gruplara otomatik olarak gönderebilirsiniz.

SON DEPREMLER BOTU      | SON DEPREMLER KANALI
----------------------- | ----------------------------------------    
[![@SonDeprem_bot](https://img.shields.io/badge/%F0%9F%92%AC%20Telegram-%40sondeprem__bot-red)](https://telegram.me/SonDeprem_bot)                | [![@sondepremlerkandilli](https://img.shields.io/badge/%F0%9F%93%A2%20Telegram-%40sondepremlerkandilli-red)](https://t.me/sondepremlerkandilli)


## Bot Komutları
Komut                   | Açıklama
----------------------- | ----------------------------------------    
`/start`                | Botu başlatır
`/sondepremler`         | En son depremler
`son3ile4`              | 3 ile 4 arası depremler
`/son4ile5`             | 4 ile 5 arası depremler
`/son5ile6`             | 5 ile 6 arası depremler 
`/son6uzeri`            | 6 ve üzeri depremler
`/konumdeprem`          | Konuma göre depremler
`/iletisim`             | Geliştirici iletişimi


## Hazırlık
1. Resmi Telegram botu [@BotFather](https://telegram.me/BotFather) aracılığı ile bot oluştur ve API TOKEN'i alın
2. Botu kendi üzerinizde çalıştıracaksanız: 
   * Kendinize ait bir mesajı [@userinfobot](https://telegram.me/userinfobot) botuna gönderin ve ID yi alın
   * Oluşturduğunuz bota gidin ve başlatın
3. Botu bir grup üzerinde çalıştıracaksınız:
   * Grup adıyla gönderilen bir mesajı [@userinfobot](https://telegram.me/userinfobot) botuna gönderin ve ID yi alın
   * Botu grubunuza ekleyip yöneticilik verin


## Yerelde Çalıştırma

1. Repoyu `https://github.com/ahmethkablama/turkey-recent-earthquakes-bot` klonlayın veya indirip açın
   * Klonlama için aşağıdaki komutu kullanabilirsiniz
     ```bash
     git clone https://github.com/ahmethkablama/turkey-recent-earthquakes-bot
     ```
2. terminalden `npm` kurulumunu gerçekleştirin
   ```bash
   npm install
   ```
3. `.env.example` dosyasına göre `.env` dosyasını oluşturun
4. `.env` dosyasının içinde `YOUR_API_TOKEN` ve `YOUR_ID` kısımlarını kendinize göre doldurun
5. terminalden `npm` kurulumunu gerçekleştirin
6. `npm run start` veya `node bot.js` komutuyla çalıştırın

## Sunucuda Çalıştırma (Cpanel)

1. Repoyu `https://github.com/ahmethkablama/turkey-recent-earthquakes-bot` indirin
2. Sunucunuzun ana dizinine botunuzun adıyla boş bir klasör oluşturun
3. Oluşturduğunuz klasöre bot dosyalarını yükleyin
4. `.env-example` dosyasına göre `.env` dosyasını oluşturun
5. `.env` dosyasının içinde `YOUR_API_TOKEN` ve `YOUR_ID` kısımlarını kendineize göre doldurun
6. Sunucu panelinizden (Cpanel olarak tarif edilmektedir) `Setup Node.js App` sekmesine gidin
7. `CREATE APPLİCATİON` butonuna tıklayarak yeni bir uygulama oluşturma adımına gidin
8. Uygun Node.js versiyonunu ve modunu seçin. Botunuzun dosya yolunu ve başlangıç dosyasını (`bot.js` olarak belirlenmiştir) yazın
9. `Run NPM Install` komutuyla NPM kurulumunu yapın ve `Run JS script` komutuyla botunuzu çalıştırın


## Kullanılan Kütüphaneler

* [Nodejs](https://nodejs.org/en/)
* [Telegraf Package](https://www.npmjs.com/package/telegraf)
* [Axios Package](https://www.npmjs.com/package/axios)
* [Cheerio Package](https://www.npmjs.com/package/cheerio)
* [Cron Package](https://www.npmjs.com/package/cron)

## Yapılacaklar Listesi
- [ ] Öncül Deprem Bilgi Sistemi eklenecek.
- [ ] Fazla mesaj isteklerine karşı oluşan hatalar giderilecek.
- [ ] Kullanıcının botu engellemesi sonucu mesaj gönderme isteği sorunu düzeltilecek.
- [ ] Sunucu sorunu olan siteden "Get" isteği gönderildiğinde oluşan sorun giderilecek.
- [ ] Database üzerinde çalışır bir sürüm yazılacak.