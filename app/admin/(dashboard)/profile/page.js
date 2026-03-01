import { connectDB } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import Image from "next/image";
import Link from "next/link";

export default async function AdminProfilePage() {
  await connectDB();
  const profileData = await Profile.findOne().lean();
  const profile = profileData ? JSON.parse(JSON.stringify(profileData)) : null;

  return (
    <div className='responsive-card' style={{
      maxWidth: '800px', margin: '2rem auto', width: '90dvw',
      display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem'
    }}>

      {/* Header */}
      <header className='singlerowdiv' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-fredoka)' }}>Profile Info</h1>
      </header>

   

      {/* Profile section */}
      <section className='responsive-card' style={{ padding: '2rem', width: '100%', opacity: '.5' }}>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
          {/* Avatar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', background: '#222', border: '2px solid var(--accent)' }}>
              {profile?.avatar
                ? <Image src={profile.avatar} alt="Profile" width={500} height={500} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ display: 'grid', placeItems: 'center', height: '100%', opacity: 0.5 }}>No Image</div>
              }
            </div>
          </div>

          {/* Info grid */}
          <div style={{ flex: 1, display: 'grid', gap: '1rem', minWidth: '250px' }}>
            <div className="input-group">
              <label style={{ width: '100%' }}>Full Name</label>
              <input style={{ width: '100%' }} disabled type="text" value={profile?.name || ''} readOnly />
            </div>
            <div className="input-group">
              <label style={{ width: '100%' }}>Job Title</label>
              <input style={{ width: '100%' }} disabled type="text" value={profile?.title || ''} readOnly />
            </div>
          </div>
        </div>

        <div className='responsive-card' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="input-group responsive-card">
            <label>Email Address</label>
            <input disabled type="email" value={profile?.email || ''} readOnly />
          </div>
          <div className='responsive-card'>
            <label>Location</label>
            <input disabled type="text" value={profile?.location || ''} readOnly />
          </div>
        </div>

        <div className='responsive-card' style={{ marginBottom: '1.5rem' }}>
          <label>Bio / About Me</label>
          <textarea disabled rows="4" value={profile?.bio || ''} readOnly
            style={{ background: 'rgba(255,255,255,0.05)', width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}
          />
        </div>

        <div className='responsive-card' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem', border: 'none' }}>
          {['github', 'linkedin', 'twitter'].map((network) => (
            <div key={network} className='responsive-card'>
              <label style={{ textTransform: 'capitalize' }}>{network}</label>
              <input disabled type="text" value={profile?.socials?.[network] || ''} readOnly />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <input disabled type="checkbox" checked={profile?.available ?? true} readOnly style={{ width: '20px', height: '20px' }} />
          <label>Available for Hire / Projects</label>
        </div>

      </section>
         {/* Action buttons */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem'}}>
        <Link href="/admin/profile/edit" className="edit-btn" style={{ background: 'var(--accent)', padding: '1%', borderRadius:'8px' }}>
          <i className="fa-solid fa-user-gear"></i> Edit Profile
        </Link>
      
      </div>
    </div>
  );
}