// Define your slash command
export const commands = [
    {
        name: 'stock',
        description: 'See stock board',
    },
    {
        name: 'test',
        description: 'beta test',
    },
    {
        name: 'me',
        description: 'show information about yourself',
    },
    {
        name: 'graph',
        description: 'show graph with stock board',
    },
    {
        name: 'buy',
        description: 'buy stock / ซื้อหุ้น',
        options: [
            {
                name: 'stock_id',
                description: 'stock id / รหัสหุ่น "btc" "rtx" "crn" etc.',
                type: 3,
                required: true,
            },
            {
                name: 'buy_amount',
                description: 'how much / เท่าไหร่   1000 100 10',
                type: 10,
                required: true,
            },
        ],
    },
    {
        name: 'sell',
        description: 'sell stock / ขายหุ้น',
        options: [
            {
                name: 'stock_id',
                description: 'stock id / รหัสหุ่น "btc" "rtx" "crn" etc.',
                type: 3,
                required: true,
            },
            {
                name: 'sell_amount',
                description: 'how much / เท่าไหร่ 1000 100 10',
                type: 10,
                required: true,
            },
        ],
    },
];