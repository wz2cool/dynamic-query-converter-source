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
  FilterGroupDescriptor,
  SortDescriptorBase,
  SortDirection
} from "ts-dynamic-query";
import { ObjectUtils, StringUtils, ArrayUtils } from "ts-commons";

const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const TreeNode = Tree.TreeNode;

import "./Converter.scss";
import { TreeNodeModel } from "./model/TreeNodeModel";

interface ConverterState {
  inputQueryValue: string;
  jsonTreeNodes: TreeNodeModel[];
  expressionTreeNodes: TreeNodeModel[];
}

class Converter extends React.Component<{}, ConverterState> {
  constructor(props: any) {
    super(props);
    this.state = {
      inputQueryValue: `{"filters":[{"condition":0,"type":"FilterGroupDescriptor","filters":[{"condition":1,"type":"FilterDescriptor","operator":2,"propertyPath":"tradingStatus","ignoreCase":false,"value":0},{"condition":1,"type":"FilterDescriptor","operator":2,"propertyPath":"processStatus","ignoreCase":false,"value":0}]},{"condition":0,"type":"FilterGroupDescriptor","filters":[{"condition":1,"type":"FilterGroupDescriptor","filters":[{"condition":0,"type":"FilterDescriptor","operator":4,"propertyPath":"holiday","ignoreCase":false,"value":1825},{"condition":0,"type":"FilterDescriptor","operator":0,"propertyPath":"holiday","ignoreCase":false,"value":2555}]},{"condition":1,"type":"FilterGroupDescriptor","filters":[{"condition":0,"type":"FilterDescriptor","operator":4,"propertyPath":"holiday","ignoreCase":false,"value":2555},{"condition":0,"type":"FilterDescriptor","operator":0,"propertyPath":"holiday","ignoreCase":false,"value":3650}]}]},{"condition":0,"type":"FilterDescriptor","operator":5,"propertyPath":"holiday","ignoreCase":false,"value":0}],"sorts":[{"direction":1,"type":"SortDescriptor","propertyPath":"updateTime"},{"direction":1,"type":"SortDescriptor","propertyPath":"id"}]}`,
      jsonTreeNodes: [],
      expressionTreeNodes: []
    };
  }

  render() {
    return (
      <div className="converter">
        <div className="left-area">
          <div className="header">
            <Button
              type="primary"
              onClick={() => this.convert()}
              style={{ margin: "10px" }}
            >
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
            <TabPane tab="Expression Tree" key="1">
              <Tree showLine>{this.renderNode(this.state.expressionTreeNodes)}</Tree>
            </TabPane>
            <TabPane tab="JSON Tree" key="2">
              <Tree showLine>{this.renderNode(this.state.jsonTreeNodes)}</Tree>
            </TabPane>
          </Tabs>
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
      const jsonTreeNodes = this.generateJSONTreeNodes(dynamicQuery);
      const expressionTreeNodes = this.generateExpressionTreeNodes(
        dynamicQuery
      );
      this.setState({
        jsonTreeNodes: jsonTreeNodes,
        expressionTreeNodes: expressionTreeNodes
      });
    } catch (e) {
      message.error("Can't convert current query json.");
    }
  }

  //#region JSON Tree
  private generateJSONTreeNodes(
    dynamicQuery: DynamicQuery<any>
  ): TreeNodeModel[] {
    if (ObjectUtils.isNullOrUndefined(dynamicQuery)) {
      return [];
    }
    const result: TreeNodeModel[] = [];
    if (!ArrayUtils.isEmpty(dynamicQuery.filters)) {
      const filterNode = new TreeNodeModel();
      filterNode.title = (
        <span className="tree-title">
          {this.getPropertyOfDynamicQuery("filters")}
        </span>
      );
      filterNode.key = StringUtils.newGuid();
      filterNode.children = _.map(
        dynamicQuery.filters,
        (x: FilterDescriptorBase) => this.generateJSONTreeNodesByFilter(x)
      );
      result.push(filterNode);
    }

    const sortNode = new TreeNodeModel();
    sortNode.title = (
      <span className="tree-title">
        {this.getPropertyOfDynamicQuery("sorts")}
      </span>
    );
    sortNode.key = StringUtils.newGuid();
    sortNode.children = _.map(dynamicQuery.sorts, (x: SortDescriptorBase) =>
      this.generateJSONTreeNodesBySort(x)
    );
    result.push(sortNode);

    return result;
  }

