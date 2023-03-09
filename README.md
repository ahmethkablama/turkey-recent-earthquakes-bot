<p align="center">
  <a href="https://github.com/ahmethkablama/turkey-recent-earthquakes-bot/blob/main/README.tr.md">Turkish</a> |
  <a href="https://github.com/ahmethkablama/turkey-recent-earthquakes-bot/blob/main/README.md">English</a>
</p>

# Recent Earthquakes in Turkey Bot

You can call the latest earthquakes with the data received from the Kandilli Observatory And Earthquake Research Institute (KOERI), list them according to the magnitude or location of the earthquakes, and automatically send the most recent earthquake to the specified people and groups.

SON DEPREMLER BOT      | SON DEPREMLER CHANNEL
----------------------- | ----------------------------------------    
[![@SonDeprem_bot](https://img.shields.io/badge/%F0%9F%92%AC%20Telegram-%40sondeprem__bot-red)](https://telegram.me/SonDeprem_bot)                | [![@sondepremlerkandilli](https://img.shields.io/badge/%F0%9F%93%A2%20Telegram-%40sondepremlerkandilli-red)](https://t.me/sondepremlerkandilli)


## Bot Commands
Command                 | Explanation
----------------------- | ----------------------------------------    
`/start`                | Starts the bot
`/sondepremler`         | The latest earthquakes
`/son3ile4`              | 3 to 4 earthquakes
`/son4ile5`             | 4 to 5 earthquakes
`/son5ile6`             | 5 to 6 earthquakes
`/son6uzeri`            | 6 or more earthquakes
`/konumdeprem`          | Earthquakes by location
`/iletisim`             | Developer communication


## Preparation
1. Create bot and get API TOKEN via official Telegram bot [@BotFather](https://telegram.me/BotFather)
2. If you are going to run the bot on yourself:
   * Send your own message to the bot [@userinfobot](https://telegram.me/userinfobot) and get your ID
   * Go to the bot you created and launch it
3. If you run the Bot on a group:
   * Send a message with the group name to the bot [@userinfobot](https://telegram.me/userinfobot) and get the ID
   * Add the bot to your group and give it admin


## Local Operation

1. Clone or download and unzip the repo `https://github.com/ahmethkablama/turkey-recent-earthquakes-bot`
* You can use the following command for cloning
```bash
git clone https://github.com/ahmethkablama/turkey-recent-earthquakes-bot
```
2. install `npm` from terminal
```bash
npm install
```
3. Create `.env` file based on `.env.example` file
4. Fill in the `YOUR_API_TOKEN` and `YOUR_ID` sections in the `.env` file according to you
5. install `npm` from terminal
6. Run it with the command `npm run start` or `node bot.js`

## Running on Server (Cpanel)

1. Download the repo `https://github.com/ahmethkablama/turkey-recent-earthquakes-bot`
2. Create an empty folder with your bot's name in your server's home directory
3. Upload bot files to the folder you created
4. Create `.env` file based on `.env-example` file
5. Fill in the `YOUR_API_TOKEN` and `YOUR_ID` sections in the `.env` file according to your own
6. From your server panel (described as Cpanel) go to the `Setup Node.js App` tab
7. Go to the step of creating a new application by clicking the `CREATE APPLICATION` button
8. Select the appropriate Node.js version and mode. Type your bot's path and startup file (designated as `bot.js`)
9. Install NPM with `Run NPM Install` command and run your bot with `Run JS script` command


## Libraries Used

* [Nodejs](https://nodejs.org/en/)
* [Telegraf Package](https://www.npmjs.com/package/telegraf)
* [Axios Package](https://www.npmjs.com/package/axios)
* [Cheerio Package](https://www.npmjs.com/package/cheerio)
* [Cron Package](https://www.npmjs.com/package/cron)

## To Do List
- [ ] Premise Earthquake Information System to be Added.
- [ ] Errors caused by excessive message requests will be fixed.
- [ ] The problem of sending a message as a result of the user blocking the bot will be fixed.
- [ ] The problem that occurs when sending "Get" request from the site with server problem will be fixed.
- [ ] A working version will be written on the database.