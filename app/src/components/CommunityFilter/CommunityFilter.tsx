import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import {
  Box, Popover, Typography, Checkbox, InputBase, IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TreeNode } from './types';
import { communityTree, getLeafIds, nodeMatchesSearch, ALL_LEAF_IDS } from './treeData';
import { useCommunityFilter } from './CommunityContext';

// ─── Display label logic ────────────────────────────────────────
function getDisplayLabel(checked: Set<string> | null, tree: TreeNode): string {
  if (!checked || checked.size === ALL_LEAF_IDS.length) return 'All Communities';
  if (checked.size === 0) return 'None selected';
  const checkedSet = checked;

  // Check top-level groups first
  const fullySelected: string[] = [];
  let accountedFor = 0;

  function checkGroup(node: TreeNode): boolean {
    const leaves = getLeafIds(node);
    if (leaves.every((l) => checkedSet.has(l))) {
      fullySelected.push(node.label);
      accountedFor += leaves.length;
      return true;
    }
    return false;
  }

  // Walk children of root
  if (tree.children) {
    for (const div of tree.children) {
      if (checkGroup(div)) continue;
      if (div.children) {
        for (const reg of div.children) {
          if (checkGroup(reg)) continue;
        }
      }
    }
  }

  const remainder = checkedSet.size - accountedFor;

  if (fullySelected.length === 0) {
    // Just leaf selections
    if (checkedSet.size === 1) {
      // Find label
      const id = [...checkedSet][0];
      const find = (n: TreeNode): string | null => {
        if (n.id === id) return n.label;
        if (n.children) for (const c of n.children) { const r = find(c); if (r) return r; }
        return null;
      };
      return find(tree) || `${checkedSet.size} items selected`;
    }
    return `${checkedSet.size} items selected`;
  }

  if (remainder === 0) return fullySelected.join(', ');
  return `${fullySelected.join(', ')} + ${remainder} items`;
}

// ─── TreeRow (recursive) ────────────────────────────────────────
interface TreeRowProps {
  node: TreeNode;
  depth: number;
  checked: Set<string>;
  onToggle: (node: TreeNode) => void;
  expanded: Set<string>;
  onExpand: (id: string) => void;
  searchQuery: string;
}

function TreeRow({ node, depth, checked, onToggle, expanded, onExpand, searchQuery }: TreeRowProps) {
  const isLeaf = !node.children || node.children.length === 0;
  const isExpanded = expanded.has(node.id);
  const leafIds = useMemo(() => getLeafIds(node), [node]);
  const checkedCount = leafIds.filter((l) => checked.has(l)).length;
  const isChecked = checkedCount === leafIds.length;
  const isIndeterminate = checkedCount > 0 && checkedCount < leafIds.length;

  // Hide if search doesn't match
  if (searchQuery && !nodeMatchesSearch(node, searchQuery)) return null;

  const isBold = depth < 2; // corporation + division levels bold

  return (
    <>
      <Box
        onClick={(e) => {
          e.stopPropagation();
          onToggle(node);
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          pl: `${4 + depth * 20}px`,
          pr: 1,
          py: 0.5,
          cursor: 'pointer',
          borderRadius: '4px',
          '&:hover': { bgcolor: 'rgba(41,48,54,0.05)' },
          minHeight: 36,
        }}
      >
        {/* Expand/collapse chevron */}
        {!isLeaf ? (
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); onExpand(node.id); }}
            sx={{ width: 24, height: 24, mr: 0.25, color: '#5c6874' }}
          >
            {isExpanded ? <ExpandMoreIcon sx={{ fontSize: 18 }} /> : <ChevronRightIcon sx={{ fontSize: 18 }} />}
          </IconButton>
        ) : (
          <Box sx={{ width: 24, mr: 0.25 }} />
        )}

        <Checkbox
          size="small"
          checked={isChecked}
          indeterminate={isIndeterminate}
          onClick={(e) => e.stopPropagation()}
          onChange={() => onToggle(node)}
          sx={{
            p: 0.5,
            color: '#a2adb8',
            '&.Mui-checked': { color: '#0065bd' },
            '&.MuiCheckbox-indeterminate': { color: '#0065bd' },
          }}
        />

        <Typography
          sx={{
            fontSize: '0.875rem',
            fontWeight: isBold ? 600 : 400,
            color: '#293036',
            ml: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {node.label}
        </Typography>
      </Box>

      {/* Children */}
      {!isLeaf && isExpanded && node.children!.map((child) => (
        <TreeRow
          key={child.id}
          node={child}
          depth={depth + 1}
          checked={checked}
          onToggle={onToggle}
          expanded={expanded}
          onExpand={onExpand}
          searchQuery={searchQuery}
        />
      ))}
    </>
  );
}

