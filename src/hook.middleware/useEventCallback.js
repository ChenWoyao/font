import { useRef, useEffect, useCallback } from 'react'

export default function useEventCallback(fn, deps) {
    const ref = useRef(() => {
        throw new Error('cannot call an event handler while rendering')
    })

    useEffect(() => {
        ref.current = fn
    }, [fn, ...deps])

    return useCallback(() => {
        return ref.current.apply(null, arguments)
    }, [ref])
}
