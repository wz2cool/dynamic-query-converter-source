import * as React from "react";
import { Row, Col, Input, Layout } from "antd";
const { Header, Content } = Layout;

const { TextArea } = Input;

class Converter extends React.Component {
  render() {
    return (
      <Row style={{ height: "100%" }}>
        <Col span={12} style={{ height: "100%" }}>
          <Layout style={{ height: "100%" }}>
            <Header />
            <Content>
              <TextArea style={{ height: "100%" }} />
            </Content>
          </Layout>
        </Col>
        <Col span={12} style={{ height: "100%" }}>
          col-12
        </Col>
      </Row>
    );
  }
}
export default Converter;
