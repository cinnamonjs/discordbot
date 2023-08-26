import { MessageEmbed } from "discord.js";
//display system
export function display(data, message, bot) {
    var found = false;
    var Stocklist = [];
    var PortValue = 0;
    if (data.Stocks.length > 0) 
        for (const item of data.Stocks) {
            if (item.userid === message.author.id) {
                found = true;
                PortValue += (1 * item.value * item.stockprice);
                Stocklist.push( `${item.id} ราคา ${item.stockprice} จำนวน ${(item.value * 1.00).toFixed(2)} เวลาคงเหลือ ${item.time} ชั่วโมง`)
            }
        }
    var coin = data.Players.find(player => player.id === message.author.id).Coin;
    var Desc = "> Net Worth : $" + (coin + PortValue * 1.00).toFixed(2)
    var display = new MessageEmbed()
        .setColor(0x0099FF)
        .setTitle("Account information")
        .setAuthor(`${message.author.username}`,`${message.author.avatarURL()}`)
        .setDescription(Desc)
        .setThumbnail(`${message.author.avatarURL()}`)
        .addFields(
            { name: 'Account Balanced', value: `$ ${(coin * 1.00).toFixed(2)}` , inline: true},
            { name: 'Port Balanced', value: `$ ${(PortValue * 1.00).toFixed(2)}` , inline: true},
            { name: '\u200B', value: '\u200B' },
        )
        .setFooter('@นักลงทุนแมน',`${bot.user.avatarURL()}`)
        .setTimestamp()
    
    


    if (Stocklist.length > 0) display.addField('Stocks (หุ้น)', Stocklist)
    if (!found) display.addField('Stocks (หุ้น)','-')
    display.addField('\u200B','\u200B')
    return display
}

//display message
export function displaymsg(header, message, bot) {
    var Desc = "-------------------------------------------------------\n> พิจารณาความเสี่ยงก่อนการลงทุนทุกชนิด"
    const embed = new MessageEmbed()
        .setColor(0x0099FF)
        .setTitle(header)
        .setAuthor(`${message.author.username}`,`${message.author.avatarURL()}`)
        .setDescription(Desc)
        .addField(message, "")
        .setFooter('@นักลงทุนแมน',`${bot.user.avatarURL()}`)
        .setTimestamp()
    return embed
}

export function StockDisplay(stock, bot) {
    var display = new MessageEmbed()
        .setColor("#00b0f4")
        .setTitle("Stock board")
        .setDescription("-------------------------------------------------------\n> Stock board are changed every hours")
        .setAuthor("info",`${bot.user.avatarURL()}`)
        .setThumbnail(`${bot.user.avatarURL()}`)
        .addFields({ name: '\u2009', value: '\u2009'})
        .setFooter('@นักลงทุนแมน',`${bot.user.avatarURL()}`)
        .setTimestamp()
        
        stock.forEach(stock => {
            display.addFields(
                { name: "Stock (id)", value: stock.name, inline: true },
                { name: "Stock Value", value: stock.value, inline: true },
                { name: "Changed", value: stock.changed, inline: true },
                { name: '\u2009', value: '\u2009'}
            );
        });
        display.addField('\u200B','\u200B')
    return display
}

export function BuyStock(stock, message, value, bot) {}
 //display commands
export function command() {
    const currentDate = new Date();
    var disp = new Discord.MessageEmbed()
        .addField(`Game list`, `!list | !add <name> | !remove <name> | !clear | !roll`)
        .addField(`Coin list`,`!coin | !mining <value (0-9)> | !gacha <coin> | !feed <coin>`)
        .addField(`Bot`,`!info`)
        .setFooter(`@นักลงทุนแมน` + currentDate.toLocaleString())
    return disp
}