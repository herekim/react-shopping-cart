import { useCallback } from 'react'
import { useParams } from 'react-router-dom'

const useProductInfo = () => {
  const { id } = useParams()

  const getProductId = useCallback(() => {
    if (id === '0') {
      return Number(id)
    }
    if (id && id !== 'null') {
      return Number(id)
    }
    if (sessionStorage.getItem('productId')) {
      return Number(sessionStorage.getItem('productId'))
    }
    return null
  }, [id])

  return { getProductId }
}

export default useProductInfo
