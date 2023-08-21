 
const axios = require('axios'); 
const cheerio = require('cheerio');
const CronJob = require('cron').CronJob; 
const { Telegraf } = require('telegraf')
require('dotenv').config(); 
const { telegrafThrottler } = require('telegraf-throttler');

const bot = new Telegraf(process.env.TELEGRAM_API_TOKEN)
const throttler = telegrafThrottler();



const RecentEarthquakes = [];

let latitude = 0, longitude = 0, REVISION = 0; 
let EarthquakeClock0thElement = 0, EarthquakeClock1thElement = 0, EarthquakeClock2thElement = 0, EarthquakeClock3thElement = 0, 
    EarthquakeClock4thElement = 0, EarthquakeClock5thElement = 0, EarthquakeClock6thElement = 0, EarthquakeClock7thElement = 0; 
let NewEarthquakeQuery = 0; 
const EarlyEarthquake = [];
let EarlyEarthquakePost = "";
let ErrorSwitchEarlyEarthquake = 0, ErrorSwitchRecentEarthquake = 0;


async function setEarlyEarthquake() {
  let EarlyEarthquakeData = {
    hour: '', minute: '', day: '', month: '', latitude: '', longitude: '', depth: '', magnitude: '', region: '', time: ''
  };
  try{
  const { data } = await axios.get(process.env.KOERI_AUTOMATIC_EARTHQAKE_URL); 
  const $ = cheerio.load(data); 

  for (var i = EarlyEarthquake.length; i > 0; i--) {
    EarlyEarthquake.shift();
  };
    EarlyEarthquakeData.time = $(`body div:nth-of-type(2) table tbody tr:nth-of-type(2) td:nth-of-type(1)`).text().trim().slice(11, 16); 
    EarlyEarthquakeData.hour = ("0" + (Number($(`body div:nth-of-type(2) table tbody tr:nth-of-type(2) td:nth-of-type(1)`).text().trim().slice(11, 13).replace("21", "-03").replace("22", "-02").replace("23", "-01")) + 3)).slice(-2);
    EarlyEarthquakeData.minute = $(`body div:nth-of-type(2) table tbody tr:nth-of-type(2) td:nth-of-type(1)`).text().trim().slice(14, 16);
    EarlyEarthquakeData.day = $(`body div:nth-of-type(2) table tbody tr:nth-of-type(2) td:nth-of-type(1)`).text().trim().slice(8, 10); 
    EarlyEarthquakeData.month = $(`body div:nth-of-type(2) table tbody tr:nth-of-type(2) td:nth-of-type(1)`).text().trim().slice(5, 7).replace("01", "Ocak").replace("02", "Şubat").replace("03", "Mart").replace("04", "Nisan").replace("05", "Mayıs").replace("06", "Haziran").replace("07", "Temmuz").replace("08", "Ağustos").replace("09", "Eylül").replace("10", "Ekim").replace("11", "Kasım").replace("12", "Aralık"); 
    EarlyEarthquakeData.latitude = $(`body div:nth-of-type(2) table tbody tr:nth-of-type(2) td:nth-of-type(4)`).text().trim().slice(0, 7); 
    EarlyEarthquakeData.longitude = $(`body div:nth-of-type(2) table tbody tr:nth-of-type(2) td:nth-of-type(5)`).text().trim().slice(0, 7); 
    EarlyEarthquakeData.depth = $(`body div:nth-of-type(2) table tbody tr:nth-of-type(2) td:nth-of-type(6)`).text().trim().replace("0", "-").replace("1-", "10"); 
    EarlyEarthquakeData.magnitude = $(`body div:nth-of-type(2) table tbody tr:nth-of-type(2) td:nth-of-type(2)`).text().trim(); 
    EarlyEarthquakeData.region = $(`body div:nth-of-type(2) table tbody tr:nth-of-type(2) td:nth-of-type(7)`).text().trim().replace("-", "-(").replace("Jordan/Syria Region", "(Ürdün/Suriye Bölgesi").replace("Aegean Sea", "(Ege Denizi").replace("Turkey", "(Türkiye").replace("Iraq", "(Irak").replace("Cyprus Region", "(Kıbrıs Bölgesi").replace("Georgia Armenia Turkey Border Reg.", "(Gürcistan Ermenistan Türkiye Sınırı").replace("Black Sea", "(Karadeniz").replace(")", "").toUpperCase(); 
    EarlyEarthquake.push({ ...EarlyEarthquakeData });

    ErrorSwitchEarlyEarthquake = 0;
}

catch(err){
  //console.log(err);
  ErrorSwitchEarlyEarthquake = 1;
}  
}
       

