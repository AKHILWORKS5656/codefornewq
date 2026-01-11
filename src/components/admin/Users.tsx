import React, { useState, useEffect } from 'react';
import { api } from '../../mockApi';
import { User } from '../../types';
import { SectionLoader } from '../common/ProfessionalLoaders';

const Users: React.FC = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<{ id: string; name: string; type: 'BAN' | 'UNBAN' | 'REMOVE' } | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const handleActionClick = (id: string, name: string, type: 'BAN' | 'UNBAN' | 'REMOVE') => {
    setConfirming({ id, name, type });
  };

  const processAction = async () => {
    if (!confirming) return;
    const { id, type } = confirming;
    setLoading(true);

    try {
      if (type === 'REMOVE') {
        await api.deleteUser(id);
        setUsers(prev => prev.filter(u => u.id !== id));
        setSuccessMsg(`Successfully Removed User ${id}`);
      } else {
        const newStatus = type === 'BAN' ? 'banned' : 'active';
        await api.updateUserStatus(id, newStatus);
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
        setSuccessMsg(`Successfully ${type === 'BAN' ? 'Banned' : 'Unbanned'} User ${id}`);
      }
    } catch (err) {
      console.error('Action failed:', err);
    } finally {
      setLoading(false);
      setConfirming(null);
    }
  };

  if (loading && users.length === 0) return <SectionLoader message="Syncing User Directory..." />;

  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in relative">
      {successMsg && (
        <div className="fixed top-24 right-10 z-[1000] bg-[#1e293b] text-white px-8 py-4 rounded-2xl shadow-2xl border border-green-500/30 flex items-center animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-4 text-green-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="font-black text-xs uppercase tracking-widest">{successMsg}</span>
        </div>
      )}

      {confirming && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#1e293b] border border-white/10 rounded-[3rem] w-full max-w-sm p-12 shadow-2xl animate-fade-in text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              confirming.type === 'BAN' ? 'bg-orange-500/10 text-orange-400' : 
              confirming.type === 'UNBAN' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
            }`}>
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 {confirming.type === 'REMOVE' ? (
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                 ) : (
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                 )}
               </svg>
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-4">{confirming.type} User?</h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-10 leading-relaxed">
              Confirm action for <span className="text-white">{confirming.name}</span> <br/>
              (<span className="text-[#D4AF37]">{confirming.id}</span>)?
            </p>
            <div className="flex gap-4">
              <button onClick={() => setConfirming(null)} className="flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-400 hover:bg-white/5 border border-white/5 transition-all">CANCEL</button>
              <button onClick={processAction} disabled={loading} className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-white shadow-xl transition-all flex items-center justify-center ${confirming.type === 'BAN' ? 'bg-orange-600 shadow-orange-500/10' : confirming.type === 'UNBAN' ? 'bg-green-600 shadow-green-500/10' : 'bg-red-600 shadow-red-500/10'}`}>
                {loading ? <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div> : 'YES'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#1e293b]/50 p-10 rounded-[3rem] border border-white/5 shadow-xl">
        <div className="relative max-w-xl">
          <input type="text" placeholder="Search users by name or email..." className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-14 py-4 text-sm focus:border-[#D4AF37] outline-none text-white font-medium shadow-inner" value={search} onChange={(e) => setSearch(e.target.value)} />
          <span className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30 text-xl">🔍</span>
        </div>
      </div>

      <div className="bg-[#1e293b]/50 rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl min-h-[400px]">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">User ID</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Details</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Country</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-600 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(user => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-10 py-6 text-sm font-bold text-gray-500">{user.id}</td>
                    <td className="px-10 py-6">
                      <p className="text-sm font-black text-white">{user.name}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{user.email}</p>
                    </td>
                    <td className="px-10 py-6 text-sm font-bold text-gray-400">{user.country}</td>
                    <td className="px-10 py-6">
                      <div className={`${user.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'} px-4 py-1 rounded-full border w-fit`}>
                        <span className="text-[9px] font-black uppercase tracking-widest">{user.status}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right space-x-6">
                      <button onClick={() => handleActionClick(user.id, user.name, user.status === 'active' ? 'BAN' : 'UNBAN')} className={`text-[10px] font-black uppercase tracking-widest hover:underline transition-all ${user.status === 'active' ? 'text-orange-400' : 'text-green-400'}`}>
                        {user.status === 'active' ? 'BAN' : 'UNBAN'}
                      </button>
                      <button onClick={() => handleActionClick(user.id, user.name, 'REMOVE')} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline transition-all">REMOVE</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-24 text-center">
                <p className="text-gray-600 font-black uppercase text-xs tracking-[0.3em]">Zero account records found.</p>
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default Users;