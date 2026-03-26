export interface TreeNode {
  id: string;
  label: string;
  kind: 'corporation' | 'division' | 'region' | 'facility';
  children?: TreeNode[];
}
