 // Create new id
export function CreateNewId(data, id, name) {
    data.Players.push(
        {"id": id,
        "Username": name,
        "role": "guest",
        "Coin": 0});
    console.log("new player created")
}

export function AddCoin(data, id, coin) {
    var i = data.Players.findIndex((player) => player.id === id);
    data.Players[i].Coin += coin;
    console.log("add coin ", coin," to ", id," successfully")
}

export function RemoveCoin(data, id, coin) {
    var i = data.Players.findIndex((player) => player.id === id);
    data.Players[i].Coin -= coin;
    console.log("remove coin ", coin," to ", id," successfully")
    return true;
}

export function CheckCoin(data, id, coin) {
    var i = data.Players.findIndex((player) => player.id === id);
    return (data.Players[i].Coin >= coin)
}