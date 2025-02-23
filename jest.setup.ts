// import "@testing-library/jest-dom/extend-expect";
// import '@testing-library/jest-dom'
import { jest } from '@jest/globals';

// Mock fetch
global.fetch = jest.fn(() => 
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({valid: true, message: 'Invalid corporation number'})
    }) as Promise<Response>
)
