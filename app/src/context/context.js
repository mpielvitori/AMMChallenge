import React, { useState, useEffect } from 'react';
import axios from 'axios';
const pairsUrl = 'http://localhost';

const AMMContext = React.createContext();

const AMMProvider = ({ children }) => {
  const [chartData, setChartData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ show: false, msg: '' });

  function toggleError(show = false, msg = '') {
    setError({ show, msg });
  }

  const searchContract = async (contract) => {
    toggleError();
    setIsLoading(true);
    const pairsResponse = await axios(
        `${pairsUrl}/api/pairs`,
        { params: { contract } },
      ).catch((err) =>
      console.log(err)
    );
    if (pairsResponse) {
      const chartDataResult = pairsResponse.data.map(pairData => {
        return [Number(pairData.hourStartUnix)*1000, parseFloat(pairData.reserveUSD)]
      });
      setChartData(chartDataResult);
    } else {
      toggleError(true, 'there is no contract with that address');
    }
    setIsLoading(false);
  };
  useEffect(() => {
    searchContract('0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc');
  }, []);
  return (
    <AMMContext.Provider
      value={{
        error,
        isLoading,
        searchContract,
        chartData,
      }}
    >
      {children}
    </AMMContext.Provider>
  );
};
export { AMMProvider, AMMContext };
