import { AttachmentBuilder, EmbedBuilder, ModalBuilder, ActionRowBuilder, ButtonBuilder } from "discord.js";

export type StockData = {
    id: string,
    name: string,
    value: number,
    margintop: number,
    marginbottom: number,
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

export type Gamble = {
    result: string[]
    total: number
    bet?: [{
        userid: string,
        type: string,
        number?: number,
        betamount: number;
    }]
}
export type UserData = {
    Players: Player[];
    Stocks: Stock[];
    Gambles?: Gamble;
}

export type LogData = {
    stock: StockData[],
    index: number
}

export type ChartDisplay = {
    display: EmbedBuilder
    image:  AttachmentBuilder
}

export type Gambling = { 
    result: string[]
    total: number
}


