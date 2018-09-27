export class TreeNodeModel {
  title: string;
  key: string;
  children: TreeNodeModel[];

  constructor() {
    this.children = [];
  }
}
