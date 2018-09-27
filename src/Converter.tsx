import * as React from "react";
import { Button, Input, Tabs } from "antd";

const { TextArea } = Input;
const TabPane = Tabs.TabPane;

import "./Converter.scss";

class Converter extends React.Component {
  render() {
    return (
      <div className="converter">
        <div className="left-area">
          <div className="header">
            <Button type="primary">Convert</Button>
          </div>
          <div className="content">
            <TextArea className="input-query" />
          </div>
        </div>
        <div className="right-area">
          <Tabs defaultActiveKey="1">
            <TabPane tab="Tab 1" key="1">
              Content of Tab Pane 1
            </TabPane>
            <TabPane tab="Tab 2" key="2">
              Content of Tab Pane 2
            </TabPane>
            <TabPane tab="Tab 3" key="3">
              Content of Tab Pane 3
            </TabPane>
          </Tabs>
          ,
        </div>
      </div>
    );
  }
}
export default Converter;
