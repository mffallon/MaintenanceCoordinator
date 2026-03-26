import { TreeNode } from './types';
import { facilities } from '../../data/facilities';

// Build hierarchy: Life Care Centers → Division (by state group) → Region → Facility
function buildTree(): TreeNode {
  // Group facilities by region, then state
  const regionMap = new Map<string, typeof facilities>();
  for (const f of facilities) {
    const list = regionMap.get(f.region) || [];
    list.push(f);
    regionMap.set(f.region, list);
  }

  const divisions: TreeNode[] = [];
  const regionNames = [...regionMap.keys()].sort();

  // Create 2 divisions to show hierarchy depth
  const div1Regions = regionNames.slice(0, Math.ceil(regionNames.length / 2));
  const div2Regions = regionNames.slice(Math.ceil(regionNames.length / 2));

  const buildDivision = (name: string, regionKeys: string[]): TreeNode => ({
    id: `div-${name.toLowerCase().replace(/\s/g, '-')}`,
    label: name,
    kind: 'division',
    children: regionKeys.map((rName) => {
      const facs = regionMap.get(rName) || [];
      return {
        id: `reg-${rName.toLowerCase()}`,
        label: `${rName} Region`,
        kind: 'region' as const,
        children: facs
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((f) => ({
            id: f.id,
            label: f.name.replace(/^Life Care Center of /, 'LCC '),
            kind: 'facility' as const,
          })),
      };
    }),
  });

  divisions.push(buildDivision('East Division', div1Regions));
  divisions.push(buildDivision('West Division', div2Regions));

  return {
    id: 'corp-lcc',
    label: 'Life Care Centers of America',
    kind: 'corporation',
    children: divisions,
  };
}

export const communityTree: TreeNode = buildTree();

// --- Helpers ---

export function getLeafIds(node: TreeNode): string[] {
  if (!node.children || node.children.length === 0) return [node.id];
  return node.children.flatMap(getLeafIds);
}

export function findNode(tree: TreeNode, id: string): TreeNode | null {
  if (tree.id === id) return tree;
  if (tree.children) {
    for (const child of tree.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
  }
  return null;
}

export function nodeMatchesSearch(node: TreeNode, query: string): boolean {
  const q = query.toLowerCase();
  if (node.label.toLowerCase().includes(q)) return true;
  if (node.children) return node.children.some((c) => nodeMatchesSearch(c, q));
  return false;
}

export const ALL_LEAF_IDS: string[] = getLeafIds(communityTree);
