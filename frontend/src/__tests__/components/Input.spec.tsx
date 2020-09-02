import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Input from '../../components/Input';

jest.mock('@unform/core', () => {
  return {
    useField: () => {
      return {
        fieldName: 'name',
        defaultValue: '',
        registerField: jest.fn(),
        error: '',
      };
    },
  };
});

describe('Input component', () => {
  it('should show orange border according focus/blur event', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="name" placeholder="name" />
    );

    const inputElement = getByPlaceholderText('name');
    const inputContainerElement = getByTestId('input-container');

    fireEvent.focus(inputElement);

    await waitFor(() => {
      expect(inputContainerElement).toHaveStyle('border-color: #ff9000');
      expect(inputContainerElement).toHaveStyle('color: #ff9000');
    });

    fireEvent.blur(inputElement);

    await waitFor(() => {
      expect(inputContainerElement).not.toHaveStyle('border-color: #ff9000');
      expect(inputContainerElement).not.toHaveStyle('color: #ff900');
    });
  });
});
