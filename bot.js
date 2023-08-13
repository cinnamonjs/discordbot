import { Client } from 'discord.js';
import dotenv from 'dotenv'
import { ChangeStocked, 
        CheckTimerStock,
        SellStock,
        ResetStocks,
        CreateNewStocks,
        ChangeEveryHourStocks,
    } from './modules/StockFunction.js';

import { CreateNewId,
        AddCoin,
        CheckCoin,
        RemoveCoin,
    } from './modules/PlayerFunction.js';

import { display,
        displaymsg,
        command,
        StockDisplay,
     } from './modules/MessageFunction.js';
import * as files from "fs"
const client = new Client();
dotenv.config()
//debug
client.on('ready', () => {
    console.log('node.js is activated' + "\n" + "cute bot v.1.0.1 is on processed");
    Readfiles();
    console.log('storage file is up to date')
});

setInterval(() => {
        StockArray = ChangeEveryHourStocks(data , StockArray);
    }, 3600000);

//login
client.login(process.env.CLIENT_TOKEN);

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

//check id is in json list
function FindId(id) {
    Readfiles()
    var p = data.Players.find(player => player.id == id)
    if(p == undefined) return false
    else return true 
}

// find index of json list
function Findindex(id) { 
    Readfiles()
    return data.Players.findIndex(player => player.id == id) 
}

client.on('message', (message) => {	
    var commands = message.content.toLocaleLowerCase().split(" ");
    console.log(commands[0]);
    var Name = message.author.username
    var Id = message.author.id

    if(commands[0] === '!change') {
        ChangeEveryHourStocks(data, StockArray)
        Writefile('Players.json' , data)
        console.log(StockArray)
    }

    if(commands[0] === '!me') {
        if (!FindId(Id)) CreateNewId(data, Id, Name), Writefile('Players.json' , data);
        message.channel.send(display(data, message, client))
    }

    if(commands[0] === '!ขอ') {
        if (!FindId(Id)) CreateNewId(data, Id, Name), Writefile('Players.json' , data);
        AddCoin(data, Id, 100);
        Writefile('Players.json' , data);
        message.channel.send(displaymsg('ขอ' , Name + "ได้ $100 จากการขอทาน!"))
    }

    if(commands[0] === '!buy') {
        if (!FindId(Id)) CreateNewId(data, Id, Name), Writefile('Players.json' , data);
        var StockId = commands[1]
        var BuyValue = commands[2]
        if (!CheckCoin(data, Id, BuyValue)) message.channel.send(displaymsg('ซื้อหุ้น' , 'เงินไม่พอที่จะซื้อหุ้นจำนวน ' + BuyValue))
        else {
            if ( StockArray.find((stock) => stock.id === StockId) === undefined) message.channel.send(displaymsg('ซื้อหุ้น' , 'ไม่พบหุ้นที่ต้องการ'))
            else {
                var success = CreateNewStocks(StockId, data, Id, StockArray.find((stock) => stock.id === StockId).value, BuyValue, 24);
                if (success) success = RemoveCoin(data, Id, BuyValue)
                if (success) message.channel.send(displaymsg('ซื้อหุ้น' , 'ซื้อหุ้น '+ StockId + " ที่ราคา " + StockArray.find((stock) => stock.id === StockId).value + " จำนวน " + BuyValue  + ' สำเร็จ'));
                Writefile('Players.json' , data);
            }
        }
    }

    if(commands[0] === '!sell') {
        if (!FindId(Id)) CreateNewId(data, Id, Name), Writefile('Players.json' , data);
        var StockId = command[1];
        if ( StockArray.find((stock) => stock.id === StockId) === undefined) message.channel.send(displaymsg('ขายหุ้น' , 'ไม่พบหุ้นที่ต้องการ'))
        else {
            if ( data.Stocks.filter((stock) => stock.userid === Id).filter((stock) => stock.id === StockId ).length === 0 )  message.channel.send(displaymsg('ขายหุ้น' , 'ไม่พบรายการการขายที่ต้องการ'))
        }
    }
    
    if(commands[0] === '!stock') {
        console.log("xd")
        message.channel.send(StockDisplay(StockArray, client));
    }
    
});
