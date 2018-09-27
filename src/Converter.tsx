import * as React from "react";
import * as _ from "lodash";
import { Button, Input, Tabs, Tree, message } from "antd";
import {
  DynamicQuery,
  FilterDescriptorBase,
  FilterDescriptor,
  SortDescriptor,
  FilterCondition,
  FilterOperator,
  FilterGroupDescriptor
} from "ts-dynamic-query";
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
              <Tree>{this.renderNode(this.state.treeNodes)}</Tree>
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
    if (!ArrayUtils.isEmpty(dynamicQuery.filters)) {
      const filterNode = new TreeNodeModel();
      filterNode.title = this.getPropertyOfDynamicQuery("filters");
      filterNode.key = StringUtils.newGuid();
      filterNode.children = _.map(dynamicQuery.filters, x =>
        this.generateTreeNodesByFilter(x)
      );
      result.push(filterNode);
    }

    const sortNode = new TreeNodeModel();
    sortNode.title = this.getPropertyOfDynamicQuery("sorts");
    sortNode.key = StringUtils.newGuid();

    result.push(sortNode);

    return result;
  }

  private generateTreeNodesByFilter(
    filter: FilterDescriptorBase
  ): TreeNodeModel {
    let result: TreeNodeModel = undefined;
    if (filter instanceof FilterDescriptor) {
      const filterDescriptorNode = new TreeNodeModel();
      filterDescriptorNode.title = (
        <span className="tree-title">FilterDescriptor</span>
      );
      filterDescriptorNode.key = StringUtils.newGuid();
      filterDescriptorNode.children = [];

      const conditionNode = new TreeNodeModel();
      conditionNode.title = (
        <span>
          <span className="tree-title">condition: </span>
          <span className="tree-content">
            {FilterCondition[filter.condition]}
          </span>
        </span>
      );
      conditionNode.key = StringUtils.newGuid();
      const propertyPathNode = new TreeNodeModel();
      propertyPathNode.title = (
        <span>
          <span className="tree-title">propertyPath: </span>
          <span className="tree-content">{filter.propertyPath}</span>
        </span>
      );
      propertyPathNode.key = StringUtils.newGuid();
      const operatorNode = new TreeNodeModel();
      operatorNode.title = (
        <span>
          <span className="tree-title">operator: </span>
          <span className="tree-content">
            {FilterOperator[filter.operator]}
          </span>
        </span>
      );
      operatorNode.key = StringUtils.newGuid();
      const valueNode = new TreeNodeModel();
      valueNode.title = (
        <span>
          <span className="tree-title">value: </span>
          <span className="tree-content">{filter.value.toString()}</span>
        </span>
      );
      valueNode.key = StringUtils.newGuid();
      const ignoreCaseNode = new TreeNodeModel();
      ignoreCaseNode.title = (
        <span>
          <span className="tree-title">ignoreCase: </span>
          <span className="tree-content">{filter.ignoreCase.toString()}</span>
        </span>
      );
      ignoreCaseNode.key = StringUtils.newGuid();
      filterDescriptorNode.children.push(conditionNode);
      filterDescriptorNode.children.push(propertyPathNode);
      filterDescriptorNode.children.push(operatorNode);
      filterDescriptorNode.children.push(valueNode);
      filterDescriptorNode.children.push(ignoreCaseNode);
      result = filterDescriptorNode;
    } else if (filter instanceof FilterGroupDescriptor) {
      const filterGroupDescriptor = new TreeNodeModel();
      filterGroupDescriptor.title = (
        <span className="tree-title">FilterGroupDescriptor</span>
      );
      filterGroupDescriptor.key = StringUtils.newGuid();
      filterGroupDescriptor.children = [];

      const conditionNode = new TreeNodeModel();
      conditionNode.title = (
        <span>
          <span className="tree-title">condition: </span>
          <span className="tree-content">
            {FilterCondition[filter.condition]}
          </span>
        </span>
      );
      conditionNode.key = StringUtils.newGuid();
      filterGroupDescriptor.children.push(conditionNode);

      if (!ArrayUtils.isEmpty(filter.filters)) {
        const filtersNode = new TreeNodeModel();
        filtersNode.title = (
          <span className="tree-title">
            {this.getPropertyOfFilterGroupDescriptor("filters")}
          </span>
        );
        filtersNode.key = StringUtils.newGuid();
        filtersNode.children = _.map(filter.filters, x =>
          this.generateTreeNodesByFilter(x)
        );
        filterGroupDescriptor.children.push(filtersNode);
      }
      result = filterGroupDescriptor;
    }

    return result;
  }

  private getPropertyOfDynamicQuery(key: keyof DynamicQuery<any>): string {
    return key.toString();
  }

  private getPropertyOfFilterDescriptor(
    key: keyof FilterDescriptor<any>
  ): string {
    return key.toString();
  }

  private getPropertyOfFilterGroupDescriptor(
    key: keyof FilterGroupDescriptor<any>
  ): string {
    return key.toString();
  }

  private getPropertyOfSortDescriptor(key: keyof SortDescriptor<any>): string {
    return key.toString();
  }
}
export default Converter;
