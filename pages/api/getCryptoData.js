import axios from 'axios';

export default async function handler(req, res) {
  const { tokenID, apiKey } = req.query;

  if (!apiKey) {
    return res.status(401).json({ error: 'API Key is required' });
  }

  try {
    const response = await axios.get(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${tokenID}`, {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
      },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching pair data' });
  }
}