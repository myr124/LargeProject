
export default function doLogout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
}
