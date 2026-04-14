const defaultBaseUrl = (() => {
    if (import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL;
    }

    if (import.meta.env.MODE !== 'development' && typeof window !== 'undefined') {
        return `http://${window.location.hostname}:5001/api`;
    }

    return 'http://localhost:5001/api';
})();

export const apiReq = async(endpont: string, data: object) => {

    try{
        const route = endpont.replace(/^\/+/, '');
        const res = await fetch(`${defaultBaseUrl}/${route}`, {
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

export const apiGet = async(endpont: string) => {

    try{
        const route = endpont.replace(/^\/+/, '');
        const res = await fetch(`${defaultBaseUrl}/${route}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return res.json();
    }catch(err){
        console.error('API request error:', err);
        throw err;
    }
}
