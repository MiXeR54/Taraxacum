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
    var { data, error, isLoading, currentSort } = this.state;

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

    data.forEach((d) => {
      var milliseconds, days, hours, minutes, seconds;
      if (d.leaveDate > 0) {
        milliseconds = Date.now() - d.leaveDate;
        days = Math.floor(milliseconds / (24 * 60 * 60 * 1000));
        if (days < 0) {
          days = 0;
        }
        milliseconds -= days * 24 * 60 * 60 * 1000;

        hours = Math.floor(milliseconds / (60 * 60 * 1000));
        if (hours < 0) {
          hours = 0;
        }
        milliseconds -= hours * 60 * 60 * 1000;

        minutes = Math.floor(milliseconds / (60 * 1000));
        if (minutes < 0) {
          minutes = 0;
        }
        milliseconds -= minutes * 60 * 1000;

        seconds = Math.floor(milliseconds / 1000);
        if (seconds < 0) {
          seconds = 0;
        }
      } else {
        days = hours = minutes = seconds = 0;
      }
      d.days = days;
      d.hours = hours;
      d.minutes = minutes;
      d.seconds = seconds;
    });

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
                В игре&nbsp;
                <i className={`fas fa-${sortTypes[currentSort].class}`} />
              </th>
            </tr>
          </thead>
          <tbody>
            {[...data].sort(sortTypes[currentSort].fn).map((user) => (
              <tr key={user._id}>
                <td className="text-center">{user.name}</td>
                <td className="text-center">
                  {user.days.toString() +
                    " дней " +
                    user.hours.toString() +
                    " часов " +
                    user.minutes.toString() +
                    " минут назад"}
                </td>
                <td className="text-center">
                  {Math.ceil((user.Duration / 60).toString())} мин.
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
