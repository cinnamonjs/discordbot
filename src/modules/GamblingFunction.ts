import { Gambling } from "../type.js";

export function GamblingProfiles(): Gambling {
    const digits = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣'];
    var totalNumber = 0;
    var digit = 0;
    var result: string[] = [];
    for (let i = 0; i < 3; i++) {
        if (i == 1) {
            if (totalNumber < 3) digit = Math.floor(Math.random() * 3) + 2
            if (totalNumber > 3) digit = Math.floor(Math.random() * 3)
        }
        else digit = Math.floor(Math.random() * digits.length)
        result.push(digits[digit])
        totalNumber += (digit + 1);
    }
    return {result: result, total: totalNumber};
}

export function GamblingProfit(totalNumber: number, data: any): number {
    var profit = 0;
    if (typeof data === 'number') {
        if (data === totalNumber) profit = 12
    }
    if (typeof data === 'string') {
        if (data === 'high') if (totalNumber > 9) profit = 2;
        if (data === 'middle') if (totalNumber == 9) profit = 9;
        if (data === 'low') if (totalNumber < 9) profit = 2;
    }
    return profit;
}