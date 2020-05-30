import React, { Component } from "react";
import axios from "axios";

const sortTypes = {
  up: {
    class: "sort-up",
    fn: (a, b) => a.Duration - b.Duration,
  },
  down: {
    class: "sort-down",
    fn: (a, b) => b.Duration - a.Duration,
  },
};

export default class Time extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSort: "up",
      data: [],
      isLoading: true,
      error: null,
    };
  }

  async componentDidMount() {
    try {
      const result = await axios.get("/data");
      this.setState({
        data: result.data,
        isLoading: false,
      });
    } catch (error) {
      this.setState({
        error,
        isLoading: false,
      });
    }
  }

  onSortChange = () => {
    const { currentSort } = this.state;
    let nextSort;

    if (currentSort === "down") nextSort = "up";
    else if (currentSort === "up") nextSort = "down";

    this.setState({
      currentSort: nextSort,
    });
  };
  render() {
    const { data, error, isLoading, currentSort } = this.state;

    if (!data) {
      return (
        <div className="container">
          <p>No data yet ...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="container">
          <p style={{ color: "red" }}>{error.message}</p>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="container">
          <p>Loading ...</p>
        </div>
      );
    }

    return (
      <div className="container">
        <table className="table table-bordered table-striped mt-5">
          <thead>
            <tr>
              <th className="text-center" scope="col">
                Имя игрока
              </th>
              <th className="text-center" scope="col">
                Последний онлайн
              </th>
              <th
                className="text-center"
                scope="col"
                onClick={this.onSortChange}
              >
                Played Time&nbsp;
                <i className={`fas fa-${sortTypes[currentSort].class}`} />
              </th>
            </tr>
          </thead>
          <tbody>
            {[...data].sort(sortTypes[currentSort].fn).map((user) => (
              <tr key={user._id}>
                <td className="text-center">{user.name}</td>
                <td className="text-center">
                  {Number.parseInt(((Date.now() - user.leaveDate) / 3600000)
                    .toString()
                    .slice(0, 5)) > 24 ? "> 24 ч назад" : ((Date.now() - user.leaveDate) / 3600000)
                    .toString()
                    .slice(0, 5) + " часов назад"
                    }
                </td>
                <td className="text-center">
                  {(user.Duration / 60).toString().slice(0, 6)} мин.
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
