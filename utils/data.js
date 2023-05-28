import bcrypt from "bcryptjs";

const data = {
    users : [
        {
            name: "John",
            email: "admin@a.com",
            password: bcrypt.hashSync('123456'),
            isAdmin: true
        },
        {
            name: "Jane",
            email: "jane@a.com",
            password: bcrypt.hashSync('123456'),
            isAdmin: false
        }
    ],
    products:[
        {
            name: "Flower Cross",
            slug: "flower cross1",
            category: "Shirts",
            image: "/images/banner/bg3.jpg",
            price: 70,
            brand: "Ikiguy",
            rating: 4.5,
            numReviews: 8,
            countInStock: 20,
            description: "Hyperbeast brand street wear.",

        },
        {
            name: "Snake Cross2",
            slug: "snake cross2",
            category: "Shirts",
            image: "/images/banner/bg2.jpg",
            price: 50,
            brand: "Ikiguy",
            rating: 5,
            numReviews: 15,
            countInStock: 50,
            description: "Hyperbeast brand street wear.",

        },
        {
            name: "Flower Cross3",
            slug: "flower cross3",
            category: "Shirts",
            image: "/images/banner/bg1.jpg",
            price: 70,
            brand: "Ikiguy",
            rating: 4.5,
            numReviews: 8,
            countInStock: 20,
            description: "Hyperbeast brand street wear.",

        },
        {
            name: "Flower Cross4",
            slug: "flower cross4",
            category: "Shirts",
            image: "/images/wave.png",
            price: 70,
            brand: "Ikiguy",
            rating: 4.5,
            numReviews: 8,
            countInStock: 20,
            description: "Hyperbeast brand street wear.",

        },
        {
            name: "mewwe",
            slug: "mewwe",
            category: "Shirts",
            image: "/images/hoanthanh.png",
            price: 70,
            brand: "Ikiguy",
            rating: 2,
            numReviews: 8,
            countInStock: 20,
            description: "Hyperbeast brand street wear.",

        },
        {
            name: "Nun Cross",
            slug: "nun cross",
            category: "Shirts",
            image: "/images/cross.png",
            price: 70,
            brand: "Ikiguy",
            rating: 3,
            numReviews: 8,
            countInStock: 20,
            description: "Hyperbeast brand street wear.",

        },
    ]
};

export default data;