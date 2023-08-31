import { EmbedBuilder, Client, AttachmentBuilder } from 'discord.js';
import * as files from 'fs';
import { UserData, StockData, LogData, ChartDisplay } from './../type.js'
import { ChartStock } from './ChartFunction.js';
//display system
export function display(data: UserData, user: any, bot: Client): EmbedBuilder {
    var found = false;
    var index = 0;
    var Stocklist = [];
    var PortValue = 0;
    if (data.Stocks.length > 0)
        for (const item of data.Stocks) {
            if (item.userid === user.id && index < 4) {
                found = true;
                PortValue += (1.00 * item.value * item.stockprice);
                Stocklist.push(`${item.id} ราคา ${item.stockprice} \u2002 จำนวน ${(item.value * 1.00).toFixed(2)} \u2002 เวลาคงเหลือ ${item.time} ชั่วโมง`)
                index++;
            }
        }
    var coin = data.Players.find(player => player.id === user.id).Coin;
    var networth = (1.00 * (coin + PortValue)).toFixed(2)
    var Desc = "> 💰 Net Worth : $" + networth

    var display = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle("🏦 Account information")
        .setAuthor({ name: `${user.username}`, iconURL: `${user.avatarURL()}` })
        .setDescription(Desc)
        .setThumbnail(`${user.avatarURL()}`)
        .addFields(
            { name: '💵 Account Balanced', value: `$ ${(coin * 1.00).toFixed(2)}`, inline: true },
            { name: '📈 Port Balanced', value: `$ ${(PortValue).toFixed(2)}`, inline: true },
            { name: '\u200B', value: '\u200B' },
        )
        .setFooter({ text: '@นักลงทุนแมน', iconURL: `${bot.user.avatarURL()}` })
        .setTimestamp()

    if (Stocklist.length > 0) display.addFields({ name: '🏷️ Stocks (หุ้น)', value: Stocklist.join('\n') })
    if (!found) display.addFields({ name: 'Stocks (หุ้น)', value: '-' })
    display.addFields({ name: '\u200B', value: '\u200B' })
    return display
}

//display message
export function displaymsg(header: string, message: string, user: any, bot: Client): EmbedBuilder {
    var Desc = "> \u200B \n > พิจารณาความเสี่ยงก่อนการลงทุนทุกชนิด"
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

export function StockDisplay(stock: StockData[], bot: Client): EmbedBuilder {
    const display = new EmbedBuilder()
        .setColor("#00b0f4")
        .setTitle("📊 Stock board")
        .setDescription("> \u200B \n> 🕐 Stock board are changed every hours \n > each stock has auto decayed at 24 hours limit")
        .setAuthor({ name: "info", iconURL: `${bot.user.avatarURL()}` })
        .setThumbnail(`${bot.user.avatarURL()}`)
        .addFields({ name: '\u200B', value: '\u200B' })
        .setFooter({ text: '@นักลงทุนแมน', iconURL: `${bot.user.avatarURL()}` })
        .setTimestamp()

    stock.forEach(stock => {
        display.addFields(
            { name: "Stock (id) \u2002", value: stock.name, inline: true },
            { name: "Stock Value \u2003", value: `${stock.value}`, inline: true },
            { name: "Changed", value: stock.changed, inline: true },
            { name: '\u2009', value: '\u2009' }
        );
    });
    return display
}

//display commands
export function command(bot: Client) {
    var disp = new EmbedBuilder()
        .setColor("#00b0f4")
        .setTitle("📊 Bot info")
        .setFooter({ text: '@นักลงทุนแมน', iconURL: `${bot.user.avatarURL()}` })
        .setTimestamp()

    return disp
}

export async function StockDetailDisplay(bot: Client): Promise<ChartDisplay> {
    var logArray: LogData[] = JSON.parse(files.readFileSync('./log.json', 'utf8'));
    logArray.sort((a, b) => b.index - a.index);
    const bufferResult = await ChartStock(logArray);
    const attachmentimage = new AttachmentBuilder(bufferResult ,{ name: "image-attachment.png"});
    const display = new EmbedBuilder()
        .setColor("#00b0f4")
        .setTitle("📊 Stock board")
        .setDescription("> \u200B \n> 🕐 Stock board are changed every hours \n > each stock has auto decayed at 24 hours limit \n > \u200B")
        .setAuthor({ name: "info", iconURL: `${bot.user.avatarURL()}` })
        .setThumbnail(`${bot.user.avatarURL()}`)
        .setFooter({ text: '@นักลงทุนแมน', iconURL: `${bot.user.avatarURL()}` })
        .setTimestamp()
    return { display: display , image: attachmentimage };
}