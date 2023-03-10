 
const axios = require('axios'); 
const cheerio = require('cheerio'); 
const CronJob = require('cron').CronJob; 
const { Telegraf } = require('telegraf')
require('dotenv').config(); 

const bot = new Telegraf(process.env.TELEGRAM_API_TOKEN)

const RecentEarthquakes = [];
let latitude = 0, longitude = 0, REVISION = 0; 
let EarthquakeClock0thElement = 0, EarthquakeClock1thElement = 0, EarthquakeClock2thElement = 0, EarthquakeClock3thElement = 0, 
    EarthquakeClock4thElement = 0, EarthquakeClock5thElement = 0, EarthquakeClock6thElement = 0, EarthquakeClock7thElement = 0; 
let NewEarthquakeQuery = 0; 

async function setRecentEarthquakes() {
  let RecentEarthquakesData = {
    hour: '', day: '', month: '', latitude: '', longitude: '', depth: '', magnitude: '', region: '', distance: '', revision: '', Mw: ''
  }; REVISION = 0;
 
  const { data } = await axios.get(process.env.KOERI_REGIONAL_EARTHQAKE_URL); 
  const $ = cheerio.load(data); 
  for (var i = RecentEarthquakes.length; i > 0; i--) {
    RecentEarthquakes.shift();
   };

  for (let i=0 ; i<500 ; i++){
    RecentEarthquakesData.revision = $("pre").text().slice((REVISION)+571+(i*128), (REVISION)+576+(i*128)).trim();
    RecentEarthquakesData.Mw = $("pre").text().trim().slice((REVISION)+643+(i*128), (REVISION)+646+(i*128)).trim().valueOf();

    if(RecentEarthquakesData.revision == "REVIZ"){ REVISION = REVISION + 26; }

    if(RecentEarthquakesData.Mw != "-.-"){ Mw = 5; }
    else if(RecentEarthquakesData.Mw == "-.-"){ Mw = 0; }

    RecentEarthquakesData.hour = $("pre").text().trim().slice((REVISION)+589+(i*128), (REVISION)+594+(i*128));
    RecentEarthquakesData.day = $("pre").text().trim().slice((REVISION)+586+(i*128), (REVISION)+588+(i*128)); 
    RecentEarthquakesData.month = $("pre").text().trim().slice((REVISION)+583+(i*128), (REVISION)+585+(i*128)).replace("01", "Ocak").replace("02", "Şubat").replace("03", "Mart").replace("04", "Nisan").replace("05", "Mayıs").replace("06", "Haziran").replace("07", "Temmuz").replace("08", "Ağustos").replace("09", "Eylül").replace("10", "Ekim").replace("11", "Kasım").replace("12", "Aralık"); //128
    RecentEarthquakesData.latitude = $("pre").text().trim().slice((REVISION)+599+(i*128), (REVISION)+606+(i*128)).toString();
    RecentEarthquakesData.longitude = $("pre").text().trim().slice((REVISION)+609+(i*128), (REVISION)+616+(i*128)).toString();
    RecentEarthquakesData.depth = $("pre").text().trim().slice((REVISION)+622+(i*128), (REVISION)+628+(i*128)).trim().valueOf();
    RecentEarthquakesData.magnitude = $("pre").text().trim().slice((REVISION)+637+(Mw)+(i*128), (REVISION)+642+(Mw)+(i*128)).trim().valueOf();
    RecentEarthquakesData.region = $("pre").text().slice((REVISION)+649+(i*128), (REVISION)+699+(i*128)).trim();
    RecentEarthquakesData.revision = $("pre").text().slice((REVISION)+699+(i*128), (REVISION)+704+(i*128)).trim();

    let latitude2 = latitude * Math.PI / 180; 
    let longitude2 = longitude * Math.PI / 180; 
    let latitude1 = RecentEarthquakesData.latitude * Math.PI / 180; 
    let longitude1 = RecentEarthquakesData.longitude * Math.PI / 180; 
    let R = 6371.009, x1 = (latitude2-latitude1)/2, x2 = (longitude2-longitude1)/2;
    let a = (Math.sin(x1) * Math.sin(x1)) + (Math.sin(x2) * Math.sin(x2)) * (Math.cos(latitude1) * Math.cos(latitude2));
    let c = 2 * Math.asin(Math.sqrt(a));
    RecentEarthquakesData.distance = (R * c).toFixed(2); 

    RecentEarthquakes.push({ ...RecentEarthquakesData });  

}}

