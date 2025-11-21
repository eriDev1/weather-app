// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Polyfill fetch APIs for MSW - try undici first, fallback to Node's built-in
try {
  const { fetch, Request, Response, Headers } = require('undici')
  global.fetch = fetch
  global.Request = Request
  global.Response = Response
  global.Headers = Headers
} catch {
  // Node 18+ has built-in fetch, but it might not be available in jsdom environment
  // Use a minimal polyfill if needed
  if (typeof global.Response === 'undefined') {
    const { Response: NodeResponse, Request: NodeRequest, Headers: NodeHeaders } = require('undici')
    global.Response = NodeResponse
    global.Request = NodeRequest
    global.Headers = NodeHeaders
    global.fetch = require('undici').fetch
  }
}
