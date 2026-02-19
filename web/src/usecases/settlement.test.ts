import { describe, expect, test } from 'vitest'
import { calculateSettlement, getDividedPrice } from './settlement'

describe('settlement logic', () => {
  const p1 = {
    id: 'p1',
    name: 'Alice',
    icon: '👩',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  }
  const p2 = {
    id: 'p2',
    name: 'Bob',
    icon: '👨',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  }
  const participants = [p1, p2]

  describe('getDividedPrice', () => {
    test('単純な割り勘', () => {
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
        version: 1,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      }
      expect(getDividedPrice(item, 2)).toBe(500)
    })

    test('端数が出る場合（切り捨て）', () => {
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
        version: 1,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
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
        version: 1,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      }
      // 2人中1人免除なので1人で1000円
      expect(getDividedPrice(item, 2)).toBe(1000)
    })

    test('外貨の場合', () => {
      const usd = {
        id: 'usd',
        code: 'USD',
        rate: 150,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      }
      const item = {
        id: 'i1',
        name: 'Lunch',
        icon: '🍱',
        payer: p1,
        price: 10,
        currency: usd,
        amount: 1,
        total: 1500,
        exempts: [],
        version: 1,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      }
      // 10USD * 150 = 1500JPY. 1500 / 2 = 750
      expect(getDividedPrice(item, 2)).toBe(750)
    })
  })

  describe('calculateSettlement', () => {
    test('端数による余り(surplus)の計算', () => {
      const p3 = {
        id: 'p3',
        name: 'Charlie',
        icon: '🧒',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      }
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
        version: 1,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      }

      const result = calculateSettlement([item], ps, 's1')

      // Each pays Math.floor(100 / 3) = 33. Total 99. Remaining 1.
      expect(result.surplus).toBe(1)

      const d1 = result.details.find((d) => d.participant.id === 'p1')!
      expect(d1.total).toBe(33)
      expect(d1.paid).toBe(100)
      expect(d1.difference).toBe(-67)
      expect(d1.items).toHaveLength(1)
      expect(d1.items[0]!.subtotal).toBe(33)

      const d2 = result.details.find((d) => d.participant.id === 'p2')!
      expect(d2.total).toBe(33)
      expect(d2.paid).toBe(0)
      expect(d2.difference).toBe(33)

      const d3 = result.details.find((d) => d.participant.id === 'p3')!
      expect(d3.total).toBe(33)
      expect(d3.paid).toBe(0)
      expect(d3.difference).toBe(33)
    })
  })
})