const getEarthquakeNotificationJob = new CronJob('* * * * *', async () => { 
 
await setRecentEarthquakes();

for (let a = 0; a < 5 ; a++) {
  
  if ( EarthquakeClock0thElement != RecentEarthquakes[a].hour && EarthquakeClock1thElement != RecentEarthquakes[a].hour && EarthquakeClock2thElement != RecentEarthquakes[a].hour && EarthquakeClock3thElement != RecentEarthquakes[a].hour && 
       EarthquakeClock4thElement != RecentEarthquakes[a].hour && EarthquakeClock5thElement != RecentEarthquakes[a].hour && EarthquakeClock6thElement != RecentEarthquakes[a].hour && EarthquakeClock7thElement != RecentEarthquakes[a].hour) { 
   
    for (let i = 0; i < 8 ; i++) { NewEarthquakeQuery=i;

      if (EarthquakeClock0thElement != RecentEarthquakes[i].hour && EarthquakeClock1thElement != RecentEarthquakes[i].hour && EarthquakeClock2thElement != RecentEarthquakes[i].hour && EarthquakeClock3thElement != RecentEarthquakes[i].hour && 
          EarthquakeClock4thElement != RecentEarthquakes[i].hour && EarthquakeClock5thElement != RecentEarthquakes[i].hour && EarthquakeClock6thElement != RecentEarthquakes[i].hour && EarthquakeClock7thElement != RecentEarthquakes[i].hour) {

        if (RecentEarthquakes[i].magnitude >= 4.0 && RecentEarthquakes[i].magnitude <= 4.9) { 
            await (bot.telegram.sendMessage(process.env.TELEGRAM_ID, `${PublishTheLatestFirstEarthquake(RecentEarthquakes)}`, {disable_web_page_preview: true , disable_notification: false , parse_mode: 'Markdown'}));
        }

        else if (RecentEarthquakes[i].magnitude >= 5.0 && RecentEarthquakes[i].magnitude <= 5.9) { 
            await (bot.telegram.sendMessage(process.env.TELEGRAM_ID, `⚠️  *GÜÇLÜ DEPREM UYARISI*  ⚠️\n${PublishTheLatestFirstEarthquake(RecentEarthquakes)}`, {disable_web_page_preview: true , disable_notification: false , parse_mode: 'Markdown'}));
        }

        else if (RecentEarthquakes[i].magnitude >= 6.0 && RecentEarthquakes[i].magnitude <= 6.9) { 
            await (bot.telegram.sendMessage(process.env.TELEGRAM_ID, `⚠️️⚠️️  *YIKICI DEPREM UYARISI*  ⚠️️⚠️️\n${PublishTheLatestFirstEarthquake(RecentEarthquakes)} \n⚠️️⚠️️  *YIKICI DEPREM UYARISI*  ⚠️️⚠️️`, {disable_web_page_preview: true , disable_notification: false , parse_mode: 'Markdown'}));
        }

        else if (RecentEarthquakes[i].magnitude >= 7.0) { 
            await (bot.telegram.sendMessage(process.env.TELEGRAM_ID, `⚠️⚠️⚠️ *AFET DEPREM UYARISI*  ⚠️⚠️⚠️\n${PublishTheLatestFirstEarthquake(RecentEarthquakes)} \n⚠️⚠️⚠️  *AFET DEPREM UYARISI*  ⚠️⚠️⚠️`, {disable_web_page_preview: true , disable_notification: false , parse_mode: 'Markdown'}));
        }
      }
    }
        EarthquakeClock0thElement = RecentEarthquakes[0].hour; EarthquakeClock1thElement = RecentEarthquakes[1].hour; EarthquakeClock2thElement = RecentEarthquakes[2].hour; EarthquakeClock3thElement = RecentEarthquakes[3].hour;
        EarthquakeClock4thElement = RecentEarthquakes[4].hour; EarthquakeClock5thElement = RecentEarthquakes[5].hour; EarthquakeClock6thElement = RecentEarthquakes[6].hour; EarthquakeClock7thElement = RecentEarthquakes[7].hour;
    } 
  }
});


