import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import App from '../App';
import {Alert} from 'react-native';

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  return Object.setPrototypeOf(
    {
      Alert: {
        ...RN.Alert,
        alert: jest.fn(),
      },
    },
    RN,
  );
});

describe('App', () => {
  it('renders correctly', () => {
    const {getByText} = render(<App />);
    const searchButton = getByText('Search');
    expect(searchButton).toBeTruthy();
  });

  it('updates the searchedUser state on input change', () => {
    const {getByPlaceholderText} = render(<App />);
    const searchInput = getByPlaceholderText('User name..');

    fireEvent.changeText(searchInput, 'John Doe');

    expect(searchInput.props.value).toBe('John Doe');
  });

  it('displays "The list is empty." message if filteredUsers is empty', () => {
    const {getByText} = render(<App />);
    const emptyListMessage = getByText('The list is empty.');

    expect(emptyListMessage).toBeTruthy();
  });

  it('performs search when button is pressed', () => {
    const {getByText, getByPlaceholderText} = render(<App />);
    const searchButton = getByText('Search');
    const searchInput = getByPlaceholderText('User name..');
    fireEvent.changeText(searchInput, 'John Doe');
    fireEvent.press(searchButton);
  });

  it('displays an error message for non-existent user', () => {
    const {getByPlaceholderText, getByText} = render(<App />);

    // Mock user input and perform search for non-existent user
    const searchInput = getByPlaceholderText('User name..');
    const searchButton = getByText('Search');
    fireEvent.changeText(searchInput, 'NonExistentUser');
    fireEvent.press(searchButton);

    // Check if the error message is displayed
    expect(Alert.alert).toHaveBeenCalledWith("User doesn't exist!");
  });

  it('displays the filtered users when the search button is pressed', () => {
    const {getByPlaceholderText, getByText} = render(<App />);
    const searchInput = getByPlaceholderText('User name..');
    const searchButton = getByText('Search');

    fireEvent.changeText(searchInput, 'Win thu');
    fireEvent.press(searchButton);

    const userName = getByText('Win Thu');
    expect(userName).toBeTruthy();
  });
});
