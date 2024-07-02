import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import store from '../../../redux/store';
import CategoriesMenu from '../../../components/Menu/CategoriesMenu';
import { setCategoryObj } from '../../../redux/reducers/categoryReducer';
import DesktopMenu from '../../../components/Menu/DesktopMenu';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
describe('DesktopMenu', () => {
  it('renders the DesktopMenu component', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DesktopMenu />
        </MemoryRouter>
      </Provider>
    );
    const listItemElement = screen.getByText('WishList');
    expect(listItemElement).toBeInTheDocument();
  });
});
describe('CategoriesMenu', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({
      data: {
        categories: [
          { name: 'Category1', products: [{ id: 1 }, { id: 2 }] },
          { name: 'Category2', products: [{ id: 3 }] }
        ]
      }
    });
  });

  it('renders the CategoriesMenu component', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CategoriesMenu />
        </MemoryRouter>
      </Provider>
    );
    const shopElement = screen.getByText('Shop');
    expect(shopElement).toBeInTheDocument();
  });

  it('displays categories', async () => {
    store.dispatch(
      setCategoryObj({
        Category1: 2,
        Category2: 1
      })
    );
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CategoriesMenu />
        </MemoryRouter>
      </Provider>
    );

    const category1Element = await screen.findByText('Category1');
    const category2Element = await screen.findByText('Category2');

    expect(category1Element).toBeInTheDocument();
    expect(category2Element).toBeInTheDocument();
  });

  it('dispatches setCurrentCategory when a category is clicked', async () => {
    store.dispatch(
      setCategoryObj({
        Category1: 2,
        Category2: 1
      })
    );

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CategoriesMenu />
        </MemoryRouter>
      </Provider>
    );

    const category1Element = await screen.findByText('Category1');

    fireEvent.click(category1Element);

    const state = store.getState();
    expect(state.category.currentCategory).toBe('Category1');
  });

  it('dispatches setCurrentCategory with an empty string when Shop is clicked', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <CategoriesMenu />
        </MemoryRouter>
      </Provider>
    );

    const shopElement = screen.getByText('Shop');
    fireEvent.click(shopElement);

    const state = store.getState();
    expect(state.category.currentCategory).toBe('');
  });
});