function PublishTheLatestFirstEarthquake(RecentEarthquakes) { 
return `
📍 Yer: *${RecentEarthquakes[NewEarthquakeQuery].region}*
🎯 Büyüklük: *${RecentEarthquakes[NewEarthquakeQuery].magnitude}*  〽️ Derinlik: *${RecentEarthquakes[NewEarthquakeQuery].depth} km*
🗓 Gün: *${RecentEarthquakes[NewEarthquakeQuery].day} ${RecentEarthquakes[NewEarthquakeQuery].month}*  🕗 Saat: *${RecentEarthquakes[NewEarthquakeQuery].hour}*
🗺️ [Google Haritalarda Görüntüle](https://www.google.com/maps?q=${RecentEarthquakes[NewEarthquakeQuery].latitude},${RecentEarthquakes[NewEarthquakeQuery].longitude}&ll=${RecentEarthquakes[NewEarthquakeQuery].latitude},${RecentEarthquakes[NewEarthquakeQuery].longitude}&z=8)
`}

async function GetRecentEarthquakes() {
  let ListRecentEarthquakes = '', NumberOfEarthquakes = 0;
  for (let i = 0; i < 500; i++) {
    if(RecentEarthquakes[i].magnitude >= 2 && NumberOfEarthquakes < 28){
      ListRecentEarthquakes += PublishRecentEarthquakes(RecentEarthquakes[i]);
      NumberOfEarthquakes = NumberOfEarthquakes + 1;
     }  
  }
  return ListRecentEarthquakes;
}

function PublishRecentEarthquakes(RecentEarthquakes) { 
return `
📍 Yer: [${RecentEarthquakes.region}](https://www.google.com/maps?q=${RecentEarthquakes.latitude},${RecentEarthquakes.longitude}&ll=${RecentEarthquakes.latitude},${RecentEarthquakes.longitude}&z=8)
🎯 Büyüklük: *${RecentEarthquakes.magnitude}*   〽️ Derinlik: *${RecentEarthquakes.depth} km*
🗓 Gün: *${RecentEarthquakes.day} ${RecentEarthquakes.month}*   🕗 Saat: *${RecentEarthquakes.hour}*
`}



async function GetLatestEarthquakesbyLocation() { //

  let ListRecentEarthquakesbyLocation = '', NumberOfEarthquakes = 0;
  RecentEarthquakes.sort(function(a, b){return a.distance - b.distance});
 
   for (let i = 0; i < 500; i++) {
    if(RecentEarthquakes[i].magnitude >= 2 && NumberOfEarthquakes < 28){
     ListRecentEarthquakesbyLocation += PublishRecentEarthquakesbyLocation(RecentEarthquakes[i]);
     NumberOfEarthquakes = NumberOfEarthquakes + 1;
    }  
   }
  return ListRecentEarthquakesbyLocation;
 }
 
 function PublishRecentEarthquakesbyLocation(RecentEarthquakes) { 
 return `
 📍 Yer: [${RecentEarthquakes.region}](https://www.google.com/maps?q=${RecentEarthquakes.latitude},${RecentEarthquakes.longitude}&ll=${RecentEarthquakes.latitude},${RecentEarthquakes.longitude}&z=8)
 🎯 Büyüklük: *${RecentEarthquakes.magnitude}*  〽️ Derinlik: *${RecentEarthquakes.depth} km*
 🗓 Gün: *${RecentEarthquakes.day} ${RecentEarthquakes.month}*  🕗 Saat: *${RecentEarthquakes.hour}*
 🌍 Konumunuza uzaklık: *${RecentEarthquakes.distance} km*
 `}


