import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from '../theme-toggle'

const mockSetTheme = jest.fn()
const mockUseTheme = jest.fn(() => ({
  theme: 'light',
  setTheme: mockSetTheme,
  resolvedTheme: 'light',
}))

jest.mock('next-themes', () => ({
  useTheme: () => mockUseTheme(),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
      resolvedTheme: 'light',
    })
  })

  test('renders theme toggle button', async () => {
    render(<ThemeToggle />)
    
    await waitFor(() => {
      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
    })
  })

  test('toggles dark mode and saves preference', async () => {
    const user = userEvent.setup()

    render(<ThemeToggle />)

    const toggle = screen.getByTestId('theme-toggle')
    await user.click(toggle)

    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  test('toggles light mode from dark mode', async () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
      resolvedTheme: 'dark',
    })

    const user = userEvent.setup()

    render(<ThemeToggle />)

    const toggle = screen.getByTestId('theme-toggle')
    await user.click(toggle)

    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  test('shows sun icon in dark mode', async () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
      resolvedTheme: 'dark',
    })

    render(<ThemeToggle />)

    await waitFor(() => {
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument()
    })
  })

  test('shows moon icon in light mode', async () => {
    render(<ThemeToggle />)

    await waitFor(() => {
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
    })
  })
})

