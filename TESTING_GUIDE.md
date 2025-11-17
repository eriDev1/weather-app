# Testing Guide for Weather App TDD Project

## Test-Driven Development Workflow

### 1. Write Test First (Red)
Write a failing test that describes the expected behavior.

### 2. Make it Pass (Green)
Write minimal code to make the test pass.

### 3. Refactor (Refactor)
Clean up the code while keeping tests green.

## Test Categories

### Unit Tests
- **Location**: `lib/__tests__/`
- **Purpose**: Test individual functions in isolation
- **Example**: `weather-api.test.ts` - Tests API calls with mocked responses

### Component Tests
- **Location**: `components/__tests__/`
- **Purpose**: Test React components and user interactions
- **Example**: `weather-search.test.tsx` - Tests form input, search, and display

## Running Specific Tests

\`\`\`bash
# Run tests in a specific file
npm test weather-search.test.tsx

# Run tests matching a pattern
npm test -- --testNamePattern="displays weather data"

# Run tests with verbose output
npm test -- --verbose
\`\`\`

## Writing New Tests

### Test Structure
\`\`\`typescript
describe('Feature Name', () => {
  test('should do something specific', () => {
    // Arrange: Set up test data and conditions
    // Act: Execute the code being tested
    // Assert: Verify the results
  })
})
\`\`\`

### Best Practices

1. **Use descriptive test names**
   - ✅ "displays error message when city is not found"
   - ❌ "test error"

2. **Test user behavior, not implementation**
   - ✅ Click button and verify result
   - ❌ Test internal state directly

3. **Use data-testid for stable selectors**
   \`\`\`tsx
   <button data-testid="search-button">Search</button>
   \`\`\`

4. **Mock external dependencies**
   - Use MSW for API calls
   - Mock heavy computations
   - Isolate units under test

## Coverage Thresholds

Minimum 70% coverage required for:
- **Branches**: if/else statements
- **Functions**: All functions called
- **Lines**: Code lines executed
- **Statements**: Individual statements

## Common Testing Patterns

### Testing Async Operations
\`\`\`typescript
test('fetches data', async () => {
  render(<Component />)
  
  await waitFor(() => {
    expect(screen.getByText('Data')).toBeInTheDocument()
  })
})
\`\`\`

### Testing User Events
\`\`\`typescript
test('handles click', async () => {
  const user = userEvent.setup()
  render(<Component />)
  
  await user.click(screen.getByRole('button'))
  
  expect(screen.getByText('Clicked')).toBeInTheDocument()
})
\`\`\`

### Testing Error States
\`\`\`typescript
test('shows error', async () => {
  server.use(
    http.get('/api', () => HttpResponse.error())
  )
  
  render(<Component />)
  
  await waitFor(() => {
    expect(screen.getByText('Error')).toBeInTheDocument()
  })
})
\`\`\`

## Debugging Tests

### View Debug Output
\`\`\`typescript
import { screen } from '@testing-library/react'

test('debug example', () => {
  render(<Component />)
  screen.debug() // Prints current DOM
})
\`\`\`

### Check What's Rendered
\`\`\`bash
npm test -- --verbose
\`\`\`

## For Your TDD Report

### Test Documentation Format

**Nr**: 1  
**Përshkrimi i testit**: User can type city name in input field  
**Statusi**: ✅ Pass  
**Framework**: Jest + React Testing Library

Use this format for all tests in section 2 of your report.
