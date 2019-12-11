import React from 'react';
import Head from 'next/head';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { Nav } from '@components/nav';

const Hero = styled.div`
  width: 100%;
  color: #333;
`;

const Title = styled.h1`
  margin: 0;
  width: 100%;
  padding-top: 80px;
  line-height: 1.15;
  font-size: 48px;
  text-align: center;
`;

const Description = styled.p`
  text-align: center;
`;

export class Login extends React.Component {

  render() {
    return (
      <div>
        <Head>
          <title>
            <FormattedMessage id="login.title" defaultMessage="Login" description="Page title" />
          </title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Nav />

        <Hero>
          <Title>
            <FormattedMessage id="login.title" defaultMessage="Login" description="Page title" />
          </Title>
          <Description>
            <FormattedMessage id="login.description" defaultMessage="Coming soon" description="Page description" />
          </Description>
        </Hero>
      </div>
    );
  }
}

export default Login;

