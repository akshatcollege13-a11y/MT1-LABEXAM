import express from "express";

const app = express();
app.use(express.json());

let cart = [
    {
        id: 1,
        productName: "Wireless Mouse",
        price: 799,
        quantity: 2,
        category: "Electronics"
    },
    {
        id: 2,
        productName: "Keyboard",
        price: 1200,
        quantity: 1,
        category: "Electronics"
    },
    {
        id: 3,
        productName: "Notebook",
        price: 100,
        quantity: 5,
        category: "Stationery"
    }
];

// GET all cart items
app.get("/cart", (req, res) => {
    res.json(cart);
});

// GET cart item by ID
app.get("/cart/:id", (req, res) => {
    const id = Number(req.params.id);
    const product = cart.find(item => item.id === id);

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.json({
        ...product,
        totalPrice: product.price * product.quantity
    });
});

// POST add a product
app.post("/cart", (req, res) => {
    const { id, productName, price, quantity, category } = req.body;

    if (
        id === undefined ||
        !productName ||
        typeof price !== "number" ||
        typeof quantity !== "number" ||
        !category
    ) {
        return res.status(400).json({
            message: "Invalid product details"
        });
    }

    if (cart.some(item => item.id === id)) {
        return res.status(400).json({
            message: "Product ID already exists"
        });
    }

    const product = {
        id,
        productName,
        price,
        quantity,
        category
    };

    cart.push(product);

    res.status(201).json({
        message: "Product added successfully",
        product
    });
});

// PUT update product
app.put("/cart/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = cart.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    const { productName, price, quantity, category } = req.body;

    if (
        !productName ||
        typeof price !== "number" ||
        typeof quantity !== "number" ||
        !category
    ) {
        return res.status(400).json({
            message: "Invalid product details"
        });
    }

    cart[index] = {
        id,
        productName,
        price,
        quantity,
        category
    };

    res.json({
        message: "Product updated successfully",
        product: cart[index]
    });
});

// DELETE product
app.delete("/cart/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = cart.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    const deletedProduct = cart.splice(index, 1);

    res.json({
        message: "Product deleted successfully",
        product: deletedProduct[0]
    });
});

// Invalid routes
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

app.listen(4000, () => {
    console.log("Express Server running at http://localhost:4000");
});