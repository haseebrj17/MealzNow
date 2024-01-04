export const clientData = [
    {
        id: 0,
        name: 'FoodsNow',
        email: "mhabib@foodsnow.co",
        clientId: "c8fbb748-7a15-4d9a-911e-00ef51716956",
        clientFirstName: 'Mealz',
        clientLastName: 'Now',
        maxDistance: 10000,
        distanceRange: {
            fourKm: {
                min: 0,
                max: 4000,
                deliverCharges: 0,
                minOrderValue: 10
            },
            sixKm: {
                min: 4000,
                max: 6000,
                deliverCharges: 1,
                minOrderValue: 20
            },
            tenKm: {
                min: 6000,
                max: 10000,
                deliverCharges: 2,
                minOrderValue: 30
            }
        }
    }
]