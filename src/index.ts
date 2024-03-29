import { ApplicationCommandOptionType, Client, ComponentType, InteractionCollector } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import dotenv from 'dotenv'
import { UserData, StockData, ChartDisplay } from './type.js'
import { commands } from './modules/Command.js';
import {
    AddStock,
    SellSelfStocks,
    CreateNewStocks,
    ChangeEveryHourStocks,
} from './modules/StockFunction.js';

import {
    CreateNewId,
    CheckCoin,
    RemoveCoin,
    AddCoin,
} from './modules/PlayerFunction.js';

import {
    display,
    displaymsg,
    StockDetailDisplay,
    StockDisplay,
    GamblingDisplay,
} from './modules/MessageFunction.js';

import { GamblingProfiles } from './modules/GamblingFunction.js';
import * as files from "fs"

const client = new Client({
    intents: 36355
});

dotenv.config()

const token: string = process.env.CLIENT_TOKEN
const rest = new REST({ version: '10' }).setToken(token);
var TimeMinutes = 60;
// Create Stocks
var StockArray: StockData[] = JSON.parse(files.readFileSync('./modules/Stock.json', 'utf8'));
var data: UserData = Readfiles()

function Readfiles(): UserData {
    // read-file
    try {
        var rawdata = files.readFileSync('Players.json', 'utf8');
        return JSON.parse(rawdata);
    }
    catch (err) {
        return { Players: [], Stocks: [], Gambles: null };
    }
}

function Writefile(path: string, data: any) {
    files.writeFileSync(path, JSON.stringify(data));
}

//once started
client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
    // Get the first guild the bot joins
    const guilds = client.guilds.cache;
    // Register commands for each guild
    guilds.forEach(async (guild) => {
        const guildId = guild.id;

        try {
            console.log(`Registering commands for ${guild.name}: ${guildId}`);
            await rest.put(
                Routes.applicationGuildCommands(`${client.user.id}`, `${guildId}`),
                { body: commands },
            );
            console.log(`Commands registered for ${guild.name}: ${guildId}`);
        } catch (error) {
            console.error(`Error registering commands for ${guild.name}: ${guildId}:`, error);
        }
    });
    Reminders(TimeMinutes);
    console.log('Timer started');
});

//client do function when join new server
client.on('guildCreate', async (guild) => {
    const guildId = guild.id;
    console.log(`Bot joined a new guild! Guild ID: ${guild.id}`);
    try {
        console.log(`Registering commands for ${guild.name}: ${guildId}`);
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
            { body: commands },
        );
        console.log(`Commands registered for ${guild.name}: ${guildId}`);
    } catch (error) {
        console.error(`Error registering commands for ${guild.name}: ${guildId}:`, error);
    }
});

// changed stock function
setInterval(() => {
    ChangeEveryHourStocks(data, StockArray);
    Writefile('Players.json', data)
    Reminders(TimeMinutes);
}, 60 * 60 * 1000);

// Reminders time function
async function Reminders(time: number) {
    for (let i = time; i > 0; i--) {
        client.user.setActivity(`${i} mins reminding.`);
        await new Promise(resolve => setTimeout(resolve, 60 * 1000));
    }
}

//login
client.login(token);

//check id is in json list
function FindId(id: string) {
    var p = data.Players.find(player => player.id == id)
    if (p == undefined) return false
    else return true
}

