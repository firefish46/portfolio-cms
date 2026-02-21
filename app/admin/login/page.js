'use client';
import { useState } from 'react';
import './login.css';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push('/admin/dashboard');
      router.refresh();
    } else {
      alert('Unauthorized access');
    }
  };

  return (
    <>
    <header className='glass'style={{display:'flex', height:'40px',alignItems:'center',justifyContent:'center ',borderRadius:'0px'  }}>Portolio-cms</header>
    <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
      <form onSubmit={handleLogin} className="login-container" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
        <h2>Admin Login</h2>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" style={{  color: 'white',  padding: '0.5rem', cursor: 'pointer' }}>Login</button>
      </form>
    </div>
    </>
  );
}