const getEarlyEarthquakeJob = new CronJob('* * * * *', async () => { 
  
  await setEarlyEarthquake(); 
  
  if(ErrorSwitchEarlyEarthquake == 0){
  
  if (EarlyEarthquakePost != EarlyEarthquake[0].time && EarlyEarthquake[0].latitude >= 34.3892 && EarlyEarthquake[0].latitude <= 43.2339 && EarlyEarthquake[0].longitude >= 24.7423 && EarlyEarthquake[0].longitude <= 45.9758) { 
    
    if(EarlyEarthquake[0].magnitude >= 3.9 && EarlyEarthquake[0].magnitude <= 4.9){ 
    await (bot.telegram.sendMessage(process.env.TELEGRAM_ID, `${EarlyEarthquakePush(EarlyEarthquake)}`, {disable_web_page_preview: true , disable_notification: false , parse_mode: 'Markdown'}));
    }

    else if(EarlyEarthquake[0].magnitude >= 5.0 && EarlyEarthquake[0].magnitude <= 5.9){ 
    await (bot.telegram.sendMessage(process.env.TELEGRAM_ID, `⚠️  *GÜÇLÜ DEPREM UYARISI*  ⚠️\n${EarlyEarthquakePush(EarlyEarthquake)}`, {disable_web_page_preview: true , disable_notification: false , parse_mode: 'Markdown'}));
    }

    else if(EarlyEarthquake[0].magnitude >= 6.0 && EarlyEarthquake[0].magnitude <= 6.9){ 
    await (bot.telegram.sendMessage(process.env.TELEGRAM_ID, `⚠️️⚠️️  *YIKICI DEPREM UYARISI*  ⚠️️⚠️️\n${EarlyEarthquakePush(EarlyEarthquake)}`, {disable_web_page_preview: true , disable_notification: false , parse_mode: 'Markdown'}));
    }

    else if(EarlyEarthquake[0].magnitude >= 7.0){ 
    await (bot.telegram.sendMessage(process.env.TELEGRAM_ID, `⚠️⚠️⚠️ *AFET DEPREM UYARISI*  ⚠️⚠️⚠️️\n${EarlyEarthquakePush(EarlyEarthquake)}`, {disable_web_page_preview: true , disable_notification: false , parse_mode: 'Markdown'}));
    }

  EarlyEarthquakePost = EarlyEarthquake[0].time;
  }
}
});

function EarlyEarthquakePush(EarlyEarthquake) { 
return `
🔺 *İLKSEL DEPREM BİLGİSİ* 🔺
📍 Konum: [${EarlyEarthquake[0].region})](https://maps.google.com/?q=${EarlyEarthquake[0].latitude},${EarlyEarthquake[0].longitude}&ll=${EarlyEarthquake[0].latitude},${EarlyEarthquake[0].longitude}&z=8)
🎯 Büyüklük: *${EarlyEarthquake[0].magnitude}*   🕗 Saat: *${EarlyEarthquake[0].hour}:${EarlyEarthquake[0].minute}*
`}




async function setRecentEarthquakes() {
  let RecentEarthquakesData = {
    hour: '', day: '', month: '', latitude: '', longitude: '', depth: '', magnitude: '', region: '', distance: '', revision: '', Mw: ''
  }; REVISION = 0;
  try{

  const { data } = await axios.get(process.env.KOERI_REGIONAL_EARTHQAKE_URL); 
  const $ = cheerio.load(data); 
  for (var i = RecentEarthquakes.length; i > 0; i--) {
    RecentEarthquakes.shift();
   };

  for (let i=0 ; i<=500 ; i++){
    RecentEarthquakesData.revision = $("pre").text().slice((REVISION)+571+(i*128), (REVISION)+576+(i*128)).trim();
    RecentEarthquakesData.Mw = $("pre").text().trim().slice((REVISION)+643+(i*128), (REVISION)+646+(i*128)).trim().valueOf();

    if(RecentEarthquakesData.revision == "REVIZ"){ REVISION = REVISION + 26; }

    if(RecentEarthquakesData.Mw != "-.-"){ Mw = 5; }
    else if(RecentEarthquakesData.Mw == "-.-"){ Mw = 0; }

    RecentEarthquakesData.hour = $("pre").text().trim().slice((REVISION)+589+(i*128), (REVISION)+594+(i*128)); //128
    RecentEarthquakesData.day = $("pre").text().trim().slice((REVISION)+586+(i*128), (REVISION)+588+(i*128)); //128
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
    ErrorSwitchRecentEarthquake = 0;
  }
}
catch(err){
  //console.log(err);
  ErrorSwitchRecentEarthquake = 1;
}
}


