import { test } from 'node:test'
import assert from 'node:assert/strict'

import {
    isValidUUID,
    isValidAmount,
    isValidPercentage,
    isValidEmail,
    isIn,
    isStringBetween,
    MAX_AMOUNT,
    VALID_TRANSACTION_TYPES
} from '../src/utils/validators.js'

const SAMPLE_UUID = '123e4567-e89b-42d3-a456-426614174000'

test('isValidUUID', () => {
    assert.equal(isValidUUID(SAMPLE_UUID), true)
    assert.equal(isValidUUID('abc'), false)
    assert.equal(isValidUUID('not-a-uuid'), false)
    assert.equal(isValidUUID('123e4567-e89b-42d3'), false)
    assert.equal(isValidUUID(''), false)
    assert.equal(isValidUUID(123), false)
    assert.equal(isValidUUID(null), false)
    assert.equal(isValidUUID(undefined), false)
})

test('isValidAmount', () => {
    assert.equal(isValidAmount(100), true)
    assert.equal(isValidAmount(0.01), true)
    assert.equal(isValidAmount(100.5), true)
    assert.equal(isValidAmount(MAX_AMOUNT), true)
    assert.equal(isValidAmount(100.999), false)
    assert.equal(isValidAmount(0), false)
    assert.equal(isValidAmount(-1), false)
    assert.equal(isValidAmount(-0.01), false)
    assert.equal(isValidAmount(Infinity), false)
    assert.equal(isValidAmount(-Infinity), false)
    assert.equal(isValidAmount(NaN), false)
    assert.equal(isValidAmount('100'), false)
    assert.equal(isValidAmount(MAX_AMOUNT + 1), false)
    assert.equal(isValidAmount(null), false)
    assert.equal(isValidAmount(undefined), false)
})

test('isValidPercentage', () => {
    assert.equal(isValidPercentage(0), true)
    assert.equal(isValidPercentage(20.5), true)
    assert.equal(isValidPercentage(100), true)
    assert.equal(isValidPercentage(100.1), false)
    assert.equal(isValidPercentage(-1), false)
    assert.equal(isValidPercentage('20'), false)
    assert.equal(isValidPercentage(NaN), false)
    assert.equal(isValidPercentage(null), false)
})

test('isValidEmail', () => {
    assert.equal(isValidEmail('john@example.com'), true)
    assert.equal(isValidEmail('john.doe+tag@sub.example.co'), true)
    assert.equal(isValidEmail('  john@example.com  '), false)
    assert.equal(isValidEmail('invalid'), false)
    assert.equal(isValidEmail('a@b'), false)
    assert.equal(isValidEmail('@example.com'), false)
    assert.equal(isValidEmail('john@'), false)
    assert.equal(isValidEmail(''), false)
    assert.equal(isValidEmail(null), false)
})

test('isIn', () => {
    assert.equal(isIn('Income', VALID_TRANSACTION_TYPES), true)
    assert.equal(isIn('Expense', VALID_TRANSACTION_TYPES), true)
    assert.equal(isIn('income', VALID_TRANSACTION_TYPES), false)
    assert.equal(isIn('Other', VALID_TRANSACTION_TYPES), false)
    assert.equal(isIn(42, VALID_TRANSACTION_TYPES), false)
    assert.equal(isIn(null, VALID_TRANSACTION_TYPES), false)
})

test('isStringBetween', () => {
    assert.equal(isStringBetween('hello', 3, 100), true)
    assert.equal(isStringBetween('  hello  ', 3, 100), true)
    assert.equal(isStringBetween('ab', 3, 100), false)
    assert.equal(isStringBetween('x'.repeat(101), 3, 100), false)
    assert.equal(isStringBetween(''.repeat(0), 1, 100), false)
    assert.equal(isStringBetween(123, 1, 100), false)
    assert.equal(isStringBetween(null, 1, 100), false)
})