import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';

// callback is the setter function
export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = axiosInstance.get('/auth/check');
            set({ authUser: res.data });
        } catch (error) {
            console.log("Error checking auth:", error);
            set({ authUser: null });//user not authenticated
        }
        finally {
            set({ isCheckingAuth: false });
        }
    },

    signUp: async (data) => {

    }
}));