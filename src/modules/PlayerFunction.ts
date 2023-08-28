import { UserData } from "../type.js";

// Create new id
export function CreateNewId(data: UserData, id: string, name: string) {
    data.Players.push(
        {"id": id,
        "Username": name,
        "role": "guest",
        "Coin": 0});
    console.log("new player created")
}

export function AddCoin(data: UserData, id: string, coin: number) {
    var i = data.Players.findIndex((player) => player.id === id);
    data.Players[i].Coin += coin;
    console.log("add coin ", coin," to ", id," successfully")
}

export function RemoveCoin(data: UserData, id: string, coin: number) {
    var i = data.Players.findIndex((player) => player.id === id);
    data.Players[i].Coin -= coin;
    console.log("remove coin ", coin," to ", id," successfully")
    return true;
}

export function CheckCoin(data: UserData, id: string, coin: number) {
    var i = data.Players.findIndex((player) => player.id === id);
    return (data.Players[i].Coin >= coin)
}