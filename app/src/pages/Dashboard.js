import React from 'react';
import { Info, Chart, Search } from '../components';
import loadingImage from '../images/preloader.gif';
import { AMMContext } from '../context/context';
const Dashboard = () => {
  const { isLoading } = React.useContext(AMMContext);
  const { chartData } = React.useContext(AMMContext);
  if (isLoading) {
    return (
      <main>
        <Search />
        <img src={loadingImage} className='loading-img' alt='loading' />
      </main>
    );
  }
  return (
    <main>
      <Search />
      <Info />
      <Chart data={chartData} />
    </main>
  );
};



export default Dashboard;
