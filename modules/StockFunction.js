
export function CheckTimerStock(data, item) {
    item.time--;
    if (item.time <= 0) SellStock(data, item);
}

export function SellStock(data, item) {
    if (item.time <= 0) {
        var OwnerStock = data.Stocks.find(unit => unit.id == item.id)
        var PlayerData = data.Players.find(player => player.id == OwnerStock.userid)
        var i = data.Players.findIndex(player => player.id == PlayerData.id);

        var exchange = OwnerStock.value * item.value 
        data.Players[i].Coin += exchange
        if (exchange > 0) data.Players[i].stockup++;
        else data.Players[i].stockdown++;

        delete data.Stock[data.Players.findIndex(player => player.id == OwnerStock.id)];
    }
}

export function ResetStocks(id) {
    if (!FindId(id)) CreateNewId(id);
    if (data.Players[data.Players.findIndex(players => players.id === id)].role == "admin") Stocks = JSON.parse(files.readFileSync("./modules/Stock.js"));
    console.log("Stocks reseted");
}

 // Create new Stocks
export function CreateNewStocks(id, data, userid, stockprice, value, time) {
    data.Stocks.push(
        {"id": id,
        "userid": userid,
        "stockprice": stockprice,
        "value": (value / stockprice).toFixed(2),
        "time": time});
    console.log("Stocks created");
    return true;
}

export function AddStock(id, data, userid, stockprice, value, time) {
    var BuyValue = value / stockprice * 1.00;
    data.Stocks.find((stock) => stock.id === id && stock.userid === userid).value += BuyValue;
    data.Stocks.find((stock) => stock.id === id && stock.userid === userid).time = time;
    return true;
}

export function SellSelfStocks(id, data, userid, stockprice, value) {
    var OwnerStock = data.Stocks.find((stock) => stock.userid === userid && stock.id === id);
    var j = data.Stocks.findIndex((stock) => stock.userid === userid && stock.id === id);
    var i = data.Players.findIndex(player => player.id === userid);
    console.log(i,j);
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

export function ChangeEveryHourStocks(data, Stocks) {
    var critChanged = Math.floor(Math.random() * 20)
    // Change item 1 (60 : 40)
    var changed = Math.floor(Math.random() * 10)
    var StockedUp = [0, 1, 2, 3, 4, 5]
    ChangeStocked(Stocks, "btc", StockedUp.includes(changed), (critChanged === changed), 18.0 , 8.0, 115.0)
    // Change item 2 (50 : 50)
    var changed2 = Math.floor(Math.random() * 10)
    var StockedUp2 = [0, 2, 3, 5, 8]
    ChangeStocked(Stocks, "rtx", StockedUp2.includes(changed2), (critChanged === changed2), 8.0, 22.0, 15.0)
    // Change item 3 (70 : 30)
    var changed3 = Math.floor(Math.random() * 10)
    var StockedUp3 = [0, 2, 3, 4, 5, 7, 8]
    ChangeStocked(Stocks, "crn", StockedUp3.includes(changed3), (critChanged === changed3), 9.0, 4.0, 10.0)
    // Change item 4 (70 : 30)
    var changed4 = Math.floor(Math.random() * 10)
    var StockedUp4 = [0, 2, 3, 4, 5, 7, 8]
    ChangeStocked(Stocks, "ppp", StockedUp4.includes(changed4), (critChanged === changed4), 6.0, 11.0, 10.0)
    // Change item 5 (60 : 40)
    var changed5 = Math.floor(Math.random() * 10)
    var StockedUp5 = [0, 2, 3, 4, 5, 9]
    ChangeStocked(Stocks, "pep", StockedUp5.includes(changed5), (critChanged === changed5), 5.0, 4.0, 7.0)
    // Change item 6 (90 : 10)
    var changed6 = Math.floor(Math.random() * 10)
    ChangeStocked(Stocks, "jev", (changed6 !== 9), (critChanged === changed6), 0.1, 0.3, 0.5)
    console.log("Stocks changed");
    console.log("--------------------------------")
    if (data.Stocks.length > 0) for (const item of data.Stocks) {
        CheckTimerStock(data, item)
    }
    console.log("Stocks decayed");
    console.log("--------------------------------")
}

export function ChangeStocked(StockArray, id , IsStockedUp , IsCrit , base , randombase, critRate) {
    var Stockitem = StockArray.find((item) => item.id === id);
    var i = StockArray.findIndex(item => item.id == id)
    var Changebase = Math.random() * randombase;
    var CritChangebase = IsCrit * critRate;
    var NewValue =  (Stockitem.value + (IsStockedUp ? 1 : -1) * (base * 1 + Changebase * 1 + CritChangebase * 1));
    if (NewValue < 0) NewValue = 0.01;
    var OldValue = StockArray.at(i).value
    var NumberChange = Math.round(NewValue - OldValue);
    var PercentChange = Math.round((NewValue - OldValue) / OldValue * 100);
    StockArray.at(i).value = (typeof NewValue === 'number' ? parseInt(NewValue.toFixed(2)) : parseInt(NewValue))
    StockArray.at(i).changed = (NumberChange >= 0 ? '+' : '') + (NumberChange.toString()) + "(" + (PercentChange >= 0 ? '+' : '') + (PercentChange.toString()) +"%)";
}
