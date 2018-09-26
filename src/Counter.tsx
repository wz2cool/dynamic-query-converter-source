import * as React from "react";
import { Button } from "antd";

class Counter extends React.Component<{}, { count: number }> {
  interval: number;

  constructor(props: any) {
    super(props);
    this.state = { count: 0 };
  }

  componentDidMount() {
    this.interval = window.setInterval(
      () => this.setState(prevState => ({ count: prevState.count + 1 })),
      200
    );
  }

  generateString1() {
    // you can update this method, and it will work
    return "1";
  }

  generateString2 = () => {
    // this one will not
    return "1";
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <Button type="primary">Button</Button>
        <span>
          {this.state.count} - {this.generateString1()} -{" "}
          {this.generateString2()}
        </span>
      </div>
    );
  }
}

export default Counter;
