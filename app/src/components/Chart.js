import styled from 'styled-components';
import React, { Component } from 'react'
import ReactHighcharts from 'react-highcharts/ReactHighstock.src'
import moment from 'moment'

export default class Chart extends Component {
  render() {
    const options = {style: 'currency', currency: 'USD'};
    const numberFormat = new Intl.NumberFormat('en-US', options);
    const configPrice = {
      navigator: {
        enabled: false
      },
      yAxis: [{
        offset: -10,
        opposite:false,
        labels: {
          formatter: function () {
            return numberFormat.format(this.value)
          }
          ,
          // x: -1105,
          // style: {
          //   "color": "#000", "position": "absolute"

          // },
          // align: 'left'
        },
      },
      ],
      tooltip: {
        shared: true,
        formatter: function () {
          return numberFormat.format(this.y, 0) +  '</b><br/>' + moment(this.x).format('MMMM Do YYYY, h:mm')
        }
      },
      // plotOptions: {
      //   series: {
      //     showInNavigator: false,
      //     gapSize: 6,

      //   }
      // },
      title: {
        text: `Total Allocation`,
        align: 'left'
      },
      subtitle: {
        text: `Total Allocation`,
        align: 'left'
      },
      chart: {
        height: 600,
      },

      credits: {
        enabled: false
      },

      legend: {
        enabled: false
      },
      xAxis: {
        type: 'date',
      },
      scrollbar: {
        enabled: false
      },
      rangeSelector: {
        inputEnabled: false,
        buttons: [{
          type: 'day',
          count: 1,
          text: '1d',
        }, {
          type: 'day',
          count: 7,
          text: '7d'
        }, {
          type: 'month',
          count: 1,
          text: '1m'
        }, {
          type: 'month',
          count: 3,
          text: '3m'
        },
          {
          type: 'all',
          text: 'All'
        }],
        selected: 0
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
