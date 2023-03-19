import { useState } from 'react'

type UseMutationResult<TData, TVariables> = {
  data: TData | null
  error: string | null
  isLoading: boolean
  mutate: (variables?: TVariables) => Promise<TData | null>
}

function useMutation<TData, TVariables>(
  url: string,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST',
): UseMutationResult<TData, TVariables> {
  const [data, setData] = useState<TData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const mutate = async (variables?: TVariables): Promise<TData | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(variables),
      })

      const responseData = (await response.json()) as TData

      if (!response.ok) {
        return Promise.reject(`response.ok에서 false가 반환됐어요. 에러 내용: ${String(error)}`)
      }

      setData(responseData)

      return responseData
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(String(error))
      }
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { data, error, isLoading, mutate }
}

export default useMutation
