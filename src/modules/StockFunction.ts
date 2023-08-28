import { User } from "discord.js";
import { Stock, StockData, UserData } from "../type.js";


export function CheckTimerStock(data: UserData, item: Stock, stock: StockData[]) {
    item.time--;
    if (item.time <= 0) SellStock(data, item, stock);
}

export function SellStock(data: UserData, item: Stock, stock: StockData[]) {
    if (item.time <= 0) {
        var Stockitem = stock.find((Stock) => Stock.id === item.id);
        var i = data.Players.findIndex(player => player.id == item.userid);

        var exchange = parseFloat((Stockitem.value * item.value).toFixed(2))
        data.Players[i].Coin += exchange
        console.log(`auto decayed player ${data.Players.at(i).Username} receive ${exchange}`)
        data.Stocks.splice(i, 1)
    }
}

// Create new Stocks
export function CreateNewStocks(id: string, data: UserData, userid: string, stockprice: number, value: number, time: number) {
    data.Stocks.push(
        {
            "id": id,
            "userid": userid,
            "stockprice": stockprice,
            "value": parseFloat((value / stockprice).toFixed(2)),
            "time": time
        });
    console.log("Stocks created");
    return true;
}

export function AddStock(id: string, data: UserData, userid: string, stockprice: number, value: number, time: number) {
    var BuyValue = value / stockprice * 1.00;
    var i = data.Stocks.findIndex((stock) => stock.id === id && stock.userid === userid)
    var price = data.Stocks.at(i).value
    var variantStockprice = parseFloat(((data.Stocks.at(i).stockprice * price + stockprice * value) / (price + value)).toFixed(2));
    data.Stocks.at(i).value += BuyValue;
    data.Stocks.at(i).time = time;
    data.Stocks.at(i).stockprice += variantStockprice;
    console.log("Add successed")
    return true;
}

export function SellSelfStocks(id: string, data: UserData, userid: string, stockprice: number, value: number) {
    var j = data.Stocks.findIndex((stock) => stock.userid === userid && stock.id === id);
    var i = data.Players.findIndex(player => player.id === userid);
    var OwnerStock = data.Stocks.at(j)

    var CurrentValue = stockprice * OwnerStock.value * 1.00;
    if (OwnerStock.value === value) {
        data.Players[i].Coin += parseFloat(CurrentValue.toFixed(2));
        data.Stocks.splice(j, 1)
        console.log("Sell successed")
        return true;
    }
    else {
        data.Players[i].Coin += parseFloat(CurrentValue.toFixed(2));
        data.Stocks[j].value -= value;
        console.log("Sell successed")
        return true;
    }
}
function CheckChange(x: number, y: number): number {
    return (x > y) ? 1 : 0
}
function CheckCrit(x: number, y: number): number {
    return (x = y) ? 1 : 0
}
export function ChangeEveryHourStocks(data: UserData, Stocks: StockData[]) {
    var critChanged = Math.floor(Math.random() * 100)
    var changelist = []
    for (let i = 0; i <= 6; i++) {
        changelist[i] = Math.floor(Math.random() * 100)
    }
    // change item 1 67% at 18.0 bonus 10.0
    ChangeStocked(Stocks, "btc", CheckChange(changelist[0], 67), CheckCrit(critChanged, changelist[0]), 18.0, 10.0, 115.0)
    // Change item 2 54% at 8.0 bonus 24.0
    ChangeStocked(Stocks, "rtx", CheckChange(changelist[1], 54), CheckCrit(critChanged, changelist[1]), 8.0, 24.0, 55.0)
    // Change item 3 32% at 5.0 bonus 4.0
    ChangeStocked(Stocks, "crn", CheckChange(changelist[2], 32), CheckCrit(critChanged, changelist[2]), 5.0, 4.0, 30.0)
    // Change item 4 30% at 0.0 bonus 8.0
    ChangeStocked(Stocks, "ppp", CheckChange(changelist[3], 31), CheckCrit(critChanged, changelist[3]), 0.0, 8.0, 30.0)
    // Change item 5 25% at 1.0 bonus 1.5
    ChangeStocked(Stocks, "pep", CheckChange(changelist[4], 25), CheckCrit(critChanged, changelist[4]), 1.0, 1.5, 15.0)
    // Change item 6 9% at 0.1 bonus 0.2 
    ChangeStocked(Stocks, "jev", CheckChange(changelist[5], 9), CheckCrit(critChanged, changelist[5]), 0.1, 0.2, 1)
    console.log("Stocks changed");
    console.log("--------------------------------")
    if (data.Stocks.length > 0)
        for (const item of data.Stocks) {
            CheckTimerStock(data, item, Stocks)
        }
    console.log("Stocks decayed");
    console.log("--------------------------------")
}

export function ChangeStocked(StockArray: StockData[], id: string, IsStockedUp: number, IsCrit: number, base: number, randombase: number, critRate: number) {
    var Stockitem = StockArray.find((item) => item.id === id);
    var i = StockArray.findIndex(item => item.id == id)
    //calculate random variable
    var Changebase = Math.random() * randombase;
    var CritChangebase = IsCrit * critRate;
    //calculate Value changed
    var NewValue = Stockitem.value + (IsStockedUp ? 1 : -1) * (base + Changebase + CritChangebase);
    if (NewValue < 0) NewValue = 0.01;
    var OldValue = StockArray.at(i).value
    var NumberChange = parseFloat((NewValue - OldValue).toFixed(2));
    var PercentChange = parseFloat(((NewValue - OldValue) * 100 / OldValue).toFixed(2));
    StockArray.at(i).value = parseFloat(NewValue.toFixed(2));
    StockArray.at(i).changed = (NumberChange >= 0 ? '➚ +' : '➘ ') + (NumberChange) + "(" + (PercentChange >= 0 ? '+' : '') + (PercentChange) + "%)";
}
