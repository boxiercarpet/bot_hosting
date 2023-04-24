export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    window.location = "/login"
  }

  return children;
}