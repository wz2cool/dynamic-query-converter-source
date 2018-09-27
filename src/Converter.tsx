import * as React from "react";
import { Button, Input, Tabs, Tree, message } from "antd";
import { DynamicQuery } from "ts-dynamic-query";
import { ObjectUtils, StringUtils, ArrayUtils } from "ts-commons";

const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const TreeNode = Tree.TreeNode;

import "./Converter.scss";
import { TreeNodeModel } from "./model/TreeNodeModel";

interface ConverterState {
  inputQueryValue: string;
  treeNodes: TreeNodeModel[];
}

class Converter extends React.Component<{}, ConverterState> {
  constructor(props: any) {
    super(props);
    this.state = {
      inputQueryValue: "",
      treeNodes: []
    };
  }

  render() {
    return (
      <div className="converter">
        <div className="left-area">
          <div className="header">
            <Button type="primary" onClick={() => this.convert()}>
              Convert
            </Button>
          </div>
          <div className="content">
            <TextArea
              placeholder="query json"
              value={this.state.inputQueryValue}
              className="input-query"
              onChange={e => this.inputQueryOnChange(e)}
            />
          </div>
        </div>
        <div className="right-area">
          <Tabs defaultActiveKey="1">
            <TabPane tab="JSON Tree" key="1">
              <Tree>
                {/* <TreeNode title="parent 1" key="0-0">
                  <TreeNode title="parent 1-0" key="0-0-0">
                    <TreeNode title="leaf" key="0-0-0-0" />
                    <TreeNode title="leaf" key="0-0-0-1" />
                  </TreeNode>
                  <TreeNode title="parent 1-1" key="0-0-1">
                    <TreeNode title="sss" key="0-0-1-0" />
                  </TreeNode>
                </TreeNode> */}
                {this.renderNode(this.state.treeNodes)}
              </Tree>
            </TabPane>
            <TabPane tab="Tab 2" key="2">
              Content of Tab Pane 2
            </TabPane>
          </Tabs>
          ,
        </div>
      </div>
    );
  }

  private renderNode = (treeNodes: TreeNodeModel[]): JSX.Element[] => {
    return treeNodes.map(node => (
      <TreeNode title={node.title} key={node.key}>
        {ArrayUtils.isEmpty(node.children)
          ? undefined
          : this.renderNode(node.children)}
      </TreeNode>
    ));
  };

  private inputQueryOnChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    this.setState({
      inputQueryValue: e.target.value
    });
  }

  private convert(): void {
    try {
      const query = this.state.inputQueryValue;
      const dynamicQuery = DynamicQuery.createInstance().fromJSON(query);
      const treeNodes = this.generateTreeNodes(dynamicQuery);
      console.log(treeNodes);
      this.setState({
        treeNodes: treeNodes
      });
    } catch (e) {
      message.error("Can't convert current query json.");
    }
  }

  private generateTreeNodes(dynamicQuery: DynamicQuery<any>): TreeNodeModel[] {
    if (ObjectUtils.isNullOrUndefined(dynamicQuery)) {
      return [];
    }
    const result: TreeNodeModel[] = [];
    const filterNode = new TreeNodeModel();
    filterNode.title = "filters";
    filterNode.key = StringUtils.newGuid();
    const sortNode = new TreeNodeModel();
    sortNode.title = "sorts";
    sortNode.key = StringUtils.newGuid();
    result.push(filterNode);
    result.push(sortNode);

    return result;
  }
}
export default Converter;
