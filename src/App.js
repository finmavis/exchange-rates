import React, { Component } from 'react';
import styled from 'styled-components';

const Wrapper = styled.section`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: auto;
  min-height: 100vh;
  width: 100%;
`;

const Heading = styled.h1`
  font-family: inherit;
  color: #000;
  font-size: 3rem;
  margin-bottom: 2.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;

  &:not(:last-child) {
    margin-right: 2.5rem;
  }

  &:last-child {
    align-self: flex-end;
  }
`;

const Form = styled.form`
  display: flex;
  width: 100%;
  max-width: 45rem;
  justify-content: space-between;

  & > * {
    flex: 0 0 calc(100% / 3);
  }
`;

const Result = styled.div`
  font-family: inherit;
  font-size: 2.5rem;
  width: 100%;
  max-width: 45rem;
  text-align: center;
  margin-top: 2.5rem;
`;

class App extends Component {
  state = {
    currency: [],
    result: null,
    idr: 1,
    selectedCurrency: 'BGN',
  };

  async componentDidMount() {
    const res = await fetch('https://api.exchangeratesapi.io/latest');
    const resJson = await res.json();
    const currency = [];
    for (const i of Object.keys(resJson.rates)) {
      currency.push(i);
    }
    this.setState({ currency });
  }

  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleConvert = async e => {
    e.preventDefault();
    const res = await fetch(
      `https://api.exchangeratesapi.io/latest?base=IDR&symbols=${
        this.state.selectedCurrency
      }`,
    );
    const resJson = await res.json();
    const convert = (
      this.state.idr * resJson.rates[this.state.selectedCurrency]
    ).toFixed(4);

    const result = {
      curreny: this.state.selectedCurrency,
      total: convert,
    };

    this.setState({ result });
  };

  render() {
    const { currency, result, selectedCurrency, idr } = this.state;
    return (
      <Wrapper>
        <Heading>Exchange rates IDR to foreign currency conversion</Heading>
        <Form onSubmit={this.handleConvert}>
          <FormGroup>
            <label htmlFor='idr'>IDR</label>
            <input
              type='number'
              id='idr'
              className='form-control'
              name='idr'
              value={idr}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor='currency'>Currency</label>
            <select
              value={selectedCurrency}
              name='selectedCurrency'
              onChange={this.handleChange}>
              {currency.map(singleCurrency => (
                <option key={singleCurrency} value={singleCurrency}>
                  {singleCurrency}
                </option>
              ))}
            </select>
          </FormGroup>
          <FormGroup>
            <button>Run</button>
          </FormGroup>
        </Form>
        {result ? (
          <Result>
            {result.total} {result.curreny}
          </Result>
        ) : null}
      </Wrapper>
    );
  }
}

export default App;
