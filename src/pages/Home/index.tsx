import React, { useRef, useMemo, useState, useEffect } from 'react'
import dayjs from 'dayjs';
// import styles from './styles.module.scss'
// import { Store as GlobalStore } from '../../hook.redux/global'

type noop = (...args: any[]) => any;

type TDate = Date | number | string | undefined;

type Options = {
    targetDate?: TDate;
    interval?: number;
    onEnd?: () => void;
};

interface FormattedRes {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
}

/**
 * 在某些场景中，你可能会需要用 useCallback 记住一个回调，但由于内部函数必须经常重新创建，记忆效果不是很好，导致子组件重复 render。对于超级复杂的子组件，重新渲染会对性能造成影响。通过 usePersistFn，可以保证函数地址永远不会变化。
 * @param fn
 * @returns
 */
function usePersistFn<T extends noop>(fn: T) {
    const fnRef = useRef<T>(fn);
    fnRef.current = fn;

    const persistFn = useRef<T>();
    if (!persistFn.current) {
        persistFn.current = function (...args) {
            console.log('this', this)
            console.log('this', persistFn)
            return fnRef.current!.apply(this, args);
        } as T;
    }

    return persistFn.current!;
}


const calcLeft = (t?: TDate) => {
    if (!t) {
        return 0;
    }
    // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
    const left = dayjs(t).valueOf() - new Date().getTime();
    if (left < 0) {
        return 0;
    }
    return left;
};

const parseMs = (milliseconds: number): FormattedRes => {
    return {
        days: Math.floor(milliseconds / 86400000),
        hours: Math.floor(milliseconds / 3600000) % 24,
        minutes: Math.floor(milliseconds / 60000) % 60,
        seconds: Math.floor(milliseconds / 1000) % 60,
        milliseconds: Math.floor(milliseconds) % 1000,
    };
};

const useCountdown = (options?: Options) => {
    const { targetDate, interval = 1000, onEnd } = options || {};

    const [target, setTargetDate] = useState<TDate>(targetDate);
    const [timeLeft, setTimeLeft] = useState(() => calcLeft(target));

    const onEndPersistFn = usePersistFn(() => {
        if (onEnd) {
            onEnd();
        }
    });

    useEffect(() => {
        if (!target) {
            // for stop
            setTimeLeft(0);
            return;
        }

        // 立即执行一次
        setTimeLeft(calcLeft(target));

        const timer = setInterval(() => {
            const targetLeft = calcLeft(target);
            setTimeLeft(targetLeft);
            if (targetLeft === 0) {
                clearInterval(timer);
                onEndPersistFn();
            }
        }, interval);

        return () => clearInterval(timer);
    }, [target, interval]);

    const formattedRes = useMemo(() => {
        return parseMs(timeLeft);
    }, [timeLeft]);

    return [timeLeft, setTargetDate, formattedRes] as const;
};


function Person() {
    this.name = 'woyao';
    this.sayHello = function () {
        console.log(this.name)
    }
}

let person = new Person();

const Home: React.FC<{}> = () => {
    // const { dispatch: globalDispatch, state: globalState } = useContext(GlobalStore)
    // const { userInfo } = globalState

    const [countdown, setTargetDate, formattedRes] = useCountdown({
        targetDate: '2022-12-31 24:00:00',
        // targetDate: Date.now() + 5000,
        onEnd: person.sayHello,
    });
    const { days, hours, minutes, seconds, milliseconds } = formattedRes;

    return (
        <>
            <p>
                There are {days} days {hours} hours {minutes} minutes {seconds} seconds {milliseconds}{' '}
                milliseconds until 2021-12-31 24:00:00
            </p>
        </>
    );
}

export default Home
