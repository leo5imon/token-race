import React, { useState, useEffect } from "react";
import axios from "axios";

const TOKENS = [
  [
    "0xb08a99ab559e5456907278727a3b0d968c0a313b",
    "https://dd.dexscreener.com/ds-data/tokens/base/0xe3086852a4b125803c815a158249ae468a3254ca.png?key=df6600",
  ], //MFER
  [
    "0xfcc89a1f250d76de198767d33e1ca9138a7fb54b",
    "https://dd.dexscreener.com/ds-data/tokens/base/0xf6e932ca12afa26665dc4dde7e27be02a7c02e50.png?key=abadd9",
  ], //MOCHI
  [
    "0xd82403772cb858219cfb58bfab46ba7a31073474",
    "https://dd.dexscreener.com/ds-data/tokens/base/0x9a26f5433671751c3276a065f57e5a02d2817973.png?key=1f0848",
  ], //KEYCAT
  [
    "0xd95bae63641d822dc591bd4aca7a64e53eac76f9",
    "https://dd.dexscreener.com/ds-data/tokens/base/0xebff2db643cf955247339c8c6bcd8406308ca437.png?key=202f69",
  ], //CHOMP
  [
    "0x16905890a1d02b6f824387419319bf4188b961b0",
    "https://dd.dexscreener.com/ds-data/tokens/base/0xbc45647ea894030a4e9801ec03479739fa2485f0.png?key=951e75",
  ], //BENJI
  [
    "0x4b0aaf3ebb163dd45f663b38b6d93f6093ebc2d3",
    "https://dd.dexscreener.com/ds-data/tokens/base/0xac1bd2486aaf3b5c0fc3fd868558b082a531b2b4.png?key=c5e053",
  ], //TOSHI
  [
    "0xba3f945812a83471d709bce9c3ca699a19fb46f7",
    "https://dd.dexscreener.com/ds-data/tokens/base/0x532f27101965dd16442e59d40670faf5ebb142e4.png?key=7c7843",
  ], //BRETT
  [
    "0xc9034c3e7f58003e6ae0c8438e7c8f4598d5acaa",
    "https://dd.dexscreener.com/ds-data/tokens/base/0x4ed4e862860bed51a9570b96d89af5e1b0efefed.png?key=e17c44",
  ], //DEGEN
  [
    "0xcc28456d4ff980cee3457ca809a257e52cd9cdb0",
    "https://dd.dexscreener.com/ds-data/tokens/base/0x0578d8a44db98b23bf096a382e016e29a5ce0ffe.png?key=53aa1f",
  ], //HIGHER
  [
    "0xff5375bd65056dbe6119256fc3be2eb0ffa8a840",
    "https://dd.dexscreener.com/ds-data/tokens/base/0x18a8bd1fe17a1bb9ffb39ecd83e9489cfd17a022.png?key=8be4dd",
  ], //ANDY
];

const TokenRace = () => {
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

export default TokenRace;
