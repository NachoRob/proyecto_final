import { useEffect, useState } from 'react'
import api from '../api/client'

// Hook personalizado: trae las categorías una vez y las comparte entre vistas
let cache = null

const useCategories = () => {
  const [categories, setCategories] = useState(cache || [])

  useEffect(() => {
    if (cache) return
    api.get('/categories').then(({ data }) => {
      cache = data
      setCategories(data)
    })
  }, [])

  return categories
}

export default useCategories
