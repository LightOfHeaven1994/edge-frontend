import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import DetailsHeader from './DetailsHeader';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import { init, RegistryContext } from '../../store';

describe('DetailsHeader', () => {
  it('renders correctly', async () => {
    const openUpdateWizard = jest.fn();
    const imageData = {
      data: {
        ImageBuildIsoURL: 'test.com',
        ImageSet: {
          ID: 101,
          Name: 'test image',
        },
        LastImageDetails: {
          image: {
            ID: 200,
            Status: 'SUCCESS',
            Version: 2,
            ImageType: 'rhel-edge-installer',
            UpdatedAt: Date.now(),
          },
        },
        ImagesViewData: {
          count: 2,
          data: [
            {
              ID: 200,
              Version: 2,
              ImageType: 'rhel-edge-installer',
              CommitCheckSum: '',
              CreatedAt: '2022-07-15T16:41:44.237455+02:00',
              Status: 'SUCCESS',
              ImageBuildIsoURL: 'test.com',
            },
            {
              ID: 100,
              Version: 1,
              ImageType: 'rhel-edge-installer',
              CreatedAt: '2022-07-15T13:52:09.155502+02:00',
              Status: 'SUCCESS',
              ImageBuildIsoURL: 'test.com',
            },
          ],
        },
      },
    };

    const registry = init(logger);

    const { container } = render(
      <RegistryContext.Provider
        value={{
          getRegistry: () => registry,
        }}
      >
        <Provider store={registry.getStore()}>
          <DetailsHeader
            imageData={imageData}
            openUpdateWizard={openUpdateWizard}
          />
        </Provider>
      </RegistryContext.Provider>,
      { wrapper: MemoryRouter }
    );

    expect(screen.getAllByRole('listitem')[0].children[0].innerHTML).toEqual(
      'Manage Images'
    );
    expect(screen.getAllByRole('listitem')[1].innerHTML).toContain(
      'test image'
    );
    expect(screen.getByRole('heading', { name: /test image/i })).toBeDefined();
    expect(screen.getByText(/last updated/i).children[0].innerHTML).toContain(
      'Just now'
    );
    fireEvent.click(screen.getByRole('button', { name: /actions/i }));
    fireEvent.click(
      screen.getByRole('button', { name: /create new version/i })
    );
    expect(openUpdateWizard).toBeCalled();

    expect(container.querySelector('div')).toMatchSnapshot();
  });
});
