import * as React from "react";

export class TreeNodeModel {
  title: string | React.ReactNode;
  key: string;
  children: TreeNodeModel[];
}
