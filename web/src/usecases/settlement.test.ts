import { describe, expect, test } from 'vitest'
import { calculateSettlement, getDividedPrice } from './settlement'

describe('settlement logic', () => {
  const p1 = { id: 'p1', name: 'Alice', icon: '👩' }
  const p2 = { id: 'p2', name: 'Bob', icon: '👨' }
  const participants = [p1, p2]

  describe('getDividedPrice', () => {
    test('通常の計算', () => {
      const item = {
        id: 'i1',
        name: 'Lunch',
        icon: '🍱',
        payer: p1,
        price: 1000,
        currency: null,
        amount: 1,
        total: 1000,
        exempts: [],
      }
      expect(getDividedPrice(item, 2)).toBe(500)
    })

    test('端数が出る場合は切り捨て', () => {
      const item = {
        id: 'i1',
        name: 'Lunch',
        icon: '🍱',
        payer: p1,
        price: 100,
        currency: null,
        amount: 1,
        total: 100,
        exempts: [],
      }
      // 100 / 3 = 33.333... -> 33
      expect(getDividedPrice(item, 3)).toBe(33)
    })

    test('免除者がいる場合', () => {
      const item = {
        id: 'i1',
        name: 'Lunch',
        icon: '🍱',
        payer: p1,
        price: 1000,
        currency: null,
        amount: 1,
        total: 1000,
        exempts: [p2],
      }
      // 2人中1人免除なので1人で1000円
      expect(getDividedPrice(item, 2)).toBe(1000)
    })

    test('通貨レート適用', () => {
      const currency = { id: 'c1', code: 'USD', rate: 150 }
      const item = {
        id: 'i1',
        name: 'Lunch',
        icon: '🍱',
        payer: p1,
        price: 10,
        currency,
        amount: 1,
        total: 1500,
        exempts: [],
      }
      // 10 * 150 / 2 = 750
      expect(getDividedPrice(item, 2)).toBe(750)
    })
  })

  describe('calculateSettlement', () => {
    test('アイテムなし', () => {
      const result = calculateSettlement([], participants, [], 's1')
      expect(result.surplus).toBe(0)
      expect(result.details).toHaveLength(2)
      expect(result.details[0]!.total).toBe(0)
      expect(result.details[0]!.paid).toBe(0)
    })

    test('端数による余り(surplus)の計算', () => {
      const p3 = { id: 'p3', name: 'Charlie', icon: '🧒' }
      const ps = [p1, p2, p3]
      const item = {
        id: 'i1',
        name: 'Dinner',
        icon: '🍛',
        payer: p1,
        price: 100,
        currency: null,
        amount: 1,
        total: 100,
        exempts: [],
      }

      const result = calculateSettlement([item], ps, [], 's1')

      // Each pays Math.floor(100 / 3) = 33. Total 99. Remaining 1.
      expect(result.surplus).toBe(1)

      const d1 = result.details.find((d) => d.participant.id === 'p1')!
      expect(d1.total).toBe(33)
      expect(d1.paid).toBe(100)
      expect(d1.difference).toBe(-67) // 33 - 100

      const d2 = result.details.find((d) => d.participant.id === 'p2')!
      expect(d2.total).toBe(33)
      expect(d2.paid).toBe(0)
      expect(d2.difference).toBe(33)

      const d3 = result.details.find((d) => d.participant.id === 'p3')!
      expect(d3.total).toBe(33)
      expect(d3.paid).toBe(0)
      expect(d3.difference).toBe(33)

      // -67 + 33 + 33 = -1. abs(-1) = 1 (surplus)
    })
  })
})
