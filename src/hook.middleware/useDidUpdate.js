import { useEffect, useRef } from 'react'

function useDidUpdate(cb, deps = []) {
    const didMount = useRef(false)

    useEffect(() => {
        if (!didMount.current) {
            didMount.current = true
            return
        }
        cb()
    }, deps)

    return didMount.current
}

export default useDidUpdate

