import { create } from 'zustand';

export const useStore = create((set) => ({
    isDarkMode: false,
    toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

    notifications: [
        { id: '1', type: 'warning', title: 'AI Fleet Diverted', message: 'Unit V-001 rerouted due to heavy traffic on NH-45.' }
    ],
    addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, { ...notification, id: Date.now().toString() }]
    })),
    removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
    })),
}));
