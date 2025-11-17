import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// Setup mock server for Node environment (Jest)
export const server = setupServer(...handlers)
