import React from 'react';
import ReactDOM from 'react-dom';

import Container from 'react-bootstrap/container';
import Jumbotron from 'react-bootstrap/jumbotron';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
  VictoryChart,
  VictoryAxis,
  VictoryLine,
  VictoryZoomContainer,
} from 'victory';

let data = require('./MOCK_DATA.json');
data = data.map((datum) => ({
  time: new Date(`${datum.date} ${datum.time}`),
  temperature: datum.temperature,
  humidity: datum.humidity
}));

data = data.slice(0, 200);

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      zoomDomain: { x: [new Date(2019, 11, 1), new Date(2019, 11, 31)] },
    };
  }

  handleZoom(domain) {
    this.setState({ zoomDomain: domain });
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        data: data
      });
    }, 500);
  }

  addDays(date, days) {
    date = new Date(date.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  }

  getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
      dateArray.push(new Date(currentDate));
      currentDate = this.addDays(currentDate, 1);
    }
    return dateArray;
  }

  render() {

    const { data } = this.state;

    let minDate = data.length && data.reduce((accum, curr) => 
      curr.time < accum.time ? curr : accum).time;
    let maxDate = data.length && data.reduce((accum, curr) => 
      curr.time > accum.time ? curr : accum).time;

    console.log(minDate, maxDate);

    let dates = this.getDates(minDate, maxDate);

    console.log(dates);

    return (
      <Container>
        <h1>Temperature Over Time</h1>
        <Jumbotron>
          <VictoryChart 
            padding={{ top: 40, bottom: 40, left: 40, right: 40 }}
            animate={{ duration: 2000, easing: "cubic" }}
            containerComponent={
              <VictoryZoomContainer
                zoomDimension="x"
                zoomDomain={this.state.zoomDomain}
                onZoomDomainChange={this.handleZoom.bind(this)}
              />
            }
          >
            <VictoryAxis
              tickValues={dates}
              tickFormat={(date) => `${date.getMonth()}/${date.getDate()}`}
              fixLabelOverlap={true}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(temperature) => ( `${temperature} C`)}
            />
            <VictoryLine
              data={this.state.data}
              x='time'
              y='temperature'
              style={{
                data: {
                  stroke: "tomato",
                  strokeWidth: ({ active }) => active ? 4 : 2
                },
                labels: { fill: "tomato" }
              }}
            />
          </VictoryChart>
        </Jumbotron>
      </Container>
    );
  }
}

ReactDOM.render(<Main />, document.getElementById('root'));