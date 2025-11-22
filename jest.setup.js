import '@testing-library/jest-dom'

try {
  const { fetch, Request, Response, Headers } = require('undici')
  global.fetch = fetch
  global.Request = Request
  global.Response = Response
  global.Headers = Headers
} catch {
  if (typeof global.Response === 'undefined') {
    const { Response: NodeResponse, Request: NodeRequest, Headers: NodeHeaders } = require('undici')
    global.Response = NodeResponse
    global.Request = NodeRequest
    global.Headers = NodeHeaders
    global.fetch = require('undici').fetch
  }
}

const localStorageMock = (() => {
  let store = {}

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString()
    },
    removeItem: (key) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
}

Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
})
