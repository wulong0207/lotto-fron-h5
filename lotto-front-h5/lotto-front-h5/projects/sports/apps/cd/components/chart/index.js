import React, { Component } from 'react';
import Chart from 'chart.js';
import { Record } from '../../types';
import PropTypes from 'prop-types';
import './chart.scss';

export default class ChartComponent extends Component {
  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    const ctx = this.canvas.getContext('2d');
    const { records } = this.props;
    const labels = records.map(r => r.date.slice(5));
    const options = {
      fill: false,
      borderWidth: 2,
      lineTension: 0,
      radius: 1.5
    };
    const max =
      Math.max(
        ...records
          .map(r => r.prizeTotal)
          .concat(records.map(r => r.notPrizeTotal))
      ) + 6;

    const datasets = [
      {
        ...options,
        label: '推中',
        borderColor: '#F01614',
        pointBackgroundColor: '#F01614',
        pointBorderWidth: 1,
        data: records.map(r => r.prizeTotal)
      },
      {
        ...options,
        label: '未中',
        borderColor: '#01AF63',
        pointBackgroundColor: '#01AF63',
        pointBorderWidth: 0,
        data: records.map(r => r.notPrizeTotal)
      }
    ];
    this.chart = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        legend: { display: false },
        tooltips: {
          callbacks: {
            title: function(tooltipItem) {
              return '';
            }
          }
        },
        scales: {
          yAxes: [
            {
              gridLines: { color: '#f4f4f4' },
              ticks: {
                stepSize: 2,
                min: 0,
                max: max % 2 === 0 ? max : max + 1
              }
            }
          ],
          xAxes: [{ gridLines: { color: '#f4f4f4' } }]
        }
      }
    });
  }

  componentWillUnmount() {
    this.chart && this.chart.destroy();
  }

  render() {
    return (
      <div className="chart-component">
        <canvas ref={ canvas => (this.canvas = canvas) } />
      </div>
    );
  }
}

ChartComponent.propTypes = {
  records: PropTypes.arrayOf(Record).isRequired
};
