import axios from 'axios';

export default async function handler(req, res) {
  const { chainId, pairAddresses } = req.query;

  if (!chainId || !pairAddresses) {
    return res.status(400).json({ error: 'Chain ID and Pair Addresses are required' });
  }

  try {
    const response = await axios.get(`https://api.dexscreener.com/latest/dex/pairs/${chainId}/${pairAddresses}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching pair data' });
  }
}