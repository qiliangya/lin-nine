import React, { Component } from "react";
export default class hi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aa: 1
    };
  }
  static list = [1, 2, 3]
  render() {
    return list.map(v => <div>{v}</div>)
  }
}