const getEarthquakeNotificationJob = new CronJob('* * * * *', async () => { 
 
  await setRecentEarthquakes();
  
  if(ErrorSwitchRecentEarthquake == 0){
  
  for (let a = 0; a < 5 ; a++) {
    
    if ( EarthquakeClock0thElement != RecentEarthquakes[a].hour && EarthquakeClock1thElement != RecentEarthquakes[a].hour && EarthquakeClock2thElement != RecentEarthquakes[a].hour && EarthquakeClock3thElement != RecentEarthquakes[a].hour && 
         EarthquakeClock4thElement != RecentEarthquakes[a].hour && EarthquakeClock5thElement != RecentEarthquakes[a].hour && EarthquakeClock6thElement != RecentEarthquakes[a].hour && EarthquakeClock7thElement != RecentEarthquakes[a].hour && 
         RecentEarthquakes[a].magnitude >= 3.9) { 
     
      for (let i = 0; i < 8 ; i++) { NewEarthquakeQuery=i;
  
        if (EarthquakeClock0thElement != RecentEarthquakes[i].hour && EarthquakeClock1thElement != RecentEarthquakes[i].hour && EarthquakeClock2thElement != RecentEarthquakes[i].hour && EarthquakeClock3thElement != RecentEarthquakes[i].hour && 
            EarthquakeClock4thElement != RecentEarthquakes[i].hour && EarthquakeClock5thElement != RecentEarthquakes[i].hour && EarthquakeClock6thElement != RecentEarthquakes[i].hour && EarthquakeClock7thElement != RecentEarthquakes[i].hour) {
  
          if (RecentEarthquakes[i].magnitude >= 3.9 && RecentEarthquakes[i].magnitude <= 4.2) { 
              await (bot.telegram.sendMessage(process.env.TELEGRAM_ID, `${PublishTheLatestFirstEarthquake(RecentEarthquakes)}`, {disable_web_page_preview: true , disable_notification: false , parse_mode: 'Markdown'}));
              //await (bot.telegram.sendPhoto(process.env.TELEGRAM_ID, `https://maps.googleapis.com/maps/api/staticmap?language=tr&region=US&zoom=8&size=650x345&scale=2&markers=anchor:center|icon:https://www.teknovudu.com/medya/2023/03/48.png|${RecentEarthquakes[NewEarthquakeQuery].latitude},${RecentEarthquakes[NewEarthquakeQuery].longitude}&key=${process.env.GOOGLE_MAPS_API_TOKEN}_id=${process.env.GOOGLE_MAPS_ID}`, {caption: `${PublishTheLatestFirstEarthquake(RecentEarthquakes)}` , parse_mode: 'Markdown'}));
          }

          else if (RecentEarthquakes[i].magnitude >= 4.3 && RecentEarthquakes[i].magnitude <= 4.5) { 
              await (bot.telegram.sendMessage(process.env.TELEGRAM_ID, `${PublishTheLatestFirstEarthquake(RecentEarthquakes)}`, {disable_web_page_preview: true , disable_notification: false , parse_mode: 'Markdown'}));
              //await (bot.telegram.sendPhoto(process.env.TELEGRAM_ID, `https://maps.googleapis.com/maps/api/staticmap?language=tr&region=US&zoom=8&size=650x345&scale=2&markers=anchor:center|icon:https://www.teknovudu.com/medya/2023/03/50.png|${RecentEarthquakes[NewEarthquakeQuery].latitude},${RecentEarthquakes[NewEarthquakeQuery].longitude}&key=${process.env.GOOGLE_MAPS_API_TOKEN}_id=${process.env.GOOGLE_MAPS_ID}`, {caption: `${PublishTheLatestFirstEarthquake(RecentEarthquakes)}` , parse_mode: 'Markdown'}));
          }

          else if (RecentEarthquakes[i].magnitude >= 4.6 && RecentEarthquakes[i].magnitude <= 4.9) { 
              await (bot.telegram.sendMessage(process.env.TELEGRAM_ID, `${PublishTheLatestFirstEarthquake(RecentEarthquakes)}`, {disable_web_page_preview: true , disable_notification: false , parse_mode: 'Markdown'}));
              //await (bot.telegram.sendPhoto(process.env.TELEGRAM_ID, `https://maps.googleapis.com/maps/api/staticmap?language=tr&region=US&zoom=7&size=650x345&scale=2&markers=anchor:center|icon:https://www.teknovudu.com/medya/2023/03/52.png|${RecentEarthquakes[NewEarthquakeQuery].latitude},${RecentEarthquakes[NewEarthquakeQuery].longitude}&key=${process.env.GOOGLE_MAPS_API_TOKEN}_id=${process.env.GOOGLE_MAPS_ID}`, {caption: `${PublishTheLatestFirstEarthquake(RecentEarthquakes)}` , parse_mode: 'Markdown'}));
          }

          else if (RecentEarthquakes[i].magnitude >= 5.0 && RecentEarthquakes[i].magnitude <= 5.4) { 
              await (bot.telegram.sendMessage(process.env.TELEGRAM_ID, `⚠️  *GÜÇLÜ DEPREM UYARISI*  ⚠️\n${PublishTheLatestFirstEarthquake(RecentEarthquakes)}`, {disable_web_page_preview: true , disable_notification: false , parse_mode: 'Markdown'}));
              //await (bot.telegram.sendPhoto(process.env.TELEGRAM_ID, `https://maps.googleapis.com/maps/api/staticmap?language=tr&region=US&zoom=7&size=650x345&scale=2&markers=anchor:center|icon:https://www.teknovudu.com/medya/2023/03/54.png|${RecentEarthquakes[NewEarthquakeQuery].latitude},${RecentEarthquakes[NewEarthquakeQuery].longitude}&key=${process.env.GOOGLE_MAPS_API_TOKEN}_id=${process.env.GOOGLE_MAPS_ID}`, {caption: `⚠️  *GÜÇLÜ DEPREM UYARISI*  ⚠️\n${PublishTheLatestFirstEarthquake(RecentEarthquakes)}` , parse_mode: 'Markdown'}));
          }

          else if (RecentEarthquakes[i].magnitude >= 5.5 && RecentEarthquakes[i].magnitude <= 5.9) { 
              await (bot.telegram.sendMessage(process.env.TELEGRAM_ID, `⚠️  *GÜÇLÜ DEPREM UYARISI*  ⚠️\n${PublishTheLatestFirstEarthquake(RecentEarthquakes)}`, {disable_web_page_preview: true , disable_notification: false , parse_mode: 'Markdown'}));
              //await (bot.telegram.sendPhoto(process.env.TELEGRAM_ID, `https://maps.googleapis.com/maps/api/staticmap?language=tr&region=US&zoom=7&size=650x345&scale=2&markers=anchor:center|icon:https://www.teknovudu.com/medya/2023/03/56.png|${RecentEarthquakes[NewEarthquakeQuery].latitude},${RecentEarthquakes[NewEarthquakeQuery].longitude}&key=${process.env.GOOGLE_MAPS_API_TOKEN}_id=${process.env.GOOGLE_MAPS_ID}`, {caption: `⚠️  *GÜÇLÜ DEPREM UYARISI*  ⚠️\n${PublishTheLatestFirstEarthquake(RecentEarthquakes)}` , parse_mode: 'Markdown'}));
          }
  
          else if (RecentEarthquakes[i].magnitude >= 6.0 && RecentEarthquakes[i].magnitude <= 6.5) { 
              await (bot.telegram.sendMessage(process.env.TELEGRAM_ID, `⚠️️⚠️️  *YIKICI DEPREM UYARISI*  ⚠️️⚠️️\n${PublishTheLatestFirstEarthquake(RecentEarthquakes)} \n⚠️️⚠️️  *YIKICI DEPREM UYARISI*  ⚠️️⚠️️`, {disable_web_page_preview: true , disable_notification: false , parse_mode: 'Markdown'}));
              //await (bot.telegram.sendPhoto(process.env.TELEGRAM_ID, `https://maps.googleapis.com/maps/api/staticmap?language=tr&region=US&zoom=7&size=650x345&scale=2&markers=anchor:center|icon:https://www.teknovudu.com/medya/2023/03/60.png|${RecentEarthquakes[NewEarthquakeQuery].latitude},${RecentEarthquakes[NewEarthquakeQuery].longitude}&key=${process.env.GOOGLE_MAPS_API_TOKEN}_id=${process.env.GOOGLE_MAPS_ID}`, {caption: `⚠️️⚠️️  *YIKICI DEPREM UYARISI*  ⚠️️⚠️️\n${PublishTheLatestFirstEarthquake(RecentEarthquakes)}` , parse_mode: 'Markdown'}));
          }

          else if (RecentEarthquakes[i].magnitude >= 6.6 && RecentEarthquakes[i].magnitude <= 6.9) { 
              await (bot.telegram.sendMessage(process.env.TELEGRAM_ID, `⚠️️⚠️️  *YIKICI DEPREM UYARISI*  ⚠️️⚠️️\n${PublishTheLatestFirstEarthquake(RecentEarthquakes)} \n⚠️️⚠️️  *YIKICI DEPREM UYARISI*  ⚠️️⚠️️`, {disable_web_page_preview: true , disable_notification: false , parse_mode: 'Markdown'}));
              //await (bot.telegram.sendPhoto(process.env.TELEGRAM_ID, `https://maps.googleapis.com/maps/api/staticmap?language=tr&region=US&zoom=6&size=650x345&scale=2&markers=anchor:center|icon:https://www.teknovudu.com/medya/2023/03/60.png|${RecentEarthquakes[NewEarthquakeQuery].latitude},${RecentEarthquakes[NewEarthquakeQuery].longitude}&key=${process.env.GOOGLE_MAPS_API_TOKEN}_id=${process.env.GOOGLE_MAPS_ID}`, {caption: `⚠️️⚠️️  *YIKICI DEPREM UYARISI*  ⚠️️⚠️️\n${PublishTheLatestFirstEarthquake(RecentEarthquakes)}` , parse_mode: 'Markdown'}));
          }
  
          else if (RecentEarthquakes[i].magnitude >= 7.0) { 
              await (bot.telegram.sendMessage(process.env.TELEGRAM_ID, `⚠️⚠️⚠️ *AFET DEPREM UYARISI*  ⚠️⚠️⚠️\n${PublishTheLatestFirstEarthquake(RecentEarthquakes)} \n⚠️⚠️⚠️  *AFET DEPREM UYARISI*  ⚠️⚠️⚠️`, {disable_web_page_preview: true , disable_notification: false , parse_mode: 'Markdown'}));
              //await (bot.telegram.sendPhoto(process.env.TELEGRAM_ID, `https://maps.googleapis.com/maps/api/staticmap?language=tr&region=US&zoom=6&size=650x345&scale=2&markers=anchor:center|icon:https://www.teknovudu.com/medya/2023/03/64.png|${RecentEarthquakes[NewEarthquakeQuery].latitude},${RecentEarthquakes[NewEarthquakeQuery].longitude}&key=${process.env.GOOGLE_MAPS_API_TOKEN}_id=${process.env.GOOGLE_MAPS_ID}`, {caption: `⚠️⚠️⚠️ *AFET DEPREM UYARISI*  ⚠️⚠️⚠️\n${PublishTheLatestFirstEarthquake(RecentEarthquakes)}` , parse_mode: 'Markdown'}));
          }
        }
      }
          EarthquakeClock0thElement = RecentEarthquakes[0].hour; EarthquakeClock1thElement = RecentEarthquakes[1].hour; EarthquakeClock2thElement = RecentEarthquakes[2].hour; EarthquakeClock3thElement = RecentEarthquakes[3].hour;
          EarthquakeClock4thElement = RecentEarthquakes[4].hour; EarthquakeClock5thElement = RecentEarthquakes[5].hour; EarthquakeClock6thElement = RecentEarthquakes[6].hour; EarthquakeClock7thElement = RecentEarthquakes[7].hour;
      } }
    }
  });
  
  
