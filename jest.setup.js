// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock fetch globally for tests
global.fetch = jest.fn();

// Mock scrollIntoView (not available in jsdom)
Element.prototype.scrollIntoView = jest.fn();

// Mock Next.js server components for testing
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    next: jest.fn(),
    redirect: jest.fn(),
    rewrite: jest.fn(),
  },
}));

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

