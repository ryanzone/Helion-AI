const ML_URL = process.env.ML_SERVICE_URL;
const fetch = require("node-fetch");
router.post('/subscribe', async (req, res) => {
    try {
        const { city } = req.body;

        const mlResponse = await fetch(`${ML_URL}/predict`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ city }),
        });

        const mlData = await mlResponse.json();
        const risk = mlData.risk;

        res.json({
            success: true,
            risk,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something failed" });
    }
});