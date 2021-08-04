const config = require("./config.json");
const files = require('fs');
const fileName = "./Players.json";
const Discord = require('discord.js');
const { get } = require("http");
const client = new Discord.Client();
//debug-startsystem
client.once('ready', () => {
    
	console.log('System is ready!');
    console.log('node.js on activated' + "\n" + "cute bot v.1.0.1 is on processed");
});
//login
client.login(config.token);
//game-list
let game = [];
let data = [];
function Readfiles() {
// read-file
    var rawdata = files.readFileSync(fileName);
    data = JSON.parse(rawdata);
}
client.on('message', message => {	
    let commands = message.content.split(" ");
    var Name = message.author.username
    let crit = 0;
    //game
    if (commands[0] === '!add' && commands.length == 2) {
        let add = game.push(commands[1]);
        message.channel.send("`" + commands[1] + '` is in list');
    }
    else if (commands[0] === '!list') {
        console.log(game);
        message.channel.send("in list have : `" + game + '`');
    }
    else if (commands[0] === '!remove' && commands.length == 2) {
        let findindex = game.indexOf(commands[1]);
        let remove = game.splice(findindex,1);
        message.channel.send("`" + commands[1] + '` is removed out of list');
    }
    else if(commands[0] === '!clear') {
        let clear = game.splice(0,game.length);
        message.channel.send("all in list is removed");
    }
    else if(commands[0] === '!roll') {
        if (game.length === 0) { message.channel.send('list is None')}
        else {
            let roll = Math.floor(Math.random() * game.length)
            message.channel.send("!The roll is `" + game[roll] + '`')
        }
    }
    else if(commands[0] === '!dice') {
        let dice = Math.floor(Math.random() * 6)
        message.channel.send("!The roll is `" + dice + '`')
    }
    else if(commands[0] === '!command') { message.channel.send(command()) }

    //coin
    else if(commands[0] === '!getcoin') {
        var id = message.author.id;
        var coin = commands[1]*1;
        Getcoin(id, coin,Name)
        message.channel.send(message.author.username + " got some coin")
    }
    else if(commands[0] === '!coin') {
        var id = message.author.id;
        var name = message.author.username;
        message.channel.send(showcoin(id,name));
    }
    else if(commands[0] === '!mining') {
        let curcoins = commands[1]*1
        var id = message.author.id;
        var number = []
        for (i=0; i < 3; i++) { 
            let num = Math.floor(Math.random() * 10)
            if (!number.find(elem => elem == num)) { number.push(num) }
            else{ i-- }
        }
        var jackpot = number[Math.floor(Math.random() * 3)]
        console.log(number,jackpot)
        if (curcoins == jackpot) {
            Getcoin(id,5,Name)
            message.reply(displaymsg("You got jackpot treasure!","You got 5 coins")).then(msg => {
                msg.delete({ timeout: 6000 });
            })
            .catch;
        }
        else if (number.includes(curcoins)) {
            Getcoin(id,1,Name)
            message.reply(displaymsg("You got amount of coin","You got 1 coins")).then(msg => {
                msg.delete({ timeout: 6000 });
            })
            .catch;
        }
        else { 
            message.reply(displaymsg("Sad",'You got nothing')).then(msg => {
              msg.delete({ timeout: 6000 });
            })
            .catch;
        }
    }
    else if(commands[0] === '!gacha') {
        let curcoins = commands[1]*1
        let aux = Math.floor(Math.random() * 12)
        let id = message.author.id
        if(!CheckCoin(id,curcoins,Name)) {
            message.reply(displaymsg("Account balance",message.author.username + "not have enough coins to purchase")).then(msg => {msg.delete({ timeout: 6000 });})
            }
        else {
            Getcoin(id,curcoins * -1,Name)
            var gamble = []
            for (i=0; i < 6; i++) { 
                let element = Math.floor(Math.random() * 12)
                if (!gamble.find(elem => elem == element)) { gamble.push(element) }
                else{ i-- }
            }
            var jackpot = gamble[Math.floor(Math.random() * 6)]
            var nd = gamble[Math.floor(Math.random() * 6)]
            console.log(gamble +" : " + jackpot + " : " + nd + " : " + aux)
            if (aux == jackpot) {
                Getcoin(id,8*curcoins,Name)
                message.reply(displaymsg("You got jackpot treasure!","You got " + 8*curcoins + " coins"))
            }
            else if (aux == nd) {
                var get = Math.floor(0.4*curcoins)
                Getcoin(id,get,Name)
                message.reply(displaymsg("You got amount of coin","You got " + get + " coins")).then(msg => {
                    msg.delete({ timeout: 6000 });
                })
                .catch;
            }
            else if (gamble.includes(aux)) {
                var got = Math.floor(1.2*curcoins)
                Getcoin(id,got,Name)
                message.reply(displaymsg("You got treasure","You got " + got + " coins")).then(msg => {
                    msg.delete({ timeout: 6000 });
                })
                .catch;
            }
            else { 
                message.reply(displaymsg("Sad",'You got nothing and lose ' + curcoins + " coins"))
            }
        }
    }

    else if(commands[0] === '!feed'){
        var id = message.author.id
        var Curcoins = commands[1]*1
        if(!CheckCoin(id,Curcoins,Name)) {
            message.reply(displaymsg("Account balance",message.author.username + "not have enough coins to purchase")).then(msg => { msg.delete({ timeout: 6000 });})
            }
        else {
            var Xp = data.Levels.Xp
            data.Levels.Xp = Xp + Curcoins
            var currXp = data.Levels.Xp
            var currLv = Math.floor((data.Levels.Lv+1)*1000/1.7)
            console.log(currXp,currLv)
            if (currXp > currLv) {
                data.Levels.Lv++
                data.Levels.Xp = currXp - currLv
            }
            files.writeFileSync(fileName, JSON.stringify(data));
            message.reply(displaymsg("Cute bot",'You feed bot ' + Curcoins + " coins"))
        }
    }
    else if(commands[0] === '!info') {
        Readfiles()
        var xp = data.Levels.Xp;
        var lv = data.Levels.Lv;
        message.reply(info(xp,lv))
    }
    else if(commands[0] === '!test'){
        Readfiles
        console.log(data);
    }
    
});
//give&buy coin system
function Getcoin(id, coin,username) {
    Readfiles()
    if (!FindId(id)) {
        data.Players.push({ID:id,Username:username,Coin:0});
        files.writeFileSync(fileName, JSON.stringify(data));
        Getcoin(id, coin,username)
    }
    else {
        var x = Findindex(id);
        var exchange = data.Players[x].Coin + coin;
        data.Players[x].Coin = exchange;
        files.writeFileSync(fileName, JSON.stringify(data));
    }
}
//check coin == or > json.data
function CheckCoin(id,coin,username) {
    Readfiles()
    if (!FindId(id)) {
        data.Players.push({ID:id,Username:username,Coin:0});
        files.writeFileSync(fileName, JSON.stringify(data));
        CheckCoin(id,coin,username);
    }
    else {
        var x = Findindex(id);
        var currcoins = data.Players[x].Coin
        if (currcoins >= coin) {
            return true
        }
        else {return false}
    }
}
//display amount coin
function showcoin(id,username) {
    Readfiles()
    if (!FindId(id)) {
            data.Players.push({ID:id,Username:username,Coin:0});
            files.writeFileSync(fileName, JSON.stringify(data));
            var coin = data.Players[Findindex(id)].Coin
            return display(username,coin)
        }
        else {
            var coin = data.Players[Findindex(id)].Coin
            return display(username,coin)
        }
}
//check id is in json list
function FindId(id) {
    Readfiles()
    let p = data.Players.find(player => player.ID == id)
    if(p == undefined){
        return false
    }
    else { return true } 
}
// find index of json list
function Findindex(id) { 
    Readfiles()
    return data.Players.findIndex(player => player.ID == id) 
}
//check username is in json list
function FindName(name) {
    Readfiles()
    let p = data.Players.find(player => player.Username == name)
    if(p == undefined){
        return false
    }
    else { return true } 
}
// find username of json list
function FindindexName(name) { 
    Readfiles()
    return data.Players.findIndex(player => player.Username == name) 
}
//display system
function display(name, coin) {
    const currentDate = new Date();
    let emb = new Discord.MessageEmbed()
        .addField(`Account balance`,`${name} have ${coin} coin`)
        .setFooter(`@Cutebot` + currentDate.toLocaleString())
    return emb
}
//display message
function displaymsg(header,message) {
    const currentDate = new Date();
    const embed = new Discord.MessageEmbed()
        .addField(header,message)
        .setFooter(currentDate.toLocaleString())
    return embed
}
//display commands
function command() {
    const currentDate = new Date();
    let disp = new Discord.MessageEmbed()
        .addField(`Game list`, `!list | !add <name> | !remove <name> | !clear | !roll`)
        .addField(`Coin list`,`!coin | !mining <value (0-9)> | !gacha <coin> | !feed <coin>`)
        .addField(`Bot`,`!info`)
        .setFooter(`@Cutebot` + currentDate.toLocaleString())
    return disp
}
//info commmands
function info(xp,lv) {
    const currentDate = new Date();
    let Info = new Discord.MessageEmbed()
        .addField(`Bot level ${lv}`, `${xp}/${Math.floor((lv+1)*1000/1.7)}`)
        .addField(` `, `Bot have ${data.Players.length} members`)
        .setFooter(`@Cutebot` + currentDate.toLocaleString())
    return Info
}