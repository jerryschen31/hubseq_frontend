/**
 * Web (component) test for the File Explorer table.
 *
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { FileListResults } from '../src/components/file/file-list-results';

// react-perfect-scrollbar touches layout APIs that jsdom doesn't implement;
// stub it to a plain wrapper for the test.
jest.mock('react-perfect-scrollbar', () => ({ children }) => <div>{children}</div>);

const mockFiles = [
  { id: 0, Key: 'project_alpha/', LastModified: '-', Size: 0 },
  { id: 1, Key: 'welcome.txt', LastModified: '2026-06-11 22:14', Size: 412 },
  { id: 2, Key: 'project_alpha/rnaseq/raw/sample1_R1.fastq.gz', LastModified: '2026-06-11 22:14', Size: 10485760 },
];

const noop = () => {};

const renderTable = () =>
  render(
    <FileListResults
      files={mockFiles}
      setFiles={noop}
      setFilteredResults={noop}
      setSearchInput={noop}
      currentPath=""
      setFilesSelected={noop}
      setCurrentPath={noop}
      session={{ idToken: 'demo' }}
    />
  );

describe('FileListResults', () => {
  test('renders a row for each object showing its basename', () => {
    renderTable();
    expect(screen.getByText('project_alpha/')).toBeInTheDocument();
    expect(screen.getByText('welcome.txt')).toBeInTheDocument();
    // nested key is displayed as just the file name
    expect(screen.getByText('sample1_R1.fastq.gz')).toBeInTheDocument();
  });

  test('renders the column headers', () => {
    renderTable();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Last Modified')).toBeInTheDocument();
    expect(screen.getByText('Size')).toBeInTheDocument();
  });

  test('formats size in KB', () => {
    renderTable();
    // 412 bytes -> 0.4 KB
    expect(screen.getByText('0.4 KB')).toBeInTheDocument();
  });
});
