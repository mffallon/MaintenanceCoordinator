import {
  Drawer, Box, Typography, Chip, IconButton, Divider, Paper, Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { Citation } from '../types';
import { fmtDate } from '../utils/formatDate';

interface Props {
  citation: Citation | null;
  onClose: () => void;
  facilityName?: string;
  facilityCity?: string;
  facilityState?: string;
}

const severityChip = (sev: string) => {
  const map: Record<string, { bg: string; color: string }> = {
    'IJ': { bg: '#FEE2E2', color: '#991B1B' },
    'Actual Harm': { bg: '#FED7AA', color: '#9A3412' },
    'Potential Harm': { bg: '#FEF9C3', color: '#854D0E' },
    'No Harm': { bg: '#E2E8F0', color: '#475569' },
  };
  const s = map[sev] || map['No Harm'];
  return <Chip label={sev} size="small" sx={{ bgcolor: s.bg, color: s.color, fontWeight: 600 }} />;
};

export default function CitationDetailDrawer({ citation, onClose, facilityName, facilityCity, facilityState }: Props) {
  if (!citation) return null;

  return (
    <Drawer
      anchor="right"
      open={!!citation}
      onClose={onClose}
      sx={{ zIndex: (t) => t.zIndex.drawer + 2 }}
      PaperProps={{ sx: { width: 420, p: 0 } }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ p: 2.5, bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Chip label={citation.tag} variant="outlined" sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '1rem' }} />
            <IconButton size="small" onClick={onClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#293036', mb: 0.5 }}>
            {citation.description}
          </Typography>
          <Typography variant="caption" color="text.secondary">{citation.category}</Typography>
          {facilityName && (
            <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid #E2E8F0' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#0065BD' }}>{facilityName}</Typography>
              {facilityCity && <Typography variant="caption" color="text.secondary">{facilityCity}, {facilityState}</Typography>}
            </Box>
          )}
        </Box>

        {/* Body */}
        <Box sx={{ p: 2.5, flexGrow: 1, overflowY: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
            {[
              ['Severity', citation.severity],
              ['Scope', citation.scope],
              ['Status', citation.status],
              ['Survey Type', citation.surveyType],
              ['Survey Date', fmtDate(citation.surveyDate)],
            ].map(([label, value]) => (
              <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">{label}</Typography>
                {label === 'Severity' ? severityChip(value) :
                 label === 'Status' ? (
                  <Chip label={value} size="small" sx={{
                    fontWeight: 600,
                    bgcolor: value === 'Corrected' ? '#BBF7D0' : value === 'Open' ? '#FEE2E2' : value === 'Has Plan' ? '#DBEAFE' : '#F1F5F9',
                    color: value === 'Corrected' ? '#166534' : value === 'Open' ? '#991B1B' : value === 'Has Plan' ? '#1E40AF' : '#475569',
                  }} />
                 ) : (
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{value}</Typography>
                 )}
              </Box>
            ))}
          </Box>

          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Documentation Gaps</Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
            <Chip label={citation.documentationGaps.tasks ? 'Tasks — Missing' : 'Tasks — OK'}
              size="small" sx={{
                bgcolor: citation.documentationGaps.tasks ? '#FEE2E2' : '#DCFCE7',
                color: citation.documentationGaps.tasks ? '#991B1B' : '#166534',
                fontWeight: 600,
              }} />
            <Chip label={citation.documentationGaps.logs ? 'Logs — Missing' : 'Logs — OK'}
              size="small" sx={{
                bgcolor: citation.documentationGaps.logs ? '#FEF9C3' : '#DCFCE7',
                color: citation.documentationGaps.logs ? '#854D0E' : '#166534',
                fontWeight: 600,
              }} />
            <Chip label={citation.documentationGaps.docs ? 'Docs — Missing' : 'Docs — OK'}
              size="small" sx={{
                bgcolor: citation.documentationGaps.docs ? '#E0E7FF' : '#DCFCE7',
                color: citation.documentationGaps.docs ? '#3730A3' : '#166534',
                fontWeight: 600,
              }} />
          </Box>

          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Resolution Steps</Typography>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '8px', mb: 3 }}>
            <Typography variant="body2" sx={{ color: '#293036', lineHeight: 1.6 }}>
              {citation.resolutionSteps}
            </Typography>
          </Paper>

          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Prevention Strategies</Typography>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '8px' }}>
            <Typography variant="body2" sx={{ color: '#293036', lineHeight: 1.6 }}>
              {citation.preventionStrategies}
            </Typography>
          </Paper>
        </Box>

        {/* Footer actions */}
        <Box sx={{ p: 2, borderTop: '1px solid #E2E8F0', display: 'flex', gap: 1 }}>
          <Button size="small" startIcon={<CloseIcon />} variant="text" color="inherit" onClick={onClose}>Close</Button>
          <Button size="small" startIcon={<AddTaskIcon />} sx={{ flex: 1 }}>Create Task</Button>
        </Box>
      </Box>
    </Drawer>
  );
}
