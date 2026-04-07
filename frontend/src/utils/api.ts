
const BASE_URL = 'http://localhost:5001/api';

export const apiReq = async(endpont: string, data: object) => {

    try{
        const res = await fetch(`${BASE_URL}/${endpont}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return res.json();
    }catch(err){
        console.error('API request error:', err);
        throw err;
    }
}