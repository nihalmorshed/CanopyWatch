/**
 * Custom SVG Weather Icons
 * Organic, hand-drawn style matching the Canopy Watch aesthetic
 */

interface WeatherIconProps {
  condition: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const SIZES = {
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
}

/**
 * Get SVG paths based on weather condition
 * WMO Weather codes: https://open-meteo.com/en/docs
 * 0: Clear sky
 * 1, 2, 3: Mainly clear, partly cloudy, overcast
 * 45, 48: Fog
 * 51, 53, 55: Drizzle
 * 61, 63, 65: Rain
 * 71, 73, 75: Snow
 * 80, 81, 82: Rain showers
 * 95, 96, 99: Thunderstorm
 */
export function WeatherIcon({ condition, size = 'lg', className = '' }: WeatherIconProps) {
  const dim = SIZES[size]
  const strokeWidth = size === 'sm' ? 1.5 : 2

  // Clear / Mainly clear
  if (condition === 0 || condition === 1) {
    return (
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 64 64"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        {/* Sun rays */}
        <circle cx="32" cy="32" r="14" fill="#F59E0B" />
        <g stroke="#F59E0B" strokeWidth={strokeWidth} strokeLinecap="round">
          <line x1="32" y1="4" x2="32" y2="12" />
          <line x1="32" y1="52" x2="32" y2="60" />
          <line x1="4" y1="32" x2="12" y2="32" />
          <line x1="52" y1="32" x2="60" y2="32" />
          <line x1="12.2" y1="12.2" x2="18.1" y2="18.1" />
          <line x1="45.9" y1="45.9" x2="51.8" y2="51.8" />
          <line x1="12.2" y1="51.8" x2="18.1" y2="45.9" />
          <line x1="45.9" y1="18.1" x2="51.8" y2="12.2" />
        </g>
      </svg>
    )
  }

  // Partly cloudy
  if (condition === 2) {
    return (
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 64 64"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        {/* Sun */}
        <circle cx="44" cy="20" r="10" fill="#F59E0B" />
        <g stroke="#F59E0B" strokeWidth={strokeWidth} strokeLinecap="round">
          <line x1="44" y1="4" x2="44" y2="10" />
          <line x1="44" y1="30" x2="44" y2="36" />
          <line x1="28" y1="20" x2="34" y2="20" />
          <line x1="54" y1="20" x2="60" y2="20" />
        </g>
        {/* Cloud */}
        <path
          d="M16 44c0-6.627 5.373-12 12-12 1.757 0 3.418.378 4.908 1.064A9.972 9.972 0 0 1 36 44H16Z"
          fill="#E2E8F0"
          stroke="#94A3B8"
          strokeWidth={strokeWidth}
        />
      </svg>
    )
  }

  // Overcast
  if (condition === 3) {
    return (
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 64 64"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M12 44c0-8.284 6.716-15 15-15 2.196 0 4.28.473 6.136 1.33A14.967 14.967 0 0 1 38 44H12Z"
          fill="#CBD5E1"
          stroke="#64748B"
          strokeWidth={strokeWidth}
        />
      </svg>
    )
  }

  // Fog
  if (condition >= 45 && condition <= 48) {
    return (
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 64 64"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        <g stroke="#94A3B8" strokeWidth={strokeWidth} strokeLinecap="round" opacity="0.7">
          <line x1="8" y1="20" x2="56" y2="20" />
          <line x1="8" y1="32" x2="56" y2="32" />
          <line x1="8" y1="44" x2="56" y2="44" />
        </g>
      </svg>
    )
  }

  // Drizzle / Light rain
  if ((condition >= 51 && condition <= 57) || (condition >= 61 && condition <= 61)) {
    return (
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 64 64"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        {/* Cloud */}
        <path
          d="M12 38c0-6.627 5.373-12 12-12 1.757 0 3.418.378 4.908 1.064A9.972 9.972 0 0 1 32 38H12Z"
          fill="#94A3B8"
          stroke="#64748B"
          strokeWidth={strokeWidth}
        />
        {/* Rain drops */}
        <g stroke="#3B82F6" strokeWidth={strokeWidth} strokeLinecap="round">
          <line x1="18" y1="44" x2="18" y2="52" />
          <line x1="32" y1="44" x2="32" y2="52" />
          <line x1="46" y1="44" x2="46" y2="52" />
        </g>
      </svg>
    )
  }

  // Rain
  if (condition >= 62 && condition <= 67) {
    return (
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 64 64"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        {/* Dark cloud */}
        <path
          d="M8 36c0-7.732 6.268-14 14-14 2.053 0 4.001.442 5.756 1.245A14.96 14.96 0 0 1 32 36H8Z"
          fill="#475569"
          stroke="#334155"
          strokeWidth={strokeWidth}
        />
        {/* Rain drops */}
        <g stroke="#3B82F6" strokeWidth={strokeWidth} strokeLinecap="round">
          <line x1="12" y1="42" x2="12" y2="54" />
          <line x1="24" y1="42" x2="24" y2="54" />
          <line x1="36" y1="42" x2="36" y2="54" />
          <line x1="48" y1="42" x2="48" y2="54" />
        </g>
      </svg>
    )
  }

  // Snow
  if ((condition >= 71 && condition <= 77) || (condition >= 85 && condition <= 86)) {
    return (
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 64 64"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        {/* Cloud */}
        <path
          d="M12 38c0-6.627 5.373-12 12-12 1.757 0 3.418.378 4.908 1.064A9.972 9.972 0 0 1 32 38H12Z"
          fill="#CBD5E1"
          stroke="#64748B"
          strokeWidth={strokeWidth}
        />
        {/* Snowflakes */}
        <g fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1">
          <circle cx="18" cy="48" r="2" />
          <circle cx="32" cy="46" r="2" />
          <circle cx="46" cy="48" r="2" />
        </g>
      </svg>
    )
  }

  // Rain showers
  if (condition >= 80 && condition <= 82) {
    return (
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 64 64"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        {/* Sun behind cloud */}
        <circle cx="48" cy="16" r="8" fill="#F59E0B" />
        {/* Cloud */}
        <path
          d="M12 34c0-5.524 4.476-10 10-10 1.464 0 2.849.315 4.091.887A8.31 8.31 0 0 1 30 34H12Z"
          fill="#CBD5E1"
          stroke="#64748B"
          strokeWidth={strokeWidth}
        />
        {/* Rain drops */}
        <g stroke="#3B82F6" strokeWidth={strokeWidth} strokeLinecap="round">
          <line x1="16" y1="40" x2="16" y2="48" />
          <line x1="28" y1="40" x2="28" y2="48" />
          <line x1="40" y1="40" x2="40" y2="48" />
          <line x1="52" y1="40" x2="52" y2="48" />
        </g>
      </svg>
    )
  }

  // Thunderstorm
  if (condition >= 95) {
    return (
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 64 64"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        {/* Dark cloud */}
        <path
          d="M8 32c0-7.732 6.268-14 14-14 2.053 0 4.001.442 5.756 1.245A14.96 14.96 0 0 1 32 32H8Z"
          fill="#334155"
          stroke="#1E293B"
          strokeWidth={strokeWidth}
        />
        {/* Lightning bolt */}
        <path
          d="M28 32l-4 12h8l-6 16"
          stroke="#F59E0B"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    )
  }

  // Default - partly cloudy
  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M16 44c0-6.627 5.373-12 12-12 1.757 0 3.418.378 4.908 1.064A9.972 9.972 0 0 1 36 44H16Z"
        fill="#CBD5E1"
        stroke="#64748B"
        strokeWidth={strokeWidth}
      />
    </svg>
  )
}

/**
 * Get SVG weather icon element for use in JSX
 */
export function getWeatherIconSvg(condition: number): JSX.Element {
  return <WeatherIcon condition={condition} />
}