function PublishTheLatestFirstEarthquake(RecentEarthquakes) { 
return `
📍 Konum: [${RecentEarthquakes[NewEarthquakeQuery].region}](https://maps.google.com/?q=${RecentEarthquakes[NewEarthquakeQuery].latitude},${RecentEarthquakes[NewEarthquakeQuery].longitude}&ll=${RecentEarthquakes[NewEarthquakeQuery].latitude},${RecentEarthquakes[NewEarthquakeQuery].longitude}&z=8)
🎯 Büyüklük: *${RecentEarthquakes[NewEarthquakeQuery].magnitude}*  〽️ Derinlik: *${RecentEarthquakes[NewEarthquakeQuery].depth} km*
🗓 Gün: *${RecentEarthquakes[NewEarthquakeQuery].day} ${RecentEarthquakes[NewEarthquakeQuery].month}*  🕗 Saat: *${RecentEarthquakes[NewEarthquakeQuery].hour}*
`}
  
  async function GetRecentEarthquakes() {
    let ListRecentEarthquakes = '', NumberOfEarthquakes = 0;
    for (let i = 27; i >= 0; i--) {
      if(RecentEarthquakes[i].magnitude >= 1 && NumberOfEarthquakes < 28){
        ListRecentEarthquakes += PublishRecentEarthquakes(RecentEarthquakes[i]);
        NumberOfEarthquakes = NumberOfEarthquakes + 1;
       }  
    }
    return ListRecentEarthquakes;

  }
  
  function PublishRecentEarthquakes(RecentEarthquakes) { 
  return `
  📍 Konum: [${RecentEarthquakes.region}](https://maps.google.com/?q=${RecentEarthquakes.latitude},${RecentEarthquakes.longitude}&ll=${RecentEarthquakes.latitude},${RecentEarthquakes.longitude}&z=8)
  🎯 Büyüklük: *${RecentEarthquakes.magnitude}*   〽️ Derinlik: *${RecentEarthquakes.depth} km*
  🗓 Gün: *${RecentEarthquakes.day} ${RecentEarthquakes.month}*   🕗 Saat: *${RecentEarthquakes.hour}*
  `}
  

