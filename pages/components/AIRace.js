import React, { useState, useEffect } from "react";
import axios from "axios";

const CMC_KEY = process.env.NEXT_PUBLIC_COINMARKETCAP_API_KEY;
const TOKENS = require('./ai-tokens.json').tokens;

const AIRace = () => {
  const [pairsData, setPairsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPairsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const tokenIDs = TOKENS.map(token => token.id).join(',');
        const response = await axios.get(
          `/api/getCryptoData?tokenID=${tokenIDs}&apiKey=${CMC_KEY}`
        );
        console.log(response.data.data);
        if (typeof response.data.data === 'object') {
          const sortedData = Object.values(response.data.data)
            .filter((coin) => coin.quote.USD.price)
            .sort((a, b) => b.quote.USD.market_cap - a.quote.USD.market_cap)
            .map((coin) => {
              const tokenInfo = TOKENS.find(
                (token) =>
                  token.id.toString().toLowerCase() === coin.id.toString().toLowerCase()
              );
              return {
                ...coin,
                customLogoURI: tokenInfo ? tokenInfo.logo : "",
              };
            });
          setPairsData(sortedData);
        } else {
          console.error("Response data is not an object");
          setError("Failed to fetch pair data");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch pair data");
      } finally {
        setLoading(false);
      }
    };

    fetchPairsData();
  }, []);

  const formatMarketCap = (marketCap) => {
    const value = parseFloat(marketCap);
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  };

  const formatPriceChange = (priceChange) => {
    const value = parseFloat(priceChange);
    const sign = value > 0 ? "+" : "";
    const color = value >= 0 ? "text-green-500" : "text-red-500";
    return <span className={color}>{`${sign}${value.toFixed(2)}%`}</span>;
  };

  const handleTokenClick = (slug) => {
    window.open(`https://coinmarketcap.com/fr/currencies/${slug}`, "_blank");
  };

  if (loading) return <div className="text-center"></div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const maxMarketCap = Math.max(...pairsData.map((coin) => parseFloat(coin.quote.USD.market_cap)));

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <h1 className="text-lg sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center">
        AI Tokens Race 🤖
      </h1>
      <div className="relative h-[80vh] w-full border-b-2 border-gray-300">
        {pairsData.map((data, index) => {
          const topPosition =
            index === 0 ? 10 : (1 - parseFloat(data.quote.USD.market_cap) / maxMarketCap) * 90 + 10;
          const leftPosition = (index / (pairsData.length - 1)) * 100;
          return (
            <div
              key={data.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ 
                top: `${topPosition}%`, 
                left: `${Math.max(5, Math.min(95, leftPosition))}%` 
              }}
              onClick={() => handleTokenClick(data.slug)}
            >
              <div className="flex flex-col items-center">
                <img
                  src={data.customLogoURI}
                  alt={data.name}
                  className="w-5 h-5 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full mb-1 sm:mb-2"
                />
                <div className="bg-white p-1 sm:p-2 rounded shadow-md text-center">
                  <p className="font-bold text-[8px] sm:text-xs md:text-sm">
                    {data.symbol}
                  </p>
                  <p className="text-[6px] sm:text-xs md:text-sm">
                    {formatMarketCap(data.quote.USD.market_cap)}
                  </p>
                  <p className="text-[6px] sm:text-xs md:text-sm">
                    {formatPriceChange(data.quote.USD.percent_change_24h)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIRace;