// ─── Main Component ─────────────────────────────────────────────
export default function CommunityFilter() {
  const { checkedLeaves, setCheckedLeaves, isAllSelected } = useCommunityFilter();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['corp-avir']));
  const anchorRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const displayLabel = useMemo(
    () => getDisplayLabel(checkedLeaves, communityTree),
    [checkedLeaves],
  );

  // Auto-expand matching nodes on search
  useEffect(() => {
    if (!searchQuery) return;
    const toExpand = new Set(expanded);
    const walk = (node: TreeNode) => {
      if (node.children) {
        if (nodeMatchesSearch(node, searchQuery)) toExpand.add(node.id);
        node.children.forEach(walk);
      }
    };
    walk(communityTree);
    setExpanded(toExpand);
  }, [searchQuery]);

  // Focus search on open
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 100);
  }, [open]);

  const handleToggle = useCallback((node: TreeNode) => {
    const leafIds = getLeafIds(node);

    // If currently null (all selected), start from full set
    const current = checkedLeaves === null ? new Set(ALL_LEAF_IDS) : new Set(checkedLeaves);

    const allChecked = leafIds.every((l) => current.has(l));
    if (allChecked) {
      leafIds.forEach((l) => current.delete(l));
    } else {
      leafIds.forEach((l) => current.add(l));
    }

    // If all re-selected, go back to null (no filter)
    if (current.size === ALL_LEAF_IDS.length) {
      setCheckedLeaves(null);
    } else {
      // Otherwise keep the explicit set (even if empty = nothing selected)
      setCheckedLeaves(current);
    }
  }, [checkedLeaves, setCheckedLeaves]);

  const handleExpand = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckedLeaves(null);
  };

  return (
    <>
      {/* Trigger */}
      <Box
        ref={anchorRef}
        onClick={() => setOpen(true)}
        sx={{
          position: 'relative',
          width: 280,
          minHeight: 48,
          bgcolor: '#FFFFFF',
          borderRadius: '4px 4px 0 0',
          borderBottom: open ? '2px solid #0065bd' : '1px solid rgba(41,48,54,0.42)',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: 1.5,
          py: 0.5,
          transition: 'border-bottom 0.15s',
          '&:hover': { borderBottomColor: open ? '#0065bd' : '#293036' },
        }}
      >
        {/* Floating label */}
        <Typography
          sx={{
            fontSize: 12,
            color: open ? '#0065bd' : '#525f6c',
            lineHeight: '16px',
            transition: 'color 0.15s',
          }}
        >
          Communities
        </Typography>

        {/* Value + icons row */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography
            sx={{
              fontSize: 16,
              color: '#293036',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
              lineHeight: '22px',
            }}
          >
            {displayLabel}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', ml: 0.5, gap: 0.25 }}>
            {!isAllSelected && (
              <IconButton size="small" onClick={handleClear} sx={{ p: 0.25, color: '#5c6874' }}>
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            )}
            <KeyboardArrowDownIcon
              sx={{
                fontSize: 22,
                color: '#5c6874',
                transition: 'transform 0.2s',
                transform: open ? 'rotate(180deg)' : 'none',
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Popover */}
      <Popover
        open={open}
        onClose={() => { setOpen(false); setSearchQuery(''); }}
        anchorEl={anchorRef.current}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              width: anchorRef.current?.offsetWidth || 280,
              maxHeight: 440,
              mt: 0.25,
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        {/* Search bar */}
        <Box
          sx={{
            px: 1.5,
            py: 1,
            borderBottom: '1px solid #e0e4e7',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#f0f2f4',
              borderRadius: '20px',
              px: 1.5,
              py: 0.5,
            }}
          >
            <SearchIcon sx={{ fontSize: 20, color: '#5c6874', mr: 0.75 }} />
            <InputBase
              inputRef={searchRef}
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                flex: 1,
                fontSize: '0.875rem',
                color: '#293036',
                '& input::placeholder': { color: '#5c6874', opacity: 1 },
              }}
            />
            {searchQuery && (
              <IconButton size="small" onClick={() => setSearchQuery('')} sx={{ p: 0.25 }}>
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Tree list */}
        <Box
          sx={{
            overflowY: 'auto',
            flex: 1,
            py: 0.5,
            px: 0.5,
          }}
        >
          <TreeRow
            node={communityTree}
            depth={0}
            checked={checkedLeaves === null ? new Set(ALL_LEAF_IDS) : checkedLeaves}
            onToggle={handleToggle}
            expanded={expanded}
            onExpand={handleExpand}
            searchQuery={searchQuery}
          />

        </Box>
      </Popover>
    </>
  );
}
