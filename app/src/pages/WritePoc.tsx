import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Chip, Button, TextField, Divider, IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import LinkIcon from '@mui/icons-material/Link';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { citations, facilities } from '../data/avir-data';
import type { CitationSeverity } from '../data/avir-data';
import { fmtDate } from '../utils/formatDate';

const SEVERITY_STYLES: Record<CitationSeverity, { bg: string; color: string; label: string }> = {
  'IJ':             { bg: '#FEE2E2', color: '#991B1B', label: 'J–Immediate Jeopardy' },
  'Actual Harm':    { bg: '#FFEDD5', color: '#9A3412', label: 'G–Actual Harm' },
  'Potential Harm': { bg: '#FEF9C3', color: '#854D0E', label: 'F–Potential Harm' },
  'No Harm':        { bg: '#F1F5F9', color: '#475569', label: 'C–No Harm' },
};

export default function WritePoc() {
  const { id, citationId } = useParams<{ id: string; citationId: string }>();
  const navigate = useNavigate();

  const citation = citations.find((c) => c.id === citationId);
  const facility = facilities.find((f) => f.id === id);

  const [completionDate, setCompletionDate] = useState('2026-05-31');
  const [response, setResponse] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!citation || !facility) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Citation or facility not found.</Typography>
      </Box>
    );
  }

  const sev = citation.severity ? SEVERITY_STYLES[citation.severity] : SEVERITY_STYLES['Potential Harm'];

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => navigate(`/facility/${id}`), 1500);
  };

  const handleCancel = () => navigate(`/facility/${id}`);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* Page header */}
      <Box sx={{ ml: -3, mt: -3, mb: 0, px: '22px', pt: '17px', pb: '17px', bgcolor: '#f7f8f9', borderBottom: '1px solid #e0e4e7' }}>
        <Box
          onClick={handleCancel}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: '8px', cursor: 'pointer', color: '#5c6874', '&:hover': { color: '#293036' } }}
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          <Typography sx={{ fontSize: '14px', fontWeight: 400, lineHeight: 1.5, letterSpacing: '-0.07px' }}>
            Back to summary
          </Typography>
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: '24px', color: '#293036', letterSpacing: '-0.456px', lineHeight: '32px' }}>
          {facility.name}
        </Typography>
        <Typography sx={{ fontSize: '14px', color: '#5c6874', fontStyle: 'italic', mt: 0.5, mb: 1.5 }}>
          {facility.state} · {facility.region}
        </Typography>
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box>
            <Typography sx={{ fontSize: '12px', color: '#757575', fontWeight: 500 }}>Survey date</Typography>
            <Typography sx={{ fontSize: '14px', color: '#293036' }}>{fmtDate(citation.date)}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '12px', color: '#757575', fontWeight: 500 }}>Surveyor</Typography>
            <Typography sx={{ fontSize: '14px', color: '#293036' }}>{citation.surveyor || '—'}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Two-column body */}
      <Box sx={{ flex: 1, display: 'flex', gap: 0, maxWidth: 1136, mx: 'auto', width: '100%', pt: 3, pb: 10 }}>

        {/* Left panel — read-only detail */}
        <Box sx={{ flex: '0 0 380px', pr: 4 }}>
          <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#293036', mb: 2 }}>
            Observation &amp; Deficiency Detail
          </Typography>

          <Box sx={{ bgcolor: '#F5F5F5', borderRadius: '8px', p: 2 }}>
            {/* Tag + severity */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
              <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#293036', fontFamily: 'monospace' }}>
                {citation.tag}
              </Typography>
              <Chip
                label={sev.label}
                size="small"
                sx={{ bgcolor: sev.bg, color: sev.color, fontWeight: 600, fontSize: '0.7rem', height: 22, borderRadius: '12px', border: `1px solid ${sev.color}33` }}
              />
            </Box>
            {/* Description */}
            <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#293036', mb: 1.5 }}>
              {citation.description}
            </Typography>
            {/* Observation */}
            <Typography sx={{ fontSize: '12px', fontWeight: 500, color: '#757575', mb: 0.5 }}>
              Observation
            </Typography>
            <Typography sx={{ fontSize: '13px', color: '#293036', lineHeight: 1.6 }}>
              {citation.observation || 'No observation text recorded for this citation.'}
            </Typography>
          </Box>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ borderColor: '#e0e4e7' }} />

        {/* Right panel — form */}
        <Box sx={{ flex: 1, pl: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#293036' }}>
            Plan of correction response
          </Typography>

          {/* Completion date */}
          <Box>
            <Typography sx={{ fontSize: '13px', color: '#757575', mb: 0.75 }}>Completion date</Typography>
            <TextField
              type="date"
              value={completionDate}
              onChange={(e) => setCompletionDate(e.target.value)}
              size="small"
              sx={{ width: 180 }}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          {/* Facility Response */}
          <Box>
            <Typography sx={{ fontSize: '13px', color: '#757575', mb: 0.75 }}>Facility Response</Typography>

            {/* Toolbar */}
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 0.25, px: 1, py: 0.5,
              border: '1px solid #d1d5db', borderBottom: '1px solid #e0e4e7',
              borderRadius: '4px 4px 0 0', bgcolor: '#fafafa',
            }}>
              {[
                { icon: <FormatBoldIcon sx={{ fontSize: 18 }} />, label: 'Bold' },
                { icon: <FormatItalicIcon sx={{ fontSize: 18 }} />, label: 'Italic' },
                { icon: <FormatUnderlinedIcon sx={{ fontSize: 18 }} />, label: 'Underline' },
              ].map(({ icon, label }) => (
                <IconButton key={label} size="small" title={label} sx={{ color: '#4b5563', borderRadius: '4px', '&:hover': { bgcolor: '#e5e7eb' } }}>
                  {icon}
                </IconButton>
              ))}
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: 'center' }} />
              {[
                { icon: <FormatListBulletedIcon sx={{ fontSize: 18 }} />, label: 'Bullet list' },
                { icon: <FormatListNumberedIcon sx={{ fontSize: 18 }} />, label: 'Numbered list' },
              ].map(({ icon, label }) => (
                <IconButton key={label} size="small" title={label} sx={{ color: '#4b5563', borderRadius: '4px', '&:hover': { bgcolor: '#e5e7eb' } }}>
                  {icon}
                </IconButton>
              ))}
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 20, alignSelf: 'center' }} />
              <IconButton size="small" title="Link" sx={{ color: '#4b5563', borderRadius: '4px', '&:hover': { bgcolor: '#e5e7eb' } }}>
                <LinkIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>

            <TextField
              multiline
              minRows={7}
              fullWidth
              placeholder="Describe the corrective action the facility will take to correct the deficiency and prevent recurrence…"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '0 0 4px 4px',
                  '& fieldset': { borderColor: '#d1d5db', borderTop: 'none' },
                  '&:hover fieldset': { borderColor: '#9ca3af' },
                  '&.Mui-focused fieldset': { borderColor: '#1565C0' },
                },
              }}
            />
          </Box>

          {/* Attach file */}
          <Box>
            <Typography sx={{ fontSize: '13px', color: '#757575', mb: 0.75 }}>Attach file</Typography>
            <Box
              sx={{
                border: '1.5px dashed #d1d5db', borderRadius: '6px',
                py: 4, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
                cursor: 'pointer', '&:hover': { bgcolor: '#f9fafb', borderColor: '#9ca3af' },
                transition: 'background 0.15s',
              }}
            >
              <InsertDriveFileOutlinedIcon sx={{ fontSize: 36, color: '#9ca3af' }} />
              <Typography sx={{ fontSize: '14px', color: '#374151' }}>
                <Box component="span" sx={{ color: '#1565C0', fontWeight: 500, cursor: 'pointer' }}>Browse files</Box>
                {' '}or drag and drop
              </Typography>
              <Typography sx={{ fontSize: '12px', color: '#9ca3af' }}>PDF, DOC, DOCX (max. 5 MB)</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Footer action bar — pinned bottom */}
      <Box sx={{
        position: 'fixed', bottom: 0, right: 0,
        width: 'calc(100vw - 256px)',
        bgcolor: 'white', borderTop: '1px solid #e0e4e7',
        px: '22px', py: '12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        zIndex: 10,
      }}>
        <Button
          variant="outlined"
          onClick={handleCancel}
          sx={{ borderColor: '#d1d5db', color: '#374151', '&:hover': { borderColor: '#9ca3af', bgcolor: '#f9fafb' }, borderRadius: '6px', fontWeight: 500, px: 3 }}
        >
          Cancel
        </Button>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="text"
            sx={{ color: '#1565C0', fontWeight: 500 }}
          >
            Save as draft
          </Button>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={handleSubmit}
            disabled={submitted}
            sx={{ bgcolor: '#1565C0', color: '#fff', '&:hover': { bgcolor: '#0D47A1' }, borderRadius: '6px', fontWeight: 600, px: 3 }}
          >
            {submitted ? 'Submitted!' : 'Submit'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
