# Weather App - TDD Project

A weather application built with Test-Driven Development (TDD) methodology using Next.js, Jest, and React Testing Library.

## Testing Framework

- **Jest**: Testing framework with code coverage
- **React Testing Library**: Component testing
- **MSW (Mock Service Worker)**: API mocking

## Running Tests

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
\`\`\`

## Test Coverage

The project maintains a minimum coverage threshold of 70% for:
- Branches
- Functions
- Lines
- Statements

## Test Structure

### Component Tests (`components/__tests__/`)
- User input validation
- Component rendering
- User interactions
- Error handling
- Loading states

### API Tests (`lib/__tests__/`)
- API request/response handling
- Error scenarios
- Network failures

## API Mocking

Mock API handlers are defined in `lib/mocks/handlers.ts`:
- Successful weather data responses
- Error responses (404, 500)
- Invalid input handling

## Project Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run development server:
\`\`\`bash
npm run dev
\`\`\`

3. Run tests:
\`\`\`bash
npm test
\`\`\`

## Test Report

For university TDD subject documentation, tests are organized as:

1. **User Input Tests**: Validates city name input
2. **API Mock Tests**: Tests weather data fetching with mocked responses
3. **Error Handling Tests**: Validates error states and messages
4. **Loading State Tests**: Ensures proper loading indicators
5. **Integration Tests**: Complete user flow from input to display

## Coverage Report

Run `npm run test:coverage` to generate a detailed coverage report in the `coverage/` directory.
