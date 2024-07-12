import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../../redux/store';
import { describe, it } from 'vitest';
import Chatbot from '../../../components/Chatbot/Chatbot';
import { setMessages, resetState, setBotMessage } from '../../../redux/reducers/chatMessagesReducer';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { sendMessage } from '../../../redux/actions/chatAction';
import { ChatMessage } from '../../../types/chatTypes';
import { Toaster } from 'react-hot-toast';
import jest from 'jest-mock';

const mockAxios = new MockAdapter(axios);

describe('Chatbot test', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockAxios.reset();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      }))
    });
  });

  it('should render Chatbot component and display initial messages', async () => {
    const newMessage: ChatMessage = {
      message: 'Hello'
    };

    mockAxios.onPost(`${import.meta.env.VITE_APP_API_URL}/chat`).reply(200, {
      message: 'Hello There',
      status: 'success'
    });

    await store.dispatch(sendMessage(newMessage) as any);

    store.dispatch(
      setMessages({
        status: 'success',
        message: 'Hi'
      })
    );

    store.dispatch(
      setBotMessage({
        status: 'success',
        message: 'Hello'
      })
    );

    render(
      <Provider store={store}>
        <Chatbot />
      </Provider>
    );

    const chatBotBtn = screen.getByRole('testButtonRole');
    expect(chatBotBtn).toBeInTheDocument();

    fireEvent.click(chatBotBtn);

    await waitFor(() => {
      const chatbotHeader = screen.getByText('Chatbot', { selector: 'h1' });
      expect(chatbotHeader).toBeInTheDocument();

      const pElement1 = screen.getByText('Hi', { selector: 'p' });
      expect(pElement1).toBeInTheDocument();

      const pElement2 = screen.getByText('Hello', { selector: 'p' });
      expect(pElement2).toBeInTheDocument();

      const pElement3 = screen.getByText('Hello There', { selector: 'p' });
      expect(pElement3).toBeInTheDocument();

      const svgsElements = screen.getAllByRole('testRole');
      expect(svgsElements.length).toBeGreaterThanOrEqual(3);

      const inputElements = screen.getAllByRole('testInputRole');
      expect(inputElements.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('should render Chatbot component with default line when no messages exist', async () => {
    store.dispatch(resetState());

    render(
      <Provider store={store}>
        <Chatbot />
      </Provider>
    );

    const chatBotBtn = screen.getByRole('testButtonRole');
    expect(chatBotBtn).toBeInTheDocument();

    fireEvent.click(chatBotBtn);

    await waitFor(() => {
      const pElement1 = screen.getByText('No messages yet, start chatting', { selector: 'p' });
      expect(pElement1).toBeInTheDocument();
    });
  });

  it('should handle sending a message and receiving a response', async () => {
    mockAxios.onPost(`${import.meta.env.VITE_APP_API_URL}/chat`).reply(200, {
      message: 'Hello There',
      status: 'success'
    });

    window.HTMLElement.prototype.scrollIntoView = function () {};

    render(
      <Provider store={store}>
        <Chatbot />
      </Provider>
    );

    const chatBotBtn = screen.getByRole('testButtonRole');
    expect(chatBotBtn).toBeInTheDocument();

    fireEvent.click(chatBotBtn);

    const inputElement = screen.getByRole('testInputRole');
    fireEvent.change(inputElement, { target: { value: 'Hello' } });

    const sendButton = screen.getByRole('sendButton');
    fireEvent.click(sendButton);

    await waitFor(() => {
      const pElement1 = screen.getByText('Hello', { selector: 'p' });
      expect(pElement1).toBeInTheDocument();

      const pElement2 = screen.getByText('Hello There', { selector: 'p' });
      expect(pElement2).toBeInTheDocument();
    });
  });

  it('should display error when sending an empty message', async () => {
    render(
      <Provider store={store}>
        <Chatbot />
        <Toaster position="top-center" reverseOrder={false} />
      </Provider>
    );

    const chatBotBtn = screen.getByRole('testButtonRole');
    expect(chatBotBtn).toBeInTheDocument();

    fireEvent.click(chatBotBtn);

    const sendButton = screen.getByRole('sendButton');
    fireEvent.click(sendButton);

    await waitFor(() => {
      const errorToast = screen.getByText('Please compose a message', { selector: 'div' });
      expect(errorToast).toBeInTheDocument();
    });
  });

  it('should handle API error when sending a message', async () => {
    mockAxios.onPost(`${import.meta.env.VITE_APP_API_URL}/chat`).reply(500, {
      message: 'Internal Server Error'
    });

    render(
      <Provider store={store}>
        <Chatbot />
        <Toaster position="top-center" reverseOrder={false} />;
      </Provider>
    );

    const chatBotBtn = screen.getByRole('testButtonRole');
    expect(chatBotBtn).toBeInTheDocument();

    fireEvent.click(chatBotBtn);

    const inputElement = screen.getByRole('testInputRole');
    fireEvent.change(inputElement, { target: { value: 'Hello' } });

    const sendButton = screen.getByRole('sendButton');
    fireEvent.click(sendButton);

    await waitFor(() => {
      const errorToast = screen.getByText('An error occurred');
      expect(errorToast).toBeInTheDocument();
    });
  });
});
