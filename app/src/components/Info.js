import React from 'react';
import styled from 'styled-components';

const UserInfo = () => {
  const items = [
    {
      id: 1,
      label: 'Total allocation',
      value: 1,
    },
    {
      id: 2,
      label: 'Day change',
      value: 2,
    },
    {
      id: 3,
      label: 'YTD Change',
      value: 3,
    },
    {
      id: 4,
      label: 'Average Annualized Yield',
      value: 4,
    },
    {
      id: 5,
      label: 'Total Deployed',
      value: 5,
    },
    {
      id: 6,
      label: 'All-Time',
      value: 6,
    },
    {
      id: 7,
      label: '30-Day',
      value: 7,
    },
    {
      id: 8,
      label: '7-Day',
      value: 8,
    },
    {
      id: 9,
      label: '24-Hour',
      value: 9,
    },
  ];
  return <section className="section">
    <Wrapper className="section-center">
      {items.map((box)=>{
        return <Box key={box.id} {...box}></Box>
      })}
    </Wrapper>
  </section>;
};
const Box = ({icon,label,value,color})=>{
  return <article className="item">
    <span className={color}>{icon}</span>
    <div>
      <p>{label}</p>
      <h3>{value}</h3>
    </div>
  </article>
}

const Wrapper = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem 2rem;
  @media (min-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  .item {
    border-radius: var(--radius);
    border:1px solid #EFEFF4;
    padding: 1rem 2rem;
    background: var(--clr-white);
    column-gap: 3rem;
    align-items: center;
    span {
      width: 3rem;
      height: 1rem;
      place-items: left;
      border-radius: 50%;
    }
    h3 {
      margin-bottom: 0;
      font-family: Inter;
      font-size: 15px;
      font-weight: 600;
      line-height: 18px;
      letter-spacing: 0px;
      text-align: left;
    }
    p {
      margin-bottom: 0;
      font-family: Inter;
      font-size: 11px;
      font-weight: 400;
      line-height: 13px;
      letter-spacing: 0px;
      text-align: left;
    }
  }
`;
export default UserInfo;
