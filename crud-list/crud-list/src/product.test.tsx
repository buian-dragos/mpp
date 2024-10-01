import { JSDOM } from 'jsdom';
import { screen } from '@testing-library/dom';
import { fireEvent, render } from '@testing-library/react';
import {beforeAll, afterAll, describe, it, expect, vi} from 'vitest';
import ProductList from './components/ProductList';

let dom: JSDOM;

beforeAll(() => {
  dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost/',
  });
  const { window } = dom;
  global.window = window as unknown as typeof globalThis & Window;
  global.document = window.document;
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
  global.document.body.innerHTML = `
    <div>
      <input placeholder="Name" />
      <input placeholder="Price" />
      <button>ADD</button>
    </div>
  `;
});

afterAll(() => {
  dom.window.close();
});

describe('ProductList', () => {
  it('should add a new product', () => {
    render(<ProductList />);

    const productNameInput = screen.getByPlaceholderText('Name');
    const productPriceInput = screen.getByPlaceholderText('Price');
    const addButton = screen.getByText('ADD');

    fireEvent.change(productNameInput, { target: { value: 'New Product' } });
    fireEvent.change(productPriceInput, { target: { value: '100' } });
    fireEvent.click(addButton);

    const newProductRow = screen.getByText('New Product');
    expect(newProductRow).toBeTruthy();
  });
});
