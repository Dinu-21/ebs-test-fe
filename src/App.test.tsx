import React from 'react';
import { render, screen } from '@testing-library/react';
import App, { Fetcher, ICategory } from './App';
import { act } from 'react-test-renderer';
const categories: ICategory[] = [
    { id: 'aksd', label: 'Some', productsCount: 0, parentId: 'parentId', children: [] },
    {
        id: 'ajasd',
        label: 'Some2',
        productsCount: 1,
        parentId: 'parentId1',
        children: [
            {
                id: 'nested',
                label: 'Some3',
                productsCount: 1,
                parentId: 'parentId1',
                children: [],
            },
        ],
    },
];
test('renders categories', async () => {
    const mock = jest.spyOn(Fetcher, 'get').mockImplementation(async () => categories);

    await act(async () => render(<App />) as any);

    const firstCategory = screen.getByTestId(categories[0].id);
    const secondCategory = screen.getByTestId(categories[1].id);
    const nestedCategory = screen.getByTestId(categories[1].children[0].id);

    expect(firstCategory).toBeInTheDocument();
    expect(secondCategory).toBeInTheDocument();
    expect(nestedCategory).toBeInTheDocument();

    mock.mockRestore();
});

test('toggle nested categories', async () => {
    const mock = jest.spyOn(Fetcher, 'get').mockImplementation(async () => categories);

    await act(async () => render(<App />) as any);

    const secondCategory = screen.getByTestId(categories[1].id);
    const nestedCategory = screen.getByTestId(categories[1].children[0].id);

    await act(async () => secondCategory.click());

    expect(nestedCategory).not.toBeInTheDocument();

    await act(async () => secondCategory.click());

    const nestedCategory2 = screen.getByTestId(categories[1].children[0].id);

    expect(nestedCategory2).toBeInTheDocument();

    mock.mockRestore();
});
