const express = require("express");
const app = express();
const port = 3000;

const users = require("./MOCK_DATA.json");

// Middleware to parse incoming JSON & URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Home Route
app.get("/", (req, res) => {
        return res.send("Hello World!");
});

// HTML SSR Route (Browser Rendering)
app.get("/users", (req, res) => {
        const html = `
    <html>
        <body>
            <h1>Users List</h1>
            <ul>
                ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
            </ul>
        </body>
    </html>
    `;
        return res.send(html);
});

// REST API: Get All Users & Create New User
app.route("/api/users")
        .get((req, res) => {
                return res.json(users);
        })
        .post((req, res) => {
                // Dynamic user creation logic (e.g. req.body parse karke add karna)
                return res.json({ status: "pending", message: "User creation route" });
        });

// REST API: Dynamic Routes by ID (Chained GET, PATCH, DELETE)
app.route("/api/users/:id")
        .get((req, res) => {
                const id = Number(req.params.id);
                const user = users.find((user) => user.id === id);

                if (!user) {
                        return res.status(404).json({ error: "User not found" });
                }
                return res.json(user);
        })
        .patch((req, res) => {
                const id = Number(req.params.id);
                // User update logic yahan aayega
                return res.json({ status: "pending", id });
        })
        .delete((req, res) => {
                const id = Number(req.params.id);
                // User delete logic yahan aayega
                return res.json({ status: "pending", id });
        });

app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
});