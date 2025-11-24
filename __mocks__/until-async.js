module.exports = {
  until: jest.fn((predicate) => {
    return Promise.resolve(true)
  }),
}

