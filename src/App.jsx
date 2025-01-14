import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import DonationHome from './pages/donation-portal/home';
import Checkout from './pages/donation-portal/checkout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from './components/AppContext';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

function App() {
  const queryClient = new QueryClient();
  const params = useParams();



  return (
    <QueryClientProvider client={queryClient}>
      {/* Wrap the entire app with the AppProvider */}
      <AppProvider>
        <Router>
          <Toaster/>
          <Routes>
            {/* <Route path="/" element={<DonationHome />}></Route> */}
            <Route path="/" element={<Navigate   to="/donation-portal?samad=d" />} />
            <Route path="/donation-portal" element={<DonationHome />} />
            <Route path="/donation-portal/checkout" element={<Checkout/>} />

          </Routes>
        </Router>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
