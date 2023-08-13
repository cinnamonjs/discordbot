
export function CheckTimerStock(data, item) {
    item.time--;
    if (item.time <= 0) SellStock(data, item);
}

export function SellStock(data, item) {
    if (item.time <= 0) {
        var OwnerStock = data.Stocks.find(unit => unit.id == item.id)
        var PlayerData = data.Players.find(player => player.id == OwnerStock.userid)
        var i = data.Players.findIndex(player => player.ID == PlayerData.id);

        var exchange = OwnerStock.value * item.value / item.stockprice 
        data.Players[i].Coin += exchange
        if (exchange > 0) data.Players[i].stockup++;
        else data.Players[i].stockdown++;

        delete data.Stock[data.Players.findIndex(player => player.id == OwnerStock.id)];
    }
}

export function ResetStocks(id) {
    if (!FindId(id)) CreateNewId(id);
    if (data.role == "admin") Stocks = JSON.parse(files.readFileSync("./modules/Stock.js"));
    console.log("Stocks reseted");
}

 // Create new Stocks
export function CreateNewStocks(id, data, userid, stockprice, value, time) {
    data.Stocks.push(
        {"id": id,
        "userid": userid,
        "stockprice": stockprice,
        "value": value,
        "time": time});
    console.log("Stocks created");
    return true;
}

export function ChangeEveryHourStocks(data, Stocks) {
    var critChanged = Math.floor(Math.random() * 20)
    // Change item 1 (60 : 40)
    var changed = Math.floor(Math.random() * 10)
    var StockedUp = [0, 1, 2, 3, 4, 5]
    ChangeStocked(Stocks, "btc", StockedUp.includes(changed), (critChanged === changed), "18" , "8", "115")
    // Change item 2 (50 : 50)
    var changed2 = Math.floor(Math.random() * 10)
    var StockedUp2 = [0, 2, 3, 5, 8]
    ChangeStocked(Stocks, "rtx", StockedUp2.includes(changed2), (critChanged === changed2), "8", "22", "15")
    // Change item 3 (70 : 30)
    var changed3 = Math.floor(Math.random() * 10)
    var StockedUp3 = [0, 2, 3, 4, 5, 7, 8]
    ChangeStocked(Stocks, "crn", StockedUp3.includes(changed3), (critChanged === changed3), "9", "4", "10")
    // Change item 4 (70 : 30)
    var changed4 = Math.floor(Math.random() * 10)
    var StockedUp4 = [0, 2, 3, 4, 5, 7, 8]
    ChangeStocked(Stocks, "ppp", StockedUp4.includes(changed4), (critChanged === changed4), "6", "11", "10")
    // Change item 5 (60 : 40)
    var changed5 = Math.floor(Math.random() * 10)
    var StockedUp5 = [0, 2, 3, 4, 5, 9]
    ChangeStocked(Stocks, "pep", StockedUp5.includes(changed5), (critChanged === changed5), "5", "4", "7")
    // Change item 6 (90 : 10)
    var changed6 = Math.floor(Math.random() * 10)
    ChangeStocked(Stocks, "jev", (changed6 === 9), (critChanged === changed6), "0.3", "0.7", "2")
    console.log("Stocks changed");
    console.log("--------------------------------")
    if (data.Stocks.length > 0) for (const item of data.Stocks) {
        CheckTimerStock(data, item)
    }
}

export function ChangeStocked(StockArray, id , IsStockedUp , IsCrit , base , randombase, critRate) {
    var Stockitem = StockArray.find((item) => item.id === id);
    var Changebase = Math.random() * randombase;
    var CritChangebase = IsCrit * critRate;
    var NewValue =  (Stockitem.value + (IsStockedUp ? 1 : -1) * (base * 1 + Changebase * 1 + CritChangebase * 1));
    if (NewValue < 0) NewValue = 0.01;
    var OldValue = StockArray.at(StockArray.findIndex(item => item.id == id)).value
    var NumberChange = Math.round(NewValue - OldValue);
    var PercentChange = Math.round((NewValue - OldValue) / OldValue * 100);
    StockArray.at(StockArray.findIndex(item => item.id == id)).value = (typeof NewValue === 'number' ? parseInt(NewValue.toFixed(2)) : parseInt(NewValue))
    StockArray.at(StockArray.findIndex(item => item.id == id)).changed = (NumberChange >= 0 ? '+' : '') + (NumberChange.toString()) + "(" + (PercentChange >= 0 ? '+' : '') + (PercentChange.toString()) +"%)";
}
