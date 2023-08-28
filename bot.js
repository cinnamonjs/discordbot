import { ApplicationCommandOptionType, Client } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import dotenv from 'dotenv'
import {
    AddStock,
    SellSelfStocks,
    ResetStocks,
    CreateNewStocks,
    ChangeEveryHourStocks,
} from './modules/StockFunction.js';

import {
    CreateNewId,
    AddCoin,
    CheckCoin,
    RemoveCoin,
} from './modules/PlayerFunction.js';

import {
    display,
    displaymsg,
    command,
    StockDisplay,
} from './modules/MessageFunction.js';
import * as files from "fs"

const client = new Client({
    intents: 36355
});

dotenv.config()

const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);
var TimeMinutes = 60;
// Create Stocks
var StockArray = JSON.parse(files.readFileSync('./modules/Stock.json'));
var data = [];

function Readfiles() {
    // read-file
    var rawdata = files.readFileSync('Players.json', 'utf8');
    data = JSON.parse(rawdata);
}

function Writefile(path, data) {
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
                Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
                { body: commands },
            );
            console.log(`Commands registered for ${guild.name}: ${guildId}`);
        } catch (error) {
            console.error(`Error registering commands for ${guild.name}: ${guildId}:`, error);
        }
    });
    Readfiles();
    console.log('storage file is up to date')
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
    console.log(StockArray)
    TimeMinutes = 60;
    Reminders(TimeMinutes);
}, 60 * 60 * 1000);

// Reminders time function
async function Reminders(time) {
    for (let i = time; i > 0; i--) {
        client.user.setActivity(`${i} mins before changed`);
        await new Promise(resolve => setTimeout(resolve, 60 * 1000));
    }
}

//login
client.login(process.env.CLIENT_TOKEN);

// Define your slash command
const commands = [
    {
        name: 'stock',
        description: 'See stock board',
    },
    {
        name: 'me',
        description: 'show information about yourself',
    },
    {
        name: 'buy',
        description: 'buy stock / ซื้อหุ้น',
        options: [
            {
                name: 'stock_id',
                description: 'stock id / รหัสหุ่น "btc" "rtx" "crn" etc.',
                type: 3,
                required: true,
            },
            {
                name: 'buy_amount',
                description: 'how much / เท่าไหร่   1000 100 10',
                type: 10,
                required: true,
            },
        ],
    },
    {
        name: 'sell',
        description: 'sell stock / ขายหุ้น',
        options: [
            {
                name: 'stock_id',
                description: 'stock id / รหัสหุ่น "btc" "rtx" "crn" etc.',
                type: 3,
                required: true,
            },
            {
                name: 'sell_amount',
                description: 'how much / เท่าไหร่ 1000 100 10',
                type: 10,
                required: true,
            },
        ],
    },
];

//check id is in json list
function FindId(id) {
    Readfiles()
    var p = data.Players.find(player => player.id == id)
    if (p == undefined) return false
    else return true
}

// find index of json list
function Findindex(id) {
    Readfiles()
    return data.Players.findIndex(player => player.id == id)
}

client.on('message', (message) => {
    var commands = message.content.toLocaleLowerCase().split(" ");
    if (commands[0] === '!change') {
        ChangeEveryHourStocks(data, StockArray)
        Writefile('Players.json', data)
        console.log(StockArray)
    }
});

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
                        if (Addsuccess) success = RemoveCoin(data, userId, stockValue)
                        if (Addsuccess) await interaction.reply({ embeds: [displaymsg('ซื้อหุ้น 💵', 'ซื้อหุ้น ' + stockId + " ที่ราคา " + StockArray.find((stock) => stock.id === stockId).value + " จำนวน " + stockValue + ' สำเร็จ', user, client)] })
                        Writefile('Players.json', data);
                    }
                    else {
                        var success = CreateNewStocks(stockId, data, userId, StockArray.find((stock) => stock.id === stockId).value, stockValue, 24);
                        if (success) success = RemoveCoin(data, userId, stockValue)
                        if (success) await interaction.reply({ embeds: [displaymsg('ซื้อหุ้น 💵', 'ซื้อหุ้น ' + stockId + " ที่ราคา " + StockArray.find((stock) => stock.id === stockId).value + " จำนวน " + stockValue + ' สำเร็จ', user, client)] })
                        Writefile('Players.json', data);
                    }
                }
            }
        }
        if (commandName === 'sell') {
            const stockId = options.getString('stock_id').toLocaleLowerCase();
            const sellValue = options.getNumber('sell_amount');
            console.log(sellValue)
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
    }
    catch (error) {
        console.error('Error:', error);
    }
})
