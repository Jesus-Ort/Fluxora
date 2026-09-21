export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export const MAX_AMOUNT = 1_000_000_000_000

export const VALID_TRANSACTION_TYPES = ['Income', 'Expense']

export const isValidUUID = (value) => {
    return typeof value === 'string' && UUID_REGEX.test(value)
}

export const isValidAmount = (value) => {
    return (
        typeof value === 'number' &&
        Number.isFinite(value) &&
        value > 0 &&
        value <= MAX_AMOUNT &&
        Math.round(value * 100) / 100 === value
    )
}

export const isValidPercentage = (value) => {
    return (
        typeof value === 'number' &&
        Number.isFinite(value) &&
        value >= 0 &&
        value <= 100
    )
}

export const isValidEmail = (value) => {
    return (
        typeof value === 'string' &&
        value.length <= 254 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    )
}

export const isIn = (value, allowed) => {
    return typeof value === 'string' && allowed.includes(value)
}

export const isStringBetween = (value, min, max) => {
    if (typeof value !== 'string') return false
    const length = value.trim().length
    return length >= min && length <= max
}