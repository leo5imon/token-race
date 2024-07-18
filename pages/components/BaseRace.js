import React, { useState, useEffect } from "react";
import axios from "axios";

const BaseRace = () => {
  const [pairsData, setPairsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPairsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const pairAddressesString = TOKENS.map((token) => token[0]).join(",");
        const response = await axios.get(
          `/api/getCryptoData?chainId=base&pairAddresses=${pairAddressesString}`
        );
        const sortedData = response.data.pairs
          .filter((pair) => pair.fdv)
          .sort((a, b) => parseFloat(b.fdv) - parseFloat(a.fdv))
          .map((pair) => {
            const tokenInfo = TOKENS.find(
              (token) =>
                token[0].toLowerCase() === pair.pairAddress.toLowerCase()
            );
            return {
              ...pair,
              customLogoURI: tokenInfo ? tokenInfo[1] : "",
            };
          });
        setPairsData(sortedData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch pair data");
      } finally {
        setLoading(false);
      }
    };

    fetchPairsData();
  }, []);

  const formatFDV = (fdv) => {
    const value = parseFloat(fdv);
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

  const handleTokenClick = (pairAddress) => {
    window.open(`https://dexscreener.com/base/${pairAddress}`, "_blank");
  };

  if (loading) return <div className="text-center"></div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const maxFDV = Math.max(...pairsData.map((pair) => parseFloat(pair.fdv)));

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <h1 className="text-lg sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center">
        Based Memecoin Race 🔵
      </h1>
      <div className="relative h-[80vh] w-full border-b-2 border-gray-300">
        {pairsData.map((data, index) => {
          const topPosition =
            index === 0 ? 10 : (1 - parseFloat(data.fdv) / maxFDV) * 90 + 10;
          const leftPosition = (index / (pairsData.length - 1)) * 100;
          return (
            <div
              key={data.pairAddress}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ 
                top: `${topPosition}%`, 
                left: `${Math.max(5, Math.min(95, leftPosition))}%` 
              }}
              onClick={() => handleTokenClick(data.pairAddress)}
            >
              <div className="flex flex-col items-center">
                <img
                  src={data.customLogoURI}
                  alt={data.baseToken.symbol}
                  className="w-5 h-5 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full mb-1 sm:mb-2"
                />
                <div className="bg-white p-1 sm:p-2 rounded shadow-md text-center">
                  <p className="font-bold text-[8px] sm:text-xs md:text-sm">
                    {data.baseToken.symbol}
                  </p>
                  <p className="text-[6px] sm:text-xs md:text-sm">
                    {formatFDV(data.fdv)}
                  </p>
                  <p className="text-[6px] sm:text-xs md:text-sm">
                    {formatPriceChange(data.priceChange.h24)}
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

export default BaseRace;
