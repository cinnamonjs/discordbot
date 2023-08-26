import { EmbedBuilder } from 'discord.js';
//display system
export function display(data, user, bot) {
    var found = false;
    var index = 0;
    var Stocklist = [];
    var PortValue = 0;
    if (data.Stocks.length > 0)
        for (const item of data.Stocks) {
            if (item.userid === user.id && index < 4) {
                found = true;
                PortValue += (1.00 * item.value * item.stockprice);
                Stocklist.push(`${item.id} ราคา ${item.stockprice} จำนวน ${(item.value * 1.00).toFixed(2)} เวลาคงเหลือ ${item.time} ชั่วโมง`)
                index++;
            }
        }
    var coin = data.Players.find(player => player.id === user.id).Coin;
    var networth = (1.00 * (coin + PortValue)).toFixed(2)

    var Desc = "> Net Worth : $" + (coin + PortValue * 1.00).toFixed(2)

    var display = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle("Account information")
        .setAuthor({ name: `${user.username}`, iconURL: `${user.avatarURL()}` })
        .setDescription(Desc)
        .setThumbnail(`${user.avatarURL()}`)
        .addFields(
            { name: 'Account Balanced', value: `$ ${(coin * 1.00).toFixed(2)}`, inline: true },
            { name: 'Port Balanced', value: `$ ${(PortValue).toFixed(2)}`, inline: true },
            { name: '\u200B', value: '\u200B' },
        )
        .setFooter({ text: '@นักลงทุนแมน', iconURL: `${bot.user.avatarURL()}` })
        .setTimestamp()

    if (Stocklist.length > 0) display.addFields({ name: 'Stocks (หุ้น)', value: Stocklist.join('\n') })
    if (!found) display.addFields({ name: 'Stocks (หุ้น)', value: '-' })
    display.addFields({ name: '\u200B', value: '\u200B' })
    return display
}

//display message
export function displaymsg(header, message, user, bot) {
    var Desc = "-------------------------------------------------------\n> พิจารณาความเสี่ยงก่อนการลงทุนทุกชนิด"
    const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(header)
        .setAuthor({ name: `${user.username}`, iconURL: `${user.avatarURL()}` })
        .setDescription(Desc)
        .addFields({ name: message, value: "  " })
        .setFooter({ text: '@นักลงทุนแมน', iconURL: `${bot.user.avatarURL()}` })
        .setTimestamp()
    return embed
}

export function StockDisplay(stock, bot) {
    const display = new EmbedBuilder()
        .setColor("#00b0f4")
        .setTitle("Stock board")
        .setDescription("-------------------------------------------------------\n> Stock board are changed every hours")
        .setAuthor({ name: "info", iconURL: `${bot.user.avatarURL()}` })
        .setThumbnail(`${bot.user.avatarURL()}`)
        .addFields({ name: '\u200B', value: '\u200B' })
        .setFooter({ text: '@นักลงทุนแมน', iconURL: `${bot.user.avatarURL()}` })
        .setTimestamp()

    stock.forEach(stock => {
        display.addFields(
            { name: "Stock (id)", value: stock.name, inline: true },
            { name: "Stock Value", value: `${stock.value}`, inline: true },
            { name: "Changed", value: stock.changed, inline: true },
            { name: '\u2009', value: '\u2009' }
        );
    });
    return display
}

export function BuyStock(stock, message, value, bot) { }
//display commands
export function command() {
    const currentDate = new Date();
    var disp = new Discord.EmbedBuilder()
        .addField(`Game list`, `!list | !add <name> | !remove <name> | !clear | !roll`)
        .addField(`Coin list`, `!coin | !mining <value (0-9)> | !gacha <coin> | !feed <coin>`)
        .addField(`Bot`, `!info`)
        .setFooter(`@นักลงทุนแมน` + currentDate.toLocaleString())
    return disp
}