import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set) => ({
      user: { name: 'Aryan' },
      role: 'admin',
      transactions: [
        { id: 1, date: '2026-04-01', merchant: 'Monthly Salary', category: 'Income', amount: 120000, type: 'income' },
        { id: 2, date: '2026-04-02', merchant: 'Rent', category: 'Housing', amount: -25000, type: 'expense' },
        { id: 3, date: '2026-04-02', merchant: 'Swiggy', category: 'Food & Drink', amount: -1250, type: 'expense' },
        { id: 4, date: '2026-04-03', merchant: 'Zomato', category: 'Food & Drink', amount: -850, type: 'expense' },
        { id: 5, date: '2026-04-03', merchant: 'Amazon India', category: 'Shopping', amount: -4200, type: 'expense' },
        { id: 6, date: '2026-04-04', merchant: 'Airtel', category: 'Utilities', amount: -999, type: 'expense' },
        { id: 7, date: '2026-04-05', merchant: 'BESCOM', category: 'Utilities', amount: -1800, type: 'expense' },
        { id: 8, date: '2026-04-05', merchant: 'Netflix India', category: 'Entertainment', amount: -649, type: 'expense' },
        { id: 9, date: '2026-04-08', merchant: 'Mirae SIP', category: 'SIP Investment', amount: 10000, type: 'income' },
        { id: 10, date: '2026-04-10', merchant: 'Freelance Payment', category: 'Income', amount: 35000, type: 'income' },
        { id: 11, date: '2026-04-12', merchant: 'HDFC Car EMI', category: 'EMI', amount: -15000, type: 'expense' },
      ],
      nseData: [],

      setUser: (user) => set({ user }),
      setRole: (role) => set({ role }),
      setNSEData: (data) => set({ nseData: data }),
      addTransaction: (tx) =>
        set((state) => ({
          transactions: [{ ...tx, id: Date.now() }, ...state.transactions],
        })),
      updateTransaction: (id, data) =>
        set((state) => ({
          transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...data } : t)),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
      logout: () => set({ user: null }),
    }),
    {
      name: 'finvault-storage',
      partialize: (state) => ({ user: state.user, role: state.role, transactions: state.transactions }),
    }
  )
)
