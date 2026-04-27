import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme/theme';
import { CommunityProvider } from './components/CommunityFilter';
import AppLayout from './components/AppLayout';
import CitationsDashboard from './pages/CitationsDashboard';
import FacilityDetail from './pages/FacilityDetail';
import CitationHistory from './pages/CitationHistory';
import SurveyManagement from './pages/SurveyManagement';
import SurveyPrepDetail from './pages/SurveyPrepDetail';
import Facilities from './pages/Facilities';
import CitationsRemix from './pages/CitationsRemix';
import TagTypeDetail from './pages/TagTypeDetail';
import TagDetail from './pages/TagDetail';
import Trends from './pages/Trends';
import POCManagement from './pages/POCManagement';
import WritePoc from './pages/WritePoc';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CommunityProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<CitationsDashboard />} />
              <Route path="/citations" element={<CitationHistory />} />
              <Route path="/surveys" element={<SurveyManagement />} />
              <Route path="/surveys/:facilityId" element={<FacilityDetail />} />
              <Route path="/facility/:id" element={<FacilityDetail />} />
              <Route path="/facility/:id/poc/:citationId" element={<WritePoc />} />
              <Route path="/facilities" element={<Facilities />} />
            <Route path="/citations-remix" element={<CitationsRemix />} />
              <Route path="/citations-remix/tags/:type" element={<TagTypeDetail />} />
              <Route path="/citations-remix/tags/:type/:tag" element={<TagDetail />} />
              <Route path="/trends" element={<Trends />} />
              <Route path="/poc" element={<POCManagement />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CommunityProvider>
    </ThemeProvider>
  );
}