client.on('interactionCreate', async (interaction) => {
    try {
        if (!interaction.isChatInputCommand()) {
            console.log('Received uncommand');
            return;
        }
        const { commandName, options, user, guild } = interaction;
        const userId = user.id;
        const userName = user.username;
        console.log(`Received interaction for command: ${commandName}`);
        console.log(`Interaction user: ${user.tag}`);
        console.log(`Interaction guild: ${guild.name} (ID: ${guild.id})`);


        if (commandName === 'stock') {
            const embed = StockDisplay(StockArray, client);
            await interaction.reply({ embeds: [embed] });
        }

        if (commandName === 'me') {
            if (!FindId(userId)) CreateNewId(data, userId, userName), Writefile('Players.json', data);
            const embed = display(data, user, client);
            await interaction.reply({ embeds: [embed] });
        }
        if (commandName === 'buy') {
            const stockId = options.getString('stock_id').toLocaleLowerCase();
            const stockValue = options.getNumber('buy_amount');
            if (!FindId(userId)) CreateNewId(data, userId, userName), Writefile('Players.json', data);
            if (!CheckCoin(data, userId, stockValue)) await interaction.reply({ embeds: [displaymsg('ซื้อหุ้น 💵', 'เงินไม่พอที่จะซื้อหุ้นจำนวน ' + stockValue, user, client)] })
            else {
                if (StockArray.find((stock) => stock.id === stockId) === undefined) await interaction.reply({ embeds: [displaymsg('ซื้อหุ้น 💵', 'ไม่พบหุ้นที่ต้องการ', user, client)] })
                else {
                    if (data.Stocks.find((stock) => stock.id === stockId && stock.userid === userId) !== undefined) {
                        var Addsuccess = AddStock(stockId, data, userId, StockArray.find((stock) => stock.id === stockId).value, stockValue, 24);
                        if (Addsuccess)
                            success = RemoveCoin(data, userId, stockValue),
                                await interaction.reply({ embeds: [displaymsg('ซื้อหุ้น 💵', 'ซื้อหุ้น ' + stockId + " ที่ราคา " + StockArray.find((stock) => stock.id === stockId).value + " จำนวน " + stockValue + ' สำเร็จ', user, client)] })
                        Writefile('Players.json', data);
                    }
                    else {
                        var success = CreateNewStocks(stockId, data, userId, StockArray.find((stock) => stock.id === stockId).value, stockValue, 24);
                        if (success)
                            success = RemoveCoin(data, userId, stockValue),
                                await interaction.reply({ embeds: [displaymsg('ซื้อหุ้น 💵', 'ซื้อหุ้น ' + stockId + " ที่ราคา " + StockArray.find((stock) => stock.id === stockId).value + " จำนวน " + stockValue + ' สำเร็จ', user, client)] })
                        Writefile('Players.json', data);
                    }
                }
            }
        }
        if (commandName === 'sell') {
            const stockId = options.getString('stock_id').toLocaleLowerCase();
            var sellValue = options.getNumber('sell_amount');
            const OwnerStock = data.Stocks.find((stock) => stock.userid === userId && stock.id === stockId);
            //function partition
            if (!FindId(userId)) CreateNewId(data, userId, userName), Writefile('Players.json', data);
            if (sellValue === undefined) sellValue = OwnerStock.value;
            if (StockArray.find((stock) => stock.id === stockId) === undefined) await interaction.reply({ embeds: [displaymsg('ขายหุ้น 💸', 'ไม่พบหุ้นที่ต้องการ 💸', user, client)] })
            else {
                if (OwnerStock === undefined) await interaction.reply({ embeds: [displaymsg('ขายหุ้น 💸', 'ไม่พบรายการการขายที่ต้องการ', user, client)] })
                else {
                    if (OwnerStock.value >= sellValue) {
                        var success = SellSelfStocks(stockId, data, userId, StockArray.find((stock) => stock.id === stockId).value, sellValue);
                        if (success) await interaction.reply({ embeds: [displaymsg('ขายหุ้น 💸', 'ขายหุ้น ' + stockId + " ที่ราคา " + StockArray.find((stock) => stock.id === stockId).value + " จำนวน " + sellValue + ' สำเร็จ', user, client)] })
                        Writefile('Players.json', data);
                    } else {
                        await interaction.reply({ embeds: [displaymsg('ขายหุ้น 💸', 'จำนวนที่ระบุไม่ถูกต้อง', user, client)] })
                    }
                }
            }
        }
        if (commandName === "test") {
            ChangeEveryHourStocks(data, StockArray)
            Reminders(TimeMinutes)
            Writefile('Players.json', data)
            await interaction.reply('ok!')
        }
        if (commandName === "graph") {
            const displays: ChartDisplay = await StockDetailDisplay(client)
            await interaction.reply({ embeds: [displays.display], files: [displays.image] })
        }
        if (commandName === "give") {
            const usergive = user;
            const userget = options.getUser('user');
            const amount = options.getNumber('give_amount');
            if (!FindId(usergive.id)) CreateNewId(data, usergive.id, usergive.username), Writefile('Players.json', data);
            if (!FindId(userget.id)) CreateNewId(data, userget.id, userget.username), Writefile('Players.json', data);
            if (!CheckCoin(data, usergive.id, amount)) await interaction.reply({ embeds: [displaymsg('โอนเงิน 💵', 'เงินไม่พอที่จะซื้อหุ้นจำนวน ' + amount, user, client)] })
            else {
                success = RemoveCoin(data, usergive.id, amount)
                const moneyleft = data.Players.find(players => players.id === usergive.id).Coin;
                if (success) {
                    AddCoin(data, userget.id, amount)
                    Writefile('Players.json', data);
                    await interaction.reply({ embeds: [displaymsg('โอนเงิน 💵', `โอนเงินจำนวน ${amount} \n ให้กับ ${userget.username} \n เงินคงเหลือ ${moneyleft}`, user, client)] })
                }
                else {
                    await interaction.reply({ embeds: [displaymsg('โอนเงิน 💵', `การโอนเงินผิดพลาด ลองใหม่อีกครั้ง`, user, client)] })
                }
            }
        }
        if (commandName === "gambling") {
            const usertype = options.getString('type');
            if (usertype === 'dice' || data.Gambles === null) {
                var Result = GamblingProfiles()
                const offset = '🌠';
                var SecretResult = [];
                var PositionReveal = Math.floor(Math.random() * Result.result.length);
                for (let i = 0; i < Result.result.length; i++) {
                    if (PositionReveal === i) SecretResult.push(Result.result[i]);
                    else SecretResult.push(offset);
                }
                data.Gambles = {
                    result: Result.result,
                    total: Result.total,
                    bet: null,
                };
                await interaction.reply({embeds: [GamblingDisplay(SecretResult , client)]});
                Writefile('./Players.json', data)
                setTimeout(function () {
                    interaction.deleteReply();
                    data.Gambles = null;
                }, 2 * 60 * 1000);
            }
            else await interaction.reply({ embeds: [displaymsg('เปิดพนัน 💵', `มีการพนันเปิดไว้อยู่แล้ว`, user, client)] })
        }
        if (commandName === "bet") {
            const type = options.getString('type');
            const bet_amount = options.getNumber('bet_amount');
            const for_custom_number_type = options.getNumber('for_custom_number_type');
            if (!CheckCoin(data, userId, bet_amount)) await interaction.reply({ embeds: [displaymsg('โอนเงิน 💵', 'เงินไม่พอที่จะซื้อหุ้นจำนวน ' + bet_amount, user, client)] })
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
})