async function GetLatestEarthquakesbyLocation() {

  let ListRecentEarthquakesbyLocation = '', NumberOfEarthquakes = 0;
  RecentEarthquakes.sort(function(a, b){return a.distance - b.distance});
 
  for (let i = 27; i >= 0; i--) {
    if(RecentEarthquakes[i].magnitude >= 1 && NumberOfEarthquakes < 28){
     ListRecentEarthquakesbyLocation += PublishRecentEarthquakesbyLocation(RecentEarthquakes[i]);
     NumberOfEarthquakes = NumberOfEarthquakes + 1;
    }  
   }
  return ListRecentEarthquakesbyLocation;
 }
 
 function PublishRecentEarthquakesbyLocation(RecentEarthquakes) { 
 return `
 📍 Konum: [${RecentEarthquakes.region}](https://maps.google.com/?q=${RecentEarthquakes.latitude},${RecentEarthquakes.longitude}&ll=${RecentEarthquakes.latitude},${RecentEarthquakes.longitude}&z=8)
 🎯 Büyüklük: *${RecentEarthquakes.magnitude}*  〽️ Derinlik: *${RecentEarthquakes.depth} km*
 🗓 Gün: *${RecentEarthquakes.day} ${RecentEarthquakes.month}*  🕗 Saat: *${RecentEarthquakes.hour}*
 🌍 Konumunuza uzaklık: *${RecentEarthquakes.distance} km*
 `}


async function GetLatestMajorEarthquakes() { 
  let ListRecentMajorEarthquakes = '', NumberOfEarthquakes = 0;


  for (let i = 500; i >= 0; i--) {
    if(RecentEarthquakes[i].magnitude >= EarthquakeMagnitude_1 && RecentEarthquakes[i].magnitude < EarthquakeMagnitude_2 && NumberOfEarthquakes < 28){
    ListRecentMajorEarthquakes += PublishLastMajorEarthquakes(RecentEarthquakes[i]);
    NumberOfEarthquakes = NumberOfEarthquakes + 1;
    }}
  
  return ListRecentMajorEarthquakes;
}

function PublishLastMajorEarthquakes(RecentEarthquakes) { 
if(RecentEarthquakes.magnitude >= EarthquakeMagnitude_1 && RecentEarthquakes.magnitude < EarthquakeMagnitude_2){
return `
📍 Konum: [${RecentEarthquakes.region}](https://maps.google.com/?q=${RecentEarthquakes.latitude},${RecentEarthquakes.longitude}&ll=${RecentEarthquakes.latitude},${RecentEarthquakes.longitude}&z=8)
🎯 Büyüklük: *${RecentEarthquakes.magnitude}*  〽️ Derinlik: *${RecentEarthquakes.depth} km*
🗓 Gün: *${RecentEarthquakes.day} ${RecentEarthquakes.month}*  🕗 Saat: *${RecentEarthquakes.hour}*
`
}
else {
   return ''
 }}


