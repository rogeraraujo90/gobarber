import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SignIn from '../../pages/SignIn';

const mockedHistoryPush = jest.fn();
const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => {
      return {
        push: mockedHistoryPush,
      };
    },
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/auth', () => ({
  useAuth: () => ({
    signIn: mockedSignIn,
  }),
}));

jest.mock('../../hooks/toast', () => ({
  useToast: () => ({
    addToast: mockedAddToast,
  }),
}));

describe('Sign In page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    mockedSignIn.mockClear();
    mockedAddToast.mockClear();
  });

  it('should be able to Sign In', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailInput = getByPlaceholderText('E-mail');
    const passwordInput = getByPlaceholderText('Senha');
    const signInButton = getByText('Entrar');

    fireEvent.change(emailInput, { target: { value: 'john@gobarber.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.click(signInButton);

    await waitFor(() =>
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard')
    );
  });

  it('should not be able to Sign In with an invalid email', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailInput = getByPlaceholderText('E-mail');
    const passwordInput = getByPlaceholderText('Senha');
    const signInButton = getByText('Entrar');

    fireEvent.change(emailInput, { target: { value: 'invalid email' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.click(signInButton);

    await waitFor(() => expect(mockedHistoryPush).not.toHaveBeenCalled());
  });

  it('should not be able to Sign In with with no password', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailInput = getByPlaceholderText('E-mail');
    const signInButton = getByText('Entrar');

    fireEvent.change(emailInput, { target: { value: 'jon@gobarber.com' } });
    fireEvent.click(signInButton);

    await waitFor(() => expect(mockedHistoryPush).not.toHaveBeenCalled());
  });

  it('should show a toast if login action throws an error', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailInput = getByPlaceholderText('E-mail');
    const passwordInput = getByPlaceholderText('Senha');
    const signInButton = getByText('Entrar');

    mockedSignIn.mockImplementationOnce(() => {
      throw new Error();
    });

    fireEvent.change(emailInput, { target: { value: 'jon@gobarber.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456' } });
    fireEvent.click(signInButton);

    await waitFor(() => expect(mockedHistoryPush).not.toHaveBeenCalled());
    await waitFor(() =>
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error' })
      )
    );
  });
});