async function GetLatestMajorEarthquakes() { 
  let ListRecentMajorEarthquakes = '', NumberOfEarthquakes = 0;


  for (let i = 0; i < 500; i++) {
    if(RecentEarthquakes[i].magnitude >= EarthquakeMagnitude_1 && RecentEarthquakes[i].magnitude < EarthquakeMagnitude_2 && NumberOfEarthquakes < 28){
    ListRecentMajorEarthquakes += PublishLastMajorEarthquakes(RecentEarthquakes[i]);
    NumberOfEarthquakes = NumberOfEarthquakes + 1;
    }}
  
  return ListRecentMajorEarthquakes;
}

function PublishLastMajorEarthquakes(RecentEarthquakes) { 
if(RecentEarthquakes.magnitude >= EarthquakeMagnitude_1 && RecentEarthquakes.magnitude < EarthquakeMagnitude_2){
return `
📍 Yer: [${RecentEarthquakes.region}](https://www.google.com/maps?q=${RecentEarthquakes.latitude},${RecentEarthquakes.longitude}&ll=${RecentEarthquakes.latitude},${RecentEarthquakes.longitude}&z=8)
🎯 Büyüklük: *${RecentEarthquakes.magnitude}*  〽️ Derinlik: *${RecentEarthquakes.depth} km*
🗓 Gün: *${RecentEarthquakes.day} ${RecentEarthquakes.month}*  🕗 Saat: *${RecentEarthquakes.hour}*
`
}
else {
   return ''
 }}


async function GetRecentMajorEarthquakesbyLocation() { //
  RecentEarthquakes.sort(function(a, b){return a.distance - b.distance});
  let ListRecentMajorEarthquakesinLocation = ''; let NumberOfEarthquakes = 0;

  for (let i = 0; i < 500; i++) {
  if(RecentEarthquakes[i].magnitude >= EarthquakeMagnitude_1 && RecentEarthquakes[i].magnitude < EarthquakeMagnitude_2 && NumberOfEarthquakes < 28){
  ListRecentMajorEarthquakesinLocation += PublishRecentMajorEarthquakesatLocation(RecentEarthquakes[i]);
  NumberOfEarthquakes = NumberOfEarthquakes + 1;
  }}

  return ListRecentMajorEarthquakesinLocation;
}

function PublishRecentMajorEarthquakesatLocation(RecentEarthquakes) { 
if(RecentEarthquakes.magnitude >= EarthquakeMagnitude_1 && RecentEarthquakes.magnitude < EarthquakeMagnitude_2){
return `
📍 Yer: [${RecentEarthquakes.region}](https://www.google.com/maps?q=${RecentEarthquakes.latitude},${RecentEarthquakes.longitude}&ll=${RecentEarthquakes.latitude},${RecentEarthquakes.longitude}&z=8)
🎯 Büyüklük: *${RecentEarthquakes.magnitude}*  〽️ Derinlik: *${RecentEarthquakes.depth} km*
🗓 Gün: *${RecentEarthquakes.day} ${RecentEarthquakes.month}*  🕗 Saat: *${RecentEarthquakes.hour}*
🌍 Konumunuza uzaklık: *${RecentEarthquakes.distance} km*
`
}
else {
   return ''
 }}



