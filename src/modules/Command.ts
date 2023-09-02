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
    {
        name: 'give',
        description: 'โอนเงินให้คนอื่น',
        options: [
            {
                name: 'user',
                description: 'คนที่จะโอนให้',
                type: 6,
                required: true,
            },
            {
                name: 'give_amount',
                description: 'จำนวนเงิน',
                type: 10,
                required: true,
            },
        ]
    },
    {
        name: 'gambling',
        description: 'เปิดโต๊ะพนัน',
        options: [
            {
                name: 'type',
                description: 'เลือกรายการที่ทำ',
                type: 3,
                required: true,
                autocomplete: true,
                choices: [
                    {
                        name: 'dice',
                        value: 'dice',
                    },
                ]
            }
        ]
    },
    {
        name: 'bet',
        description: 'พนันไงน้อง',
        options: [
            {
                name: 'type',
                description: 'เลือกรายการที่ทำ',
                type: 3,
                required: true,
                autocomplete: true,
                choices: [
                    {
                        name: 'high',
                        value: 'high'
                    },
                    {
                        name: 'low',
                        value: 'low'
                    },
                    {
                        name: 'middle',
                        value: 'middle'
                    },
                    {
                        name: 'custom',
                        value: 'custom'
                    },
                ]
            },
            {
                name: 'bet_amount',
                description: 'how much / เท่าไหร่  1000 100 10',
                type: 10,
                required: true,
            },
            {
                name: 'for_custom_number_type',
                description: 'จำนวนเลขลูกเต๋า',
                type: 10,
                required: false,
            },
        ]
    },

];