  private generateJSONTreeNodesByFilter(
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
          <span className="tree-title">
            {this.getPropertyOfFilterDescriptor("condition")}:{" "}
          </span>
          <span className="tree-content">
            {FilterCondition[filter.condition]}
          </span>
        </span>
      );
      conditionNode.key = StringUtils.newGuid();
      const propertyPathNode = new TreeNodeModel();
      propertyPathNode.title = (
        <span>
          <span className="tree-title">
            {this.getPropertyOfFilterDescriptor("propertyPath")}:{" "}
          </span>
          <span className="tree-content">{filter.propertyPath}</span>
        </span>
      );
      propertyPathNode.key = StringUtils.newGuid();
      const operatorNode = new TreeNodeModel();
      operatorNode.title = (
        <span>
          <span className="tree-title">
            {this.getPropertyOfFilterDescriptor("operator")}:{" "}
          </span>
          <span className="tree-content">
            {FilterOperator[filter.operator]}
          </span>
        </span>
      );
      operatorNode.key = StringUtils.newGuid();
      const valueNode = new TreeNodeModel();
      valueNode.title = (
        <span>
          <span className="tree-title">
            {this.getPropertyOfFilterDescriptor("value")}:{" "}
          </span>
          <span className="tree-content">{filter.value.toString()}</span>
        </span>
      );
      valueNode.key = StringUtils.newGuid();
      const ignoreCaseNode = new TreeNodeModel();
      ignoreCaseNode.title = (
        <span>
          <span className="tree-title">
            {this.getPropertyOfFilterDescriptor("ignoreCase")}:{" "}
          </span>
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
          <span className="tree-title">
            {this.getPropertyOfFilterGroupDescriptor("condition")}:{" "}
          </span>
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
        filtersNode.children = _.map(
          filter.filters,
          (x: FilterDescriptorBase) => this.generateJSONTreeNodesByFilter(x)
        );
        filterGroupDescriptor.children.push(filtersNode);
      }
      result = filterGroupDescriptor;
    }

    return result;
  }

  private generateJSONTreeNodesBySort(sort: SortDescriptorBase): TreeNodeModel {
    let result: TreeNodeModel = undefined;
    if (sort instanceof SortDescriptor) {
      const sortDescriptorNode = new TreeNodeModel();
      sortDescriptorNode.title = (
        <span className="tree-title">SortDescriptor</span>
      );
      sortDescriptorNode.key = StringUtils.newGuid();
      sortDescriptorNode.children = [];
      const propertyPathNode = new TreeNodeModel();
      propertyPathNode.title = (
        <span>
          <span className="tree-title">
            {this.getPropertyOfSortDescriptor("propertyPath")}:{" "}
          </span>
          <span className="tree-content">{sort.propertyPath}</span>
        </span>
      );
      propertyPathNode.key = StringUtils.newGuid();
      const directionNode = new TreeNodeModel();
      directionNode.title = (
        <span>
          <span className="tree-title">
            {this.getPropertyOfSortDescriptor("direction")}:{" "}
          </span>
          <span className="tree-content">{SortDirection[sort.direction]}</span>
        </span>
      );
      directionNode.key = StringUtils.newGuid();
      sortDescriptorNode.children.push(propertyPathNode);
      sortDescriptorNode.children.push(directionNode);
      result = sortDescriptorNode;
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

  //#endregion

  //#region Expression Tree
  private generateExpressionTreeNodes(
    dynamicQuery: DynamicQuery<any>
  ): TreeNodeModel[] {
    if (ObjectUtils.isNullOrUndefined(dynamicQuery)) {
      return [];
    }
    const result: TreeNodeModel[] = [];
    if (!ArrayUtils.isEmpty(dynamicQuery.filters)) {
      const filterNode = new TreeNodeModel();
      filterNode.title = (
        <span className="tree-title">
          {this.getPropertyOfDynamicQuery("filters")}
        </span>
      );
      filterNode.key = StringUtils.newGuid();
      filterNode.children = _.map(
        dynamicQuery.filters,
        (x: FilterDescriptorBase) => this.generateExpressionTreeNodesByFilter(x)
      );
      result.push(filterNode);
    }

    const sortNode = new TreeNodeModel();
    sortNode.title = (
      <span className="tree-title">
        {this.getPropertyOfDynamicQuery("sorts")}
      </span>
    );
    sortNode.key = StringUtils.newGuid();
    sortNode.children = _.map(dynamicQuery.sorts, (x: SortDescriptorBase) =>
      this.generateExpressionTreeNodesBySort(x)
    );
    result.push(sortNode);

    return result;
  }

  private generateExpressionTreeNodesByFilter(
    filter: FilterDescriptorBase
  ): TreeNodeModel {
    let result: TreeNodeModel = undefined;
    if (filter instanceof FilterDescriptor) {
      const filterDescriptorNode = new TreeNodeModel();
      filterDescriptorNode.title = (
        <span>
          <span className="expression-condition">
            {FilterCondition[filter.condition]}
          </span>
          <span>&nbsp;&nbsp;&nbsp;</span>
          <span className="expression-prop">{filter.propertyPath}</span>
          <span>&nbsp;&nbsp;&nbsp;</span>
          <span className="expression-operator">
            {FilterOperator[filter.operator]}
          </span>
          <span>&nbsp;&nbsp;&nbsp;</span>
          <span className="expression-value">{filter.value.toString()}</span>
        </span>
      );
      filterDescriptorNode.key = StringUtils.newGuid();
      result = filterDescriptorNode;
    } else if (filter instanceof FilterGroupDescriptor) {
      const filterGroupDescriptorNode = new TreeNodeModel();
      filterGroupDescriptorNode.key = StringUtils.newGuid();
      filterGroupDescriptorNode.title = (
        <span>
          <span className="expression-condition">
            {FilterCondition[filter.condition]}
          </span>
          <span> </span>
          <span>&lt;group&gt;</span>
        </span>
      );

      if (!ArrayUtils.isEmpty(filter.filters)) {
        filterGroupDescriptorNode.children = _.map(
          filter.filters,
          (x: FilterDescriptorBase) =>
            this.generateExpressionTreeNodesByFilter(x)
        );
      }
      result = filterGroupDescriptorNode;
    }
    return result;
  }

  private generateExpressionTreeNodesBySort(
    sort: SortDescriptorBase
  ): TreeNodeModel {
    let result: TreeNodeModel = undefined;
    if (sort instanceof SortDescriptor) {
      const sortDescriptorNode = new TreeNodeModel();
      sortDescriptorNode.title = (
        <span>
          <span className="expression-prop">{sort.propertyPath}</span>
          <span>&nbsp;&nbsp;&nbsp;</span>
          <span className="expression-operator">
            {SortDirection[sort.direction]}
          </span>
        </span>
      );
      sortDescriptorNode.key = StringUtils.newGuid();
      result = sortDescriptorNode;
    }
    return result;
  }

  //#endregion
}
export default Converter;
