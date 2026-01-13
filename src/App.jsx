import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * --- PONGAL FOOD FEAST 2026 ---
 * Neo-Brutalist UI with Compact Styled Copy Button
 */

const PRICE_PER_COUPON = 165; 

const PAYEES = [
  { name: "Santhosh Nagaraj .m", vpa: "msanthoshnagaraj-2@okhdfcbank" },
  { name: "ARVIND M", vpa: "arvindms2017-2@okaxis" },
  { name: "SABARINATH M D", vpa: "sabarinathmd@oksbi" },
  { name: "MUGIL NANDAKUMAR", vpa: "mugil.viji@okicici" }
];

const BACKEND_URL = "https://iodimetric-malakai-indiscriminately.ngrok-free.dev"; 

// --- INLINE SVG ICONS ---
const Icon = ({ paths, size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>{paths}</svg>
);

const UserIcon = (p) => <Icon {...p} paths={<><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>} />;
const MailIcon = (p) => <Icon {...p} paths={<><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></>} />;
const HashIcon = (p) => <Icon {...p} paths={<><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></>} />;
const CreditCardIcon = (p) => <Icon {...p} paths={<><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></>} />;
const PartyPopperIcon = (p) => <Icon {...p} paths={<><path d="M5.8 11.3 2 22l10.7-3.8Z" /><path d="m22 2-1.5 1.5" /><path d="m15 8.5-4.5 4.5" /></>} />;
const SwitchIcon = (p) => <Icon {...p} paths={<><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></>} />;
const CopyIcon = (p) => <Icon {...p} paths={<><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></>} />;

const App = () => {
  const [payeeIndex, setPayeeIndex] = useState(0); 
  const [formData, setFormData] = useState({ name: '', rollNumber: '', emailId: '', utrId: '', quantity: 1 });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [upiUrl, setUpiUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copyStatus, setCopyStatus] = useState('Copy VPA ID');

  const activePayee = PAYEES[payeeIndex];
  const totalAmount = formData.quantity * PRICE_PER_COUPON;

  useEffect(() => {
    const refId = Math.random().toString(36).substring(2, 7).toUpperCase();
    const timestamp = new Date().getTime().toString().slice(-4);
    const note = `Ref:PONGAL-${timestamp}-${refId}`;
    const url = `upi://pay?pa=${activePayee.vpa}&pn=${encodeURIComponent(activePayee.name)}&cu=INR&tn=${encodeURIComponent(note)}`;
    setUpiUrl(url);
  }, [formData.quantity, activePayee]);

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(activePayee.vpa);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus('Copy VPA ID'), 2000);
  };

  const togglePayee = () => {
    setPayeeIndex((prev) => (prev + 1) % PAYEES.length);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setErrorMsg('');
    setLoading(true);

    try {
      const payload = { ...formData, payeeVpa: activePayee.vpa };
      const response = await axios.post(`${BACKEND_URL}/submit`, payload);
      if (response.status === 200) {
        setSubmitted(true);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setErrorMsg('');
    setFormData({ name: '', rollNumber: '', emailId: '', utrId: '', quantity: 1 });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-yellow-400 flex items-center justify-center p-6 text-gray-900">
        <div className="bg-white rounded-[2.5rem] shadow-brutal p-8 md:p-12 max-w-md w-full text-center border-4 border-black relative z-10">
          <PartyPopperIcon className="w-10 h-10 text-orange-600 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-black mb-2 uppercase festive-title italic">Success!</h2>
          <p className="text-lg font-bold text-gray-700 mb-8 leading-snug">
            Coupon sent to <span className="text-blue-600 underline break-all font-black">{formData.emailId}</span>!
          </p>
          <button onClick={handleReset} className="w-full bg-orange-500 text-white font-black py-5 rounded-2xl shadow-brutal-sm active:translate-x-1 active:translate-y-1 transition-all border-4 border-black uppercase tracking-widest text-lg">Book More</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-500 flex items-center justify-center p-3 md:p-8 relative overflow-hidden text-gray-900">
      <div className="max-w-6xl w-full bg-white rounded-[2rem] md:rounded-[3.5rem] shadow-brutal-lg flex flex-col md:flex-row border-4 border-black relative z-10 overflow-hidden">
        
        {/* Payment Section (Left) */}
        <div className="md:w-[42%] bg-yellow-400 p-6 md:p-12 border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col justify-between text-black">
          <div>
            <h1 className="text-5xl md:text-7xl font-black leading-none uppercase mb-6 transform -skew-x-2 festive-title">
              Pongal <br/> <span className="text-orange-600">Food</span> <br/> <span className="bg-white px-2">Feast.</span>
            </h1>
            
            <div className="mt-4 p-5 bg-white border-4 border-black shadow-brutal rounded-[2.5rem] text-center flex flex-col items-center mx-auto w-fit max-w-full">
              <p className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest leading-none">Step 1: Quantity & Pay</p>
              
              <div className="mb-4 w-full flex gap-2">
                <div className="relative flex-1">
                   <select 
                    className="w-full px-4 py-2 bg-gray-100 font-black cursor-pointer appearance-none outline-none border-4 border-black rounded-xl focus:bg-white text-black text-center" 
                    value={formData.quantity} 
                    onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
                  >
                    {[1, 2, 3, 5, 10].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Coupon' : 'Coupons'}</option>)}
                  </select>
                </div>
              </div>

              <div className="text-4xl md:text-5xl font-black text-orange-600 mb-1 italic tracking-tighter leading-none">₹{totalAmount}</div>
              
              <div className="mb-2">
                <p className="text-[10px] font-black text-gray-800 uppercase tracking-tight leading-tight">Payee: {activePayee.name}</p>
                <p className="text-[10px] font-bold text-blue-600 tracking-wider font-mono">{activePayee.vpa}</p>
              </div>

              <p className="text-[11px] font-black text-red-600 mb-4 uppercase tracking-tighter italic animate-pulse">
                ⚠️ Enter ₹{totalAmount} manually in app!
              </p>
              
              {/* Compact QR Container */}
              <div className="bg-white p-2 border-4 border-black rounded-2xl shadow-brutal-sm flex flex-col items-center justify-center overflow-hidden">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(upiUrl)}`} 
                  alt="Payment QR" 
                  className="w-44 h-44 sm:w-52 sm:h-52 md:w-64 md:h-64 object-contain" 
                />
              </div>

              {/* COMPACT THEMED COPY BUTTON */}
              <button 
                 type="button" 
                 onClick={handleCopyVpa}
                 className="mt-3 w-fit bg-white text-black font-black py-1.5 px-4 rounded-lg border-[3px] border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 uppercase text-[9px] tracking-widest group"
              >
                <CopyIcon size={12} className="group-hover:text-blue-600 transition-colors" />
                {copyStatus}
              </button>

              <button type="button" onClick={togglePayee} className="mt-4 text-[10px] font-black uppercase underline decoration-2 underline-offset-4 hover:text-orange-600 transition-colors flex items-center gap-2">
                <SwitchIcon size={14} />
                Switch Payee ({payeeIndex + 1}/{PAYEES.length})
              </button>
            </div>
          </div>

          <div className="mt-8 flex justify-center md:justify-start">
             <div className="bg-orange-500 text-white py-2.5 px-6 rounded-full border-4 border-black shadow-brutal-sm flex items-center gap-3 rotate-1 whitespace-nowrap">
                <PartyPopperIcon className="w-5 h-5 text-white" />
                <p className="text-sm font-black uppercase italic leading-none">Instant QR Code via Mail</p>
             </div>
          </div>
        </div>

        {/* Form Section (Right) */}
        <div className="md:w-[58%] p-6 sm:p-10 lg:p-14 bg-white text-black flex flex-col justify-between">
          <div>
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-black uppercase italic festive-title">Step 2: Register</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Fill details after scanning the QR code</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-2">
                      <UserIcon size={14}/> Student Name
                    </label>
                    <input 
                      type="text" 
                      maxLength={20}
                      placeholder="Enter your name"
                      className="w-full px-5 py-4 bg-gray-100 font-bold outline-none border-4 border-black rounded-2xl focus:bg-white transition-colors" 
                      value={formData.name} 
                      onChange={e => {setFormData({...formData, name: e.target.value}); setErrorMsg('');}} 
                      required 
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-2">
                      <HashIcon size={14}/> Roll Number
                    </label>
                    <input 
                      type="text" 
                      maxLength={7}
                      placeholder="23MS123"
                      className="w-full px-5 py-4 bg-gray-100 font-bold outline-none border-4 border-black rounded-2xl focus:bg-white transition-colors" 
                      value={formData.rollNumber} 
                      onChange={e => {setFormData({...formData, rollNumber: e.target.value}); setErrorMsg('');}} 
                      required 
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-2">
                      <MailIcon size={14}/> Email ID
                    </label>
                    <input 
                      type="email" 
                      placeholder="xxx@iiserkol.ac.in"
                      className="w-full px-5 py-4 bg-gray-100 font-bold outline-none border-4 border-black rounded-2xl focus:bg-white transition-colors" 
                      value={formData.emailId} 
                      onChange={e => {setFormData({...formData, emailId: e.target.value}); setErrorMsg('');}} 
                      required 
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1 p-5 bg-orange-50 border-4 border-dashed border-orange-300 rounded-3xl relative">
                    <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-2">
                      <CreditCardIcon size={14}/> Payment Transaction ID
                    </label>
                    
                    {errorMsg && (
                      <div className="text-red-600 font-black text-[10px] absolute right-5 top-5 animate-bounce z-20">
                        {errorMsg}
                      </div>
                    )}

                    <input 
                      type="text" 
                      maxLength={12}
                      placeholder="Paste the 12-digit ID"
                      className={`w-full px-5 py-4 mt-2 bg-white border-4 rounded-2xl font-black text-orange-600 outline-none shadow-brutal-sm ${errorMsg ? 'border-red-600' : 'border-black'}`} 
                      value={formData.utrId} 
                      onChange={e => {setFormData({...formData, utrId: e.target.value}); setErrorMsg('');}} 
                      required 
                    />
                  </div>
               </div>

               <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-orange-500 text-white font-black py-6 rounded-3xl border-4 border-black shadow-brutal active:translate-x-1 active:translate-y-1 transition-all uppercase tracking-widest text-xl mt-4 disabled:bg-gray-400"
               >
                 {loading ? "Validating..." : "Register Now!"}
               </button>
            </form>
          </div>

          <div className="mt-8 text-right">
             <p className="text-[11px] font-black opacity-20 uppercase tracking-widest italic">Made by I2019ZF</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;