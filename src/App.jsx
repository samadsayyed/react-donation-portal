import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import DonationHome from "./pages/donation-portal/home";
import Checkout from "./pages/donation-portal/checkout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./components/AppContext";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import NotFound from "./components/NotFound";

function App() {
  const queryClient = new QueryClient();
  const params = useParams();

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Router>
          <Toaster />
          <Routes>
            <Route path="/" element={<Navigate to="/donation-portal" />} />
            <Route path="/donation-portal" element={<DonationHome />} />
            <Route path="/donation-portal/checkout" element={<Checkout />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
