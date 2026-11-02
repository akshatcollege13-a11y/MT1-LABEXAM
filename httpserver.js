import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let cart = [
    {
        id: 1,
        productName: "Wireless Mouse",
        price: 799,
        quantity: 2
    },
    {
        id: 2,
        productName: "Keyboard",
        price: 1200,
        quantity: 1
    }
];

const server = http.createServer((req, res) => {
    const { method, url } = req;

    // Welcome route
    if (method === "GET" && url === "/") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h1>Welcome to Shopping Cart</h1>");
    }

    // Get cart items
    else if (method === "GET" && url === "/cart") {
        res.writeHead(200, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify(cart));
    }

    // About route
    else if (method === "GET" && url === "/about") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end("<h1>Shopping Cart Management Application</h1>");
    }

    // Serve HTML using FS module
    else if (method === "GET" && url === "/home") {
        const filePath = path.join(__dirname, "public", "index.html");

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, {
                    "Content-Type": "text/plain"
                });
                res.end("Error reading HTML file");
                return;
            }

            res.writeHead(200, {
                "Content-Type": "text/html"
            });
            res.end(data);
        });
    }

    // Add product to cart
    else if (method === "POST" && url === "/add-to-cart") {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const product = JSON.parse(body);

                if (
                    product.id === undefined ||
                    !product.productName ||
                    typeof product.price !== "number" ||
                    typeof product.quantity !== "number"
                ) {
                    res.writeHead(400, {
                        "Content-Type": "application/json"
                    });
                    res.end(JSON.stringify({
                        message: "Invalid product details"
                    }));
                    return;
                }

                cart.push(product);

                res.writeHead(201, {
                    "Content-Type": "application/json"
                });
                res.end(JSON.stringify({
                    message: "Product added successfully",
                    product
                }));
            } catch {
                res.writeHead(400, {
                    "Content-Type": "application/json"
                });
                res.end(JSON.stringify({
                    message: "Invalid JSON"
                }));
            }
        });
    }

    // Invalid route
    else {
        res.writeHead(404, {
            "Content-Type": "text/plain"
        });
        res.end("404 - Route Not Found");
    }
});

server.listen(3000, () => {
    console.log("HTTP Server running at http://localhost:3000");
});