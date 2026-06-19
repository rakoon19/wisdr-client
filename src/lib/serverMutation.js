// lib/serverMutation.js
import { getSession } from "@/actions/session";

const baseURL = 'http://localhost:5000';

export const serverMutation = async (path, data = null, methodApi = 'POST') => {
    try {
        const sessionData = await getSession();
        const token = sessionData?.session?.token;

        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };

        const response = await fetch(`${baseURL}${path}`, {
            method: methodApi.toUpperCase(),
            headers: headers,
            ...(data && { body: JSON.stringify(data) })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Returns direct parsed data payload safely 
        return await response.json(); 
    } catch (error) {
        console.error(`Mutation [${methodApi}] Failed:`, error);
        throw error; // Propagates nicely up into the UI try-catch block
    }
};