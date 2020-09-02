import { renderHook, act } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';
import { useAuth, AuthContextProvider } from '../../hooks/auth';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

describe('Auth hook', () => {
  it('should be able to sign in', async () => {
    apiMock.onPost('sessions').reply(200, {
      user: {
        id: '123',
        name: 'John Doe',
        email: 'john@gobarber.com',
      },
      token: 'token-123',
    });

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthContextProvider,
    });

    result.current.signIn({
      email: 'test@gobarber.com',
      password: '123456',
    });

    await waitForNextUpdate();

    expect(result.current.isAuthenticated()).toBeTruthy();
    expect(setItemSpy).toHaveBeenCalledTimes(2);
  });

  it('should be able to sign out', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      switch (key) {
        case '@GoBarber:token':
          return 'token-123';
        case '@GoBarber:loggedUser':
          return JSON.stringify({
            id: '1',
          });
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthContextProvider,
    });

    act(() => result.current.signOut());
    expect(result.current.isAuthenticated()).toBeFalsy();
  });

  it('should be able to update the logged user', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      switch (key) {
        case '@GoBarber:token':
          return 'token-123';
        case '@GoBarber:loggedUser':
          return JSON.stringify({
            id: '1',
            email: 'oldEmail@gobarber.test',
          });
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthContextProvider,
    });

    act(() =>
      result.current.updateUser({
        id: '1',
        name: 'I am a name',
        email: 'newEmail@gobarber.test',
        avatar_url: 'image.png',
      })
    );

    expect(result.current.loggedUser.email).toBe('newEmail@gobarber.test');
  });
});
