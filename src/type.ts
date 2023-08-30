import { AttachmentBuilder, EmbedBuilder } from "discord.js";

export type StockData = {
    id: string,
    name: string,
    value: number,
    changed: string
}
export type Player = {
    id: string;
    Username: string;
    role: string;
    Coin: number;
};
export type Stock = {
    id: string;
    userid: string,
    stockprice: number,
    value: number,
    time: number,
}
export type UserData = {
    Players: Player[];
    Stocks: Stock[];
}
export type LogData = {
    stock: StockData[],
    index: number
}

export type ChartDisplay = {
    display: EmbedBuilder
    image:  AttachmentBuilder
}