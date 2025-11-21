import { useEffect, useState } from "react";
import axios from "axios";

export interface Challenge {
    challengeId: number;
    name: string;
    description: string;
}

export function useChallenges(){
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        axios
        .get("/api/z1/challenges/")
        .then((res) => {
            setChallenges(Array.isArray(res.data?.result) ? res.data.result : []);
            console.log(res.data.result)
        })
        .finally(() => setLoading(false));
    }, []);
    
    
    return { challenges, loading };

}