async function GetRecentMajorEarthquakesbyLocation() { 

  let ListRecentMajorEarthquakesinLocation = ''; let NumberOfEarthquakes = 0;
  RecentEarthquakes.sort(function(a, b){return a.distance - b.distance});

  for (let i = 500; i >= 0; i--) {
  if(RecentEarthquakes[i].magnitude >= EarthquakeMagnitude_1 && RecentEarthquakes[i].magnitude < EarthquakeMagnitude_2 && NumberOfEarthquakes < 28){
  ListRecentMajorEarthquakesinLocation += PublishRecentMajorEarthquakesatLocation(RecentEarthquakes[i]);
  NumberOfEarthquakes = NumberOfEarthquakes + 1;
  }
 }
  return ListRecentMajorEarthquakesinLocation;
}

function PublishRecentMajorEarthquakesatLocation(RecentEarthquakes) { 
if(RecentEarthquakes.magnitude >= EarthquakeMagnitude_1 && RecentEarthquakes.magnitude < EarthquakeMagnitude_2){
return `
📍 Konum: [${RecentEarthquakes.region}](https://maps.google.com/?q=${RecentEarthquakes.latitude},${RecentEarthquakes.longitude}&ll=${RecentEarthquakes.latitude},${RecentEarthquakes.longitude}&z=8)
🎯 Büyüklük: *${RecentEarthquakes.magnitude}*  〽️ Derinlik: *${RecentEarthquakes.depth} km*
🗓 Gün: *${RecentEarthquakes.day} ${RecentEarthquakes.month}*  🕗 Saat: *${RecentEarthquakes.hour}*
🌍 Konumunuza uzaklık: *${RecentEarthquakes.distance} km*
`
}
else {
   return ''
 }}



async function startBot() { 

bot.use(throttler);

bot.start(async (ctx) => { bot.telegram.sendMessage(ctx.chat.id,`Selamün Aleyküm *${ctx.from.first_name}* 😊 hoş geldin
\nKandilli Rasathanesi tarafından yayınlanan verileri kullanılan *SON DEPREMLER BOTU* aracılığı ile anlık gelişen depremleri listeleyebilir veya konumunuza yakın depremleri görüntüleyebilirsiniz.
\n4.0'dan büyük depremleri takip etmek için [SON DEPREMLER](https://t.me/sondepremlerkandilli) kanalına katılabilir siniz.
\nBot komutlarına sol alttaki *☰ Menü* bölümünden ulaşabilir, en son gelişen deprem bilgilerini çağırabilirsiniz.`, {disable_web_page_preview: true , parse_mode: 'Markdown'})
if (ctx.chat.id != 1705065791) bot.telegram.sendMessage(process.env.TELEGRAM_IDM,`🆔 ${ctx.chat.id}\n👤 @${ctx.chat.username || '-'}\n😊 ${ctx.from.first_name || '-'} ${ctx.from.last_name || '-'}\n💬 ${ctx.message.text || '-'}`);
})


bot.command('sondepremler', async ctx => {
  bot.telegram.sendMessage(process.env.TELEGRAM_IDM,`🆔 ${ctx.chat.id}\n👤 @${ctx.chat.username || '-'}\n😊 ${ctx.from.first_name || '-'} ${ctx.from.last_name || '-'}\n💬 ${ctx.message.text || '-'}`);
  await setRecentEarthquakes();

  if (ErrorSwitchRecentEarthquake == 0){
    bot.telegram.sendMessage(ctx.chat.id, await GetRecentEarthquakes(), {disable_web_page_preview: true , parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
  }

  else if (ErrorSwitchRecentEarthquake == 1){
    bot.telegram.sendMessage(ctx.chat.id, '*Kandilli Rasathanesi sitesine ulaşılamadığı için yanıt verilememektedir.*', {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
  }

});


bot.command('son3ile4', async ctx => {
  bot.telegram.sendMessage(process.env.TELEGRAM_IDM,`🆔 ${ctx.chat.id}\n👤 @${ctx.chat.username || '-'}\n😊 ${ctx.from.first_name || '-'} ${ctx.from.last_name || '-'}\n💬 ${ctx.message.text || '-'}`);
  EarthquakeMagnitude_1 = 3; EarthquakeMagnitude_2 = 4;
  await setRecentEarthquakes();

  if (ErrorSwitchRecentEarthquake == 1){
    bot.telegram.sendMessage(ctx.chat.id, '*Kandilli Rasathanesi sitesine ulaşılamadığı için yanıt verilememektedir.*', {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
  }

  else if (await GetLatestMajorEarthquakes() == '' ){
    bot.telegram.sendMessage(ctx.chat.id, '*Son zamanlarda bu büyüklükte bir deprem gerçekleşmedi!*', {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
  }

  else {
    bot.telegram.sendMessage(ctx.chat.id, await GetLatestMajorEarthquakes(), {disable_web_page_preview: true , parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
}})


bot.command('son4ile5', async ctx => {
  bot.telegram.sendMessage(process.env.TELEGRAM_IDM,`🆔 ${ctx.chat.id}\n👤 @${ctx.chat.username || '-'}\n😊 ${ctx.from.first_name || '-'} ${ctx.from.last_name || '-'}\n💬 ${ctx.message.text || '-'}`);
  EarthquakeMagnitude_1 = 4; EarthquakeMagnitude_2 = 5;
  await setRecentEarthquakes();

  if (ErrorSwitchRecentEarthquake == 1){
    bot.telegram.sendMessage(ctx.chat.id, '*Kandilli Rasathanesi sitesine ulaşılamadığı için yanıt verilememektedir.*', {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
  }

  else if (await GetLatestMajorEarthquakes() == '' ){
    bot.telegram.sendMessage(ctx.chat.id, '*Son zamanlarda bu büyüklükte bir deprem gerçekleşmedi!*', {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
  }

  else {
    bot.telegram.sendMessage(ctx.chat.id, await GetLatestMajorEarthquakes(), {disable_web_page_preview: true , parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
}})


bot.command('son5ile6', async ctx => {
  bot.telegram.sendMessage(process.env.TELEGRAM_IDM,`🆔 ${ctx.chat.id}\n👤 @${ctx.chat.username || '-'}\n😊 ${ctx.from.first_name || '-'} ${ctx.from.last_name || '-'}\n💬 ${ctx.message.text || '-'}`);
  EarthquakeMagnitude_1 = 5; EarthquakeMagnitude_2 = 6;
  await setRecentEarthquakes();

  if (ErrorSwitchRecentEarthquake == 1){
    bot.telegram.sendMessage(ctx.chat.id, '*Kandilli Rasathanesi sitesine ulaşılamadığı için yanıt verilememektedir.*', {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
  }
  
  else if (await GetLatestMajorEarthquakes() == '' ){
    bot.telegram.sendMessage(ctx.chat.id, '*Son zamanlarda bu büyüklükte bir deprem gerçekleşmedi!*', {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
  }

  else {
    bot.telegram.sendMessage(ctx.chat.id, await GetLatestMajorEarthquakes(), {disable_web_page_preview: true , parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
}})

bot.command('son6uzeri', async ctx => {
  bot.telegram.sendMessage(process.env.TELEGRAM_IDM,`🆔 ${ctx.chat.id}\n👤 @${ctx.chat.username || '-'}\n😊 ${ctx.from.first_name || '-'} ${ctx.from.last_name || '-'}\n💬 ${ctx.message.text || '-'}`);
  EarthquakeMagnitude_1 = 6; EarthquakeMagnitude_2 = 20;
  await setRecentEarthquakes();

  if (ErrorSwitchRecentEarthquake == 1){
    bot.telegram.sendMessage(ctx.chat.id, '*Kandilli Rasathanesi sitesine ulaşılamadığı için yanıt verilememektedir.*', {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
  }

  else if (await GetLatestMajorEarthquakes() == '' ){
    bot.telegram.sendMessage(ctx.chat.id, '*Son zamanlarda bu büyüklükte bir deprem gerçekleşmedi!*', {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
  }

  else {
    bot.telegram.sendMessage(ctx.chat.id, await GetLatestMajorEarthquakes(), {disable_web_page_preview: true , parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
}})


bot.command('konumdeprem', (ctx) => {
  bot.telegram.sendMessage(process.env.TELEGRAM_IDM,`🆔 ${ctx.chat.id}\n👤 @${ctx.chat.username || '-'}\n😊 ${ctx.from.first_name || '-'} ${ctx.from.last_name || '-'}\n💬 ${ctx.message.text || '-'}`);
  bot.telegram.sendMessage(ctx.chat.id,  "*Lütfen altta bulunan 📎 ataç ikonundan mevcut konumunuzu paylaşın.*", {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
  
  bot.on('location', async (ctx) => {
    latitude = ctx.message.location.latitude; longitude = ctx.message.location.longitude;
  
    ctx.reply('Konumunuza yakın hangi deprem bilgisini istiyorsunuz?',
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
        ctx.deleteMessage().then(function(resp) {}).catch(function(err) {});
        await setRecentEarthquakes();

        if (ErrorSwitchRecentEarthquake == 0){
          await (bot.telegram.sendMessage(ctx.chat.id, await GetLatestEarthquakesbyLocation(RecentEarthquakes), {disable_web_page_preview: true , parse_mode: 'Markdown'})).then(function(resp) {}).catch(function(err) {});  
        }
      
        else if (ErrorSwitchRecentEarthquake == 1){
          bot.telegram.sendMessage(ctx.chat.id, '*Kandilli Rasathanesi sitesine ulaşılamadığı için yanıt verilememektedir.*', {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
        }
    
      })
      
      bot.action('3-4', async (ctx) =>{
        ctx.deleteMessage().then(function(resp) {}).catch(function(err) {});
        EarthquakeMagnitude_1 = 3; EarthquakeMagnitude_2 = 4;
        await setRecentEarthquakes();

      if (ErrorSwitchRecentEarthquake == 1){
        bot.telegram.sendMessage(ctx.chat.id, '*Kandilli Rasathanesi sitesine ulaşılamadığı için yanıt verilememektedir.*', {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
      }
    
      else if (await GetRecentMajorEarthquakesbyLocation() == '' ){
        bot.telegram.sendMessage(ctx.chat.id, '*Son zamanlarda bu büyüklükte bir deprem gerçekleşmedi!*', {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
      }
    
      else {
        bot.telegram.sendMessage(ctx.chat.id, await GetRecentMajorEarthquakesbyLocation(), {disable_web_page_preview: true , parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
      }
      })
      
      bot.action('4-5', async (ctx) =>{
        ctx.deleteMessage().then(function(resp) {}).catch(function(err) {});
        EarthquakeMagnitude_1 = 4; EarthquakeMagnitude_2 = 5;
        await setRecentEarthquakes();

        if (ErrorSwitchRecentEarthquake == 1){
          bot.telegram.sendMessage(ctx.chat.id, '*Kandilli Rasathanesi sitesine ulaşılamadığı için yanıt verilememektedir.*', {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
        }
    
        else if(await GetRecentMajorEarthquakesbyLocation() == '' ){
          bot.telegram.sendMessage(ctx.chat.id, '*Son zamanlarda bu büyüklükte bir deprem gerçekleşmedi!*', {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
        }
      
        else{
          bot.telegram.sendMessage(ctx.chat.id, await GetRecentMajorEarthquakesbyLocation(), {disable_web_page_preview: true , parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
        }
      })

      bot.action('5-6', async (ctx) =>{
        ctx.deleteMessage().then(function(resp) {}).catch(function(err) {});
        EarthquakeMagnitude_1 = 5; EarthquakeMagnitude_2 = 6;
        await setRecentEarthquakes();

        if (ErrorSwitchRecentEarthquake == 1){
          bot.telegram.sendMessage(ctx.chat.id, '*Kandilli Rasathanesi sitesine ulaşılamadığı için yanıt verilememektedir.*', {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
        }
    
        else if (await GetRecentMajorEarthquakesbyLocation() == '' ){
          bot.telegram.sendMessage(ctx.chat.id, '*Son zamanlarda bu büyüklükte bir deprem gerçekleşmedi!*', {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
        }
      
        else {
          bot.telegram.sendMessage(ctx.chat.id, await GetRecentMajorEarthquakesbyLocation(), {disable_web_page_preview: true , parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
        }
      })


      bot.action('6+', async (ctx) =>{
        ctx.deleteMessage().then(function(resp) {}).catch(function(err) {});
        EarthquakeMagnitude_1 = 6; EarthquakeMagnitude_2 = 20;
        await setRecentEarthquakes();

        if (ErrorSwitchRecentEarthquake == 1){
          bot.telegram.sendMessage(ctx.chat.id, '*Kandilli Rasathanesi sitesine ulaşılamadığı için yanıt verilememektedir.*', {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
        }
    
        else if (await GetRecentMajorEarthquakesbyLocation() == '' ){
          bot.telegram.sendMessage(ctx.chat.id, '*Son zamanlarda bu büyüklükte bir deprem gerçekleşmedi!*', {parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
        }
      
        else {
          bot.telegram.sendMessage(ctx.chat.id, await GetRecentMajorEarthquakesbyLocation(), {disable_web_page_preview: true , parse_mode: 'Markdown'}).then(function(resp) {}).catch(function(err) {});
        }
      })
    
    })
  });


bot.command('hakkinda', async (ctx) => {
bot.telegram.sendMessage(ctx.chat.id,`Proje açık kaynak olarak [GitHub](https://github.com/ahmethkablama/turkey-recent-earthquakes-bot) üzerinden geliştirilmektedir. Siz de projeye katılarak geliştirilmesine yardımcı olabilirsiniz.
    
Yazılım ile ilgili sorun, öneri ve görüşlerinizi @ahmethkablama 'ya iletebilirsiniz. 

[LinkedIn](https://www.linkedin.com/in/ahmethkablama/) | [Instagram](https://www.instagram.com/ahmethkablama/) | [Web](http://ahmethkablama.com/)`, {parse_mode: 'Markdown' , disable_web_page_preview: true});
bot.telegram.sendMessage(process.env.TELEGRAM_IDM,`🆔 ${ctx.chat.id}\n👤 @${ctx.chat.username || '-'}\n😊 ${ctx.from.first_name || '-'} ${ctx.from.last_name || '-'}\n💬 ${ctx.message.text || '-'}`);
//bot.telegram.sendMessage(process.env.TELEGRAM_IDM,`Tarih: ${dayjs().format('🕗 HH:mm:ss 🗓️ DD MMMM')}\nSohbet/Mesaj: ${ctx.chat.id} / ${ctx.message.chat.id}\nKullanıcı: @${ctx.chat.username || 'kullanı adı yok'}\nAd Soyad: ${ctx.from.first_name} ${ctx.from.last_name}\nMesaj: ${ctx.message.text || 'yazı yok'}`);
});

bot.launch();

}

async function runBot() {
await setRecentEarthquakes();
await setEarlyEarthquake();
await startBot();

if(ErrorSwitchRecentEarthquake == 0){
EarthquakeClock0thElement = RecentEarthquakes[0].hour; 
EarthquakeClock1thElement = RecentEarthquakes[1].hour;
EarthquakeClock2thElement = RecentEarthquakes[2].hour;
EarthquakeClock3thElement = RecentEarthquakes[3].hour;
EarthquakeClock4thElement = RecentEarthquakes[4].hour;
EarthquakeClock5thElement = RecentEarthquakes[5].hour;
EarthquakeClock6thElement = RecentEarthquakes[6].hour;
EarthquakeClock7thElement = RecentEarthquakes[7].hour;
}

if(ErrorSwitchEarlyEarthquake == 0){
EarlyEarthquakePost = EarlyEarthquake[0].time;
}

getEarlyEarthquakeJob.start();
getEarthquakeNotificationJob.start();
}
runBot();

