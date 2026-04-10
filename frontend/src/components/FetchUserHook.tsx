

import { useState, useEffect } from "react";
import { apiGet } from "../utils/api";

export default function useFetchUser(userId: string) {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        if (!userId) return;

        const fetchUser = async () => {
            try {
                const res = await apiGet(`getUserInfo/${userId}`);
                if (!res.error) setUser(res);
            } catch (err) {
                console.error("Failed to fetch user data:", err);
            }
        };

        fetchUser();
    }, [userId]);

    return user;
}