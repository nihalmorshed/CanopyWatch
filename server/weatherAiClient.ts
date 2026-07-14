import FormData from 'form-data'

const BASE_URL = process.env.WEATHERAI_BASE_URL || 'https://api.weather-ai.co'
const API_KEY = process.env.WEATHERAI_API_KEY

if (!API_KEY) {
  console.warn('WARNING: WEATHERAI_API_KEY not set. API calls will fail.')
}

const getHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
  }
  if (API_KEY) {
    headers['Authorization'] = `Bearer ${API_KEY}`
  }
  return headers
}

export async function weatherAiGet<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value)
      }
    })
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: getHeaders(),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`WeatherAI API error: ${response.status} - ${error}`)
  }

  return response.json() as Promise<T>
}

export async function weatherAiPost<T>(
  endpoint: string,
  data: Record<string, unknown> | FormData,
  isMultipart = false
): Promise<T> {
  const headers = getHeaders()

  const options: RequestInit = {
    method: 'POST',
  }

  if (isMultipart) {
    // For multipart, don't set Content-Type - let the browser/form-data set it with boundary
    options.body = data as BodyInit
  } else {
    headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(data)
  }

  options.headers = headers

  const response = await fetch(`${BASE_URL}${endpoint}`, options)

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`WeatherAI API error: ${response.status} - ${error}`)
  }

  return response.json() as Promise<T>
}