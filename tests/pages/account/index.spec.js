import React from 'react';

import { shallowWrapped } from '@tests/wrapper';
import { IntlMock } from '@tests/mocks';

import { gravatarUrl } from '@lib/gravatar';

import { Account } from '@pages/account/index';

describe('Account page', () => {
  const intl = new IntlMock();

  it('should render without throwing an error', () => {
    const user = {};
    const component = shallowWrapped(<Account intl={intl} user={user} />);
    expect(component).toBeDefined();
  });

  it('should get gravatarUrl', () => {
    const props = {
      user: {
        email: 'test@test.net'
      }
    };
    const component = new Account(props);
    const result = component.gravatarUrl;
    expect(result).toBe(gravatarUrl('test@test.net', 250));
  });
});
