import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme/theme';
import AppLayout from './components/AppLayout';
import CitationsDashboard from './pages/CitationsDashboard';
import FacilityDetail from './pages/FacilityDetail';
import CitationHistory from './pages/CitationHistory';
import SurveyManagement from './pages/SurveyManagement';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<CitationsDashboard />} />
            <Route path="/citations" element={<CitationHistory />} />
            <Route path="/surveys" element={<SurveyManagement />} />
            <Route path="/facility/:id" element={<FacilityDetail />} />
            <Route path="/facilities" element={<CitationsDashboard />} />
            <Route path="/analytics" element={<CitationsDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