async function startBot() { 

bot.start((ctx) =>  ctx.reply(`Selamün Aleyküm *${ctx.from.first_name}* 😊 SON DEPREMLER BOTU'na hoş geldin
\nSON DEPREMLER BOTU Kandilli Rasathanesi tarafından yayınlanan verileri kullanmaktadır.
\nBot aracılığı anlık gelişen depremleri listeleyebilir veya konumunuza yakın depremleri görüntüleyebilirsiniz.
\nBot komutlarına sol alttaki *☰ Menü* bölümünden ulaşabilir, en son gelişen deprem bilgilerini çağırabilirsiniz.
`, {parse_mode: 'Markdown'}));


bot.command('sondepremler', async ctx => {
  await setRecentEarthquakes();

  bot.telegram.sendMessage(ctx.chat.id, await GetRecentEarthquakes(), {disable_web_page_preview: true , parse_mode: 'Markdown'});

});


bot.command('son3ile4', async ctx => {
  EarthquakeMagnitude_1 = 3; EarthquakeMagnitude_2 = 4;
  await setRecentEarthquakes();

  if(await GetLatestMajorEarthquakes() == '' ){
    bot.telegram.sendMessage(ctx.chat.id, '*Son zamanlarda bu büyüklükte bir deprem gerçekleşmedi!*', {parse_mode: 'Markdown'});
  }

  else{
    bot.telegram.sendMessage(ctx.chat.id, await GetLatestMajorEarthquakes(), {disable_web_page_preview: true , parse_mode: 'Markdown'});
}})


bot.command('son4ile5', async ctx => {
  EarthquakeMagnitude_1 = 4; EarthquakeMagnitude_2 = 5;
  await setRecentEarthquakes();

  if(await GetLatestMajorEarthquakes() == '' ){
    bot.telegram.sendMessage(ctx.chat.id, '*Son zamanlarda bu büyüklükte bir deprem gerçekleşmedi!*', {parse_mode: 'Markdown'});
  }

  else{
    bot.telegram.sendMessage(ctx.chat.id, await GetLatestMajorEarthquakes(), {disable_web_page_preview: true , parse_mode: 'Markdown'});
}})


bot.command('son5ile6', async ctx => {
  EarthquakeMagnitude_1 = 5; EarthquakeMagnitude_2 = 6;
  await setRecentEarthquakes();

  if(await GetLatestMajorEarthquakes() == '' ){
    bot.telegram.sendMessage(ctx.chat.id, '*Son zamanlarda bu büyüklükte bir deprem gerçekleşmedi!*', {parse_mode: 'Markdown'});
  }

  else{
    bot.telegram.sendMessage(ctx.chat.id, await GetLatestMajorEarthquakes(), {disable_web_page_preview: true , parse_mode: 'Markdown'});
}})

bot.command('son6uzeri', async ctx => {
  EarthquakeMagnitude_1 = 6; EarthquakeMagnitude_2 = 20;
  await setRecentEarthquakes();

  if(await GetLatestMajorEarthquakes() == '' ){
    bot.telegram.sendMessage(ctx.chat.id, '*Son zamanlarda bu büyüklükte bir deprem gerçekleşmedi!*', {parse_mode: 'Markdown'});
  }

  else{
    bot.telegram.sendMessage(ctx.chat.id, await GetLatestMajorEarthquakes(), {disable_web_page_preview: true , parse_mode: 'Markdown'});
}})


bot.command('konumdeprem', (ctx) => {
  bot.telegram.sendMessage(ctx.chat.id,  "*Lütfen altta bulunan 📎 ataç ikonundan mevcut konumunuzu paylaşın.*", {parse_mode: 'Markdown'});
  
  bot.on('location', async (ctx) => {
    latitude = ctx.message.location.latitude; longitude = ctx.message.location.longitude;
  
    ctx.reply('*Konumunuza yakın hangi deprem bilgisini istiyorsunuz?*',
      {
        reply_markup:{
          inline_keyboard: [
              [{text: "En Son Gerçekleşen Depremler", callback_data: "last"}],
              [{text: "3.0 - 4.0 Arası Depremler", callback_data: "3-4"}],
              [{text: "4.0 - 5.0 Arası Depremler", callback_data: "4-5"}],
              [{text: "5.0 - 6.0 Arası Depremler", callback_data: "5-6"}],
              [{text: "6.0 'dan Büyük Depremler", callback_data: "6+"}]
          ]
        }
      })
    
      bot.action('last', async (ctx) =>{
        ctx.deleteMessage()
        await setRecentEarthquakes();
      
        await (bot.telegram.sendMessage(ctx.chat.id, await GetLatestEarthquakesbyLocation(RecentEarthquakes), {disable_web_page_preview: true , parse_mode: 'Markdown'}));  
      })
      
      bot.action('3-4', async (ctx) =>{
        ctx.deleteMessage()
        EarthquakeMagnitude_1 = 3; EarthquakeMagnitude_2 = 4;
        await setRecentEarthquakes();
    
      if(await GetRecentMajorEarthquakesbyLocation() == '' ){
        bot.telegram.sendMessage(ctx.chat.id, '*Son zamanlarda bu büyüklükte bir deprem gerçekleşmedi!*', {parse_mode: 'Markdown'});
      }
    
      else{
        bot.telegram.sendMessage(ctx.chat.id, await GetRecentMajorEarthquakesbyLocation(), {disable_web_page_preview: true , parse_mode: 'Markdown'});
      }
      })
      
      bot.action('4-5', async (ctx) =>{
        ctx.deleteMessage()
        EarthquakeMagnitude_1 = 4; EarthquakeMagnitude_2 = 5;
        await setRecentEarthquakes();
    
        if(await GetRecentMajorEarthquakesbyLocation() == '' ){
          bot.telegram.sendMessage(ctx.chat.id, '*Son zamanlarda bu büyüklükte bir deprem gerçekleşmedi!*', {parse_mode: 'Markdown'});
        }
      
        else{
          bot.telegram.sendMessage(ctx.chat.id, await GetRecentMajorEarthquakesbyLocation(), {disable_web_page_preview: true , parse_mode: 'Markdown'});
        }
      })

      bot.action('5-6', async (ctx) =>{
        ctx.deleteMessage()
        EarthquakeMagnitude_1 = 5; EarthquakeMagnitude_2 = 6;
        await setRecentEarthquakes();
    
        if(await GetRecentMajorEarthquakesbyLocation() == '' ){
          bot.telegram.sendMessage(ctx.chat.id, '*Son zamanlarda bu büyüklükte bir deprem gerçekleşmedi!*', {parse_mode: 'Markdown'});
        }
      
        else{
          bot.telegram.sendMessage(ctx.chat.id, await GetRecentMajorEarthquakesbyLocation(), {disable_web_page_preview: true , parse_mode: 'Markdown'});
        }
      })


      bot.action('6+', async (ctx) =>{
        ctx.deleteMessage()
        EarthquakeMagnitude_1 = 6; EarthquakeMagnitude_2 = 20;
        await setRecentEarthquakes();
    
        if(await GetRecentMajorEarthquakesbyLocation() == '' ){
          bot.telegram.sendMessage(ctx.chat.id, '*Son zamanlarda bu büyüklükte bir deprem gerçekleşmedi!*', {parse_mode: 'Markdown'});
        }
      
        else{
          bot.telegram.sendMessage(ctx.chat.id, await GetRecentMajorEarthquakesbyLocation(), {disable_web_page_preview: true , parse_mode: 'Markdown'});
        }
      })
    
    })
  });


  bot.command('iletisim', (ctx) => {
  ctx.reply(`*Bot ile ilgili sorun, şikayet ve önerilerinizi @ahmethkablama 'ya iletebilirsiniz*`, {parse_mode: 'Markdown'})
});

bot.launch();

}

async function runBot() {
await setRecentEarthquakes();
EarthquakeClock0thElement = RecentEarthquakes[0].hour; 
EarthquakeClock1thElement = RecentEarthquakes[1].hour;
EarthquakeClock2thElement = RecentEarthquakes[2].hour;
EarthquakeClock3thElement = RecentEarthquakes[3].hour;
EarthquakeClock4thElement = RecentEarthquakes[4].hour;
EarthquakeClock5thElement = RecentEarthquakes[5].hour;
EarthquakeClock6thElement = RecentEarthquakes[6].hour;
EarthquakeClock7thElement = RecentEarthquakes[7].hour;
await startBot();
getEarthquakeNotificationJob.start();
}
runBot();

