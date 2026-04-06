import { TreeNode } from './types';
import { facilities } from '../../data/avir-data';

// Build hierarchy: Avir → Region → Facility
function buildTree(): TreeNode {
  const regionMap = new Map<string, typeof facilities>();
  for (const f of facilities) {
    const list = regionMap.get(f.region) || [];
    list.push(f);
    regionMap.set(f.region, list);
  }

  const regionNodes: TreeNode[] = [...regionMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([region, facs]) => ({
      id: `reg-${region.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      label: region,
      kind: 'region' as const,
      children: facs
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((f) => ({
          id: f.id,
          label: f.name,
          kind: 'facility' as const,
        })),
    }));

  return {
    id: 'corp-avir',
    label: 'Avir',
    kind: 'corporation',
    children: regionNodes,
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
