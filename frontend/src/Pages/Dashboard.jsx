import React, { use } from 'react'
import { dummyEmployeeDashboardData } from '../assets/dummyData';
import { useState } from 'react';
import { useEffect } from 'react';
import Loading from '../Components/Loading';
import EmployeeDashboard from '../Components/EmployeeDashboard';

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setData(dummyEmployeeDashboardData);
    // Simulate fetching data from an API
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if(loading) {
    return <Loading />;
  }

  if(!data) {
    return <p className='text-center text-slate-500 py-12'>Failed to load dashboard data</p>;
  }

  if(data.role === "Admin") {
    return <div> Admin Dashboard</div>
  }
  else{
    return <EmployeeDashboard data={data} />;
  }

}

export default Dashboard