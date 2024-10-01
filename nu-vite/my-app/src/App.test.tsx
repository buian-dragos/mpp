import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductList from './components/ProductList';

describe('ProductList Component', () => {

  beforeEach(async () => {
    render(<ProductList />);
    await waitFor(() => screen.getByText('Load Complete'), { timeout: 10000 }); // Wait for initial data load
  });

  it('updates an existing product', async () => {
    const productToUpdate = await waitFor(() => screen.getByText('Lopata'));
    userEvent.click(productToUpdate);

    const nameInput = screen.getByPlaceholderText('Name');
    const priceInput = screen.getByPlaceholderText('Price');
    userEvent.clear(nameInput);
    userEvent.type(nameInput, 'Ciocan');
    userEvent.clear(priceInput);
    userEvent.type(priceInput, '717.17');

    const updateButton = screen.getByText('UPDATE');
    userEvent.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText('Ciocan')).toBeInTheDocument();
      expect(screen.getByText('717.17 RON')).toBeInTheDocument();
    });
  });

  it('deletes an existing product', async () => {
    const productToDelete = await waitFor(() => screen.getByText('Horn'));
    userEvent.click(productToDelete);

    const deleteButton = screen.getByText('DELETE');
    userEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText('Horn')).toBeNull();
    });
  });

  it('adds a new product', async () => {
    const nameInput = screen.getByPlaceholderText('Name');
    const priceInput = screen.getByPlaceholderText('Price');
    userEvent.type(nameInput, 'New Product');
    userEvent.type(priceInput, '123.45');

    const addButton = screen.getByText('ADD');
    userEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('New Product')).toBeInTheDocument();
      expect(screen.getByText('123.45 RON')).toBeInTheDocument();
    });
  });

  // Additional tests can be written here to handle sorting and other interactions
});

