import styled from 'styled-components';
import React, { Component } from 'react'
import ReactHighcharts from 'react-highcharts/ReactHighstock.src'
import moment from 'moment'
// eslint-disable-next-line no-unused-vars
import btcdata from '../context/mockData/btcdata.json';

export default class Chart extends Component {
  render() {
    const numberFormat = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', notation: 'compact'});
    const tooltipNumberFormat = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});
    const configPrice = {
      navigator: {
        enabled: false
      },
      yAxis: [{
        opposite: false,
        labels: {
          formatter: function () {
            return numberFormat.format(this.value)
          }
        },
      },
      ],
      tooltip: {
        shared: true,
        formatter: function () {
          return tooltipNumberFormat.format(this.y, 0) +  '</b><br/>' + moment(this.x).format('MMMM Do, hh:mm');
        }
      },
      title: {
        text: `Total Allocation`,
        align: 'left'
      },
      chart: {
        height: 451,
      },

      credits: {
        enabled: false
      },

      legend: {
        enabled: false
      },
      scrollbar: {
        enabled: false
      },
      rangeSelector: {
        inputEnabled: false,
        buttons: [{
          type: 'hour',
          count: 1,
          text: '1h',
        }, {
          type: 'day',
          count: 1,
          text: '1d'
        }, {
          type: 'day',
          count: 3,
          text: '3d'
        }, {
          type: 'all',
          text: 'All'
        }],
        selected: 1
      },
      series: [{
        name: 'Price',
        type: 'line',
        data: this.props.data,
        tooltip: {
          valueDecimals: 2
        },
      }],
    };
    return (
      <section className='section'>
        <Wrapper className='section-center'>
          <div>
            <ReactHighcharts config = {configPrice}></ReactHighcharts>
          </div>
        </Wrapper>
      </section>
    )
  }
}

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  div {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;
