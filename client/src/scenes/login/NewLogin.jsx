// import { useState } from 'react'
// import { Eye, EyeOff, Lock, User } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import secureLocalStorage from "react-secure-storage";
// import axios from "axios";
// import { motion } from 'framer-motion';
// // import { LOGIN_API } from '../../../Api';
// import { generateSessionId } from '../../utils/hleper';
// // import Modal from '../../../UiComponents/Modal';
// // import BranchAndFinYearForm from '../../components/BranchAndFinyear';
// // import { PRODUCT_ADMIN_HOME_PATH } from '../../../Route/urlPaths';
// import Swal from 'sweetalert2';
// import { BASE_URL } from '../../constants/apiUrl';


// axios.defaults.baseURL = BASE_URL;

// // // Then call
// // axios.post("users/login", { username, password });

// // const BASE_URL = process.env.REACT_APP_SERVER_URL

// const Login = () => {

//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState('');
//     const [showPassword, setShowPassword] = useState(false)
//     // const [formData, setFormData] = useState({ email: email, password: password })
//     const [errors, setErrors] = useState({});
//     const [isGlobalOpen, setIsGlobalOpen] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [planExpirationDate, setPlanExpirationDate] = useState("");
//     const navigate = useNavigate();

//     // Validation function to check email and password
//     const validate = () => {
//         const errors = {};


//         if (!username) {
//             errors.email = "Email is required";
//         }
//         //  else if (
//         // ) {
//         //     errors.email = "Invalid email address";
//         // }

//         // Password validation
//         if (!password) {
//             errors.password = "Password is required";
//         }
//         //  else if (password.length < 6) {
//         //     errors.password = "Password must be at least 6 characters";
//         // }

//         return errors;
//     };

//     const data = { username, password }
//     const products = [
//         { title: 'GMS', desc: 'Garment ERP', icon: '👔', color: 'text-amber-500' },
//         { title: 'PMS', desc: 'Payroll System', icon: '💰', color: 'text-orange-500' },
//         { title: 'PCS', desc: 'Production Control', icon: '🏭', color: 'text-orange-600' },
//         { title: 'POS', desc: 'Retail POS', icon: '🛒', color: 'text-amber-600' },
//         { title: 'Costing', desc: 'Textile Costing', icon: '🧮', color: 'text-orange-700' },
//         { title: 'Lab Testing', desc: 'LIMS', icon: '🔬', color: 'text-amber-700' },
//     ];
//     const [isSubmitting, setIsSubmitting] = useState(false);


//     const handleSubmit = async (e) => {
//         e.preventDefault()

//         const validateErrors = validate()
//         setErrors(validateErrors)

//         if (Object.keys(validateErrors).length === 0) {


//             try {
//                 const result = await axios.post("users/login", { username, password });



//                 if (result.status === 200) {
//                     if (result.data.statusCode === 0) {
//                         secureLocalStorage.clear();
//                         sessionStorage.clear();
//                         sessionStorage.setItem("sessionId", generateSessionId());
//                         if (!result.data.userInfo.roleId) {

//                             secureLocalStorage.setItem(
//                                 sessionStorage.getItem("sessionId") + "userId",
//                                 false
//                             );
//                             secureLocalStorage.setItem(
//                                 sessionStorage.getItem("sessionId") + "username",
//                                 result.data.userInfo.username
//                             );
//                             secureLocalStorage.setItem(
//                                 sessionStorage.getItem("sessionId") + "superAdmin",
//                                 true
//                             );
//                             navigate('/dashboard');
//                             // navigate(PRODUCT_ADMIN_HOME_PATH);
//                         } else {

//                             // const currentPlanActive =
//                             //     result.data.userInfo.role.company.Subscription.some(
//                             //         (sub) => sub.planStatus
//                             //     );
//                             // if (currentPlanActive) {
//                             secureLocalStorage.setItem(
//                                 sessionStorage.getItem("sessionId") + "employeeId",
//                                 result.data.userInfo.employeeId
//                             );
//                             secureLocalStorage.setItem(
//                                 sessionStorage.getItem("sessionId") + "userId",
//                                 result.data.userInfo.id
//                             );
//                             secureLocalStorage.setItem(
//                                 sessionStorage.getItem("sessionId") + "username",
//                                 result.data.userInfo.username
//                             );

//                             secureLocalStorage.setItem(
//                                 sessionStorage.getItem("sessionId") + "userCompanycode",
//                                 result.data.userInfo.COMPCODE
//                             );
//                             secureLocalStorage.setItem(
//                                 sessionStorage.getItem("sessionId") + "roleId",
//                                 result.data.userInfo.roleId
//                             );
//                             secureLocalStorage.setItem(
//                                 sessionStorage.getItem("sessionId") + "superAdmin",
//                                 false
//                             );




//                             navigate('/dashboard');

//                         }
//                     } else {

//                         Swal.fire({
//                             icon: 'error',
//                             title: 'Submission error',
//                             text: result.data.message || 'Something went wrong!',
//                         });
//                         setLoading(false);
//                     }
//                 }

//             }
//             catch (error) {
//                 console.log(error);
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Submission error',
//                     text: error.response.data.message || 'Something went wrong!'
//                 });

//                 setLoading(false);
//             }

//         };

//     }



//     return (
//         <>
//             {/* <Modal
//         isOpen={isGlobalOpen}
//         onClose={() => {
//           setIsGlobalOpen(false);
//         }}
//         widthClass={""}
//       >
//         <BranchAndFinYearForm setIsGlobalOpen={setIsGlobalOpen} />
//       </Modal> */}
//             <div
//                 style={{
//                     backgroundImage: "url('https://png.pngtree.com/thumb_back/fh260/background/20220428/pngtree-attractive-advertise-blank-banner-copyspace-vector-image_1102577.jpg')",
//                     backgroundSize: "cover",
//                     backgroundRepeat: "no-repeat",
//                     backgroundPosition: "center"
//                 }}
//                 className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 font-sans overflow-hidden"
//             >

//                 {/* Background Elements */}
//                 <div className="absolute inset-0 z-0">
//                     <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-100/40 to-transparent" />
//                     <div className="absolute inset-0 bg-grid-stone-900/5 opacity-15" />
//                 </div>

//                 {/* Floating Blobs */}
//                 <motion.div
//                     animate={{
//                         x: [0, 20, 0],
//                         y: [0, -20, 0],
//                     }}
//                     transition={{
//                         duration: 15,
//                         repeat: Infinity,
//                         ease: "easeInOut",
//                     }}
//                     className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-teal-400/15 blur-3xl -z-10"
//                 />
//                 <motion.div
//                     animate={{
//                         x: [0, -30, 0],
//                         y: [0, 30, 0],
//                     }}
//                     transition={{
//                         duration: 20,
//                         repeat: Infinity,
//                         ease: "easeInOut",
//                         delay: 2
//                     }}
//                     className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-rose-400/10 blur-3xl -z-10"
//                 />

//                 {/* Main Card */}
//                 <motion.div
//                     initial={{ scale: 0.95, opacity: 0, y: 20 }}
//                     animate={{ scale: 1, opacity: 1, y: 0 }}
//                     transition={{ type: 'spring', stiffness: 120 }}
//                     className="relative z-10 w-full max-w-md px-8 py-10 bg-white/95 backdrop-blur-lg rounded-2xl border border-stone-200 shadow-xl overflow-hidden"
//                 >
//                     <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-teal-400/10 blur-md" />
//                     <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-rose-500/10 blur-md" />

//                     <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent" />
//                     <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-400 to-transparent" />

//                     <form onSubmit={handleSubmit} className="space-y-6">
//                         <motion.div
//                             initial={{ opacity: 0, x: -10 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ delay: 0.4 }}
//                             className="space-y-1"
//                         >
//                             <label htmlFor="username" className="text-sm font-medium text-stone-700">
//                                 Username
//                             </label>
//                             <div className="relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <User className="h-5 w-5 text-teal-600" />
//                                 </div>
//                                 <input
//                                     id="username"
//                                     name="username"
//                                     type="text"
//                                     required
//                                     value={username}
//                                     onChange={(e) => setUsername(e.target.value)}
//                                     className="block w-full pl-10 pr-3 py-3 bg-white/80 border border-stone-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-stone-400 text-stone-700 transition-all duration-200"
//                                     placeholder="Enter your username"
//                                 />
//                             </div>
//                         </motion.div>

//                         <motion.div
//                             initial={{ opacity: 0, x: -10 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ delay: 0.5 }}
//                             className="space-y-1"
//                         >
//                             <label htmlFor="password" className="text-sm font-medium text-stone-700">
//                                 Password
//                             </label>
//                             <div className="relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <Lock className="h-5 w-5 text-teal-600" />
//                                 </div>
//                                 <input
//                                     id="password"
//                                     name="password"
//                                     type={showPassword ? "text" : "password"}
//                                     required
//                                     value={password}
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     className="block w-full pl-10 pr-10 py-3 bg-white/80 border border-stone-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-stone-400 text-stone-700 transition-all duration-200"
//                                     placeholder="Enter your password"
//                                 />
//                                 <button
//                                     type="button"
//                                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                                     onClick={() => setShowPassword(!showPassword)}
//                                 >
//                                     {showPassword ? (
//                                         <EyeOff className="h-5 w-5 text-stone-400 hover:text-stone-600 transition-colors" />
//                                     ) : (
//                                         <Eye className="h-5 w-5 text-stone-400 hover:text-stone-600 transition-colors" />
//                                     )}
//                                 </button>
//                             </div>
//                         </motion.div>

//                         <motion.div
//                             initial={{ opacity: 0, y: 10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: 0.6 }}
//                             className="pt-2"
//                         >
//                             <button
//                                 type="submit"
//                                 disabled={isSubmitting}
//                                 className={`w-full py-3.5 px-4 rounded-lg font-medium text-white transition-all duration-300 ${isSubmitting
//                                     ? 'bg-teal-600 cursor-not-allowed'
//                                     : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-md hover:shadow-teal-400/30'
//                                     }`}
//                             >
//                                 {isSubmitting ? (
//                                     <span className="flex items-center justify-center">
//                                         <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                         </svg>
//                                         Processing...
//                                     </span>
//                                 ) : (
//                                     'Sign In'
//                                 )}
//                             </button>
//                         </motion.div>
//                     </form>

//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 0.8 }}
//                         className="mt-6 text-center text-sm text-stone-600"
//                     >
//                         <a href="#" className="font-medium text-teal-600 hover:text-teal-700 transition-colors">
//                             Forgot password?
//                         </a>
//                         <span className="mx-2 text-stone-400">•</span>
//                         <a href="#" className="font-medium text-rose-500 hover:text-rose-600 transition-colors">
//                             Create account
//                         </a>
//                     </motion.div>
//                 </motion.div>

//                 {/* Floating Product Cards */}
//                 <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
//                     {products.map((product, i) => {
//                         const angle = (Math.PI * 2 * i) / products.length;
//                         const radius = 320;
//                         return (
//                             <motion.div
//                                 key={i}
//                                 className="absolute w-48 h-48 flex items-center justify-center"
//                                 initial={{ scale: 0, opacity: 0 }}
//                                 animate={{
//                                     scale: 1,
//                                     opacity: 1,
//                                     x: Math.cos(angle) * radius,
//                                     y: Math.sin(angle) * radius,
//                                 }}
//                                 transition={{
//                                     type: 'spring',
//                                     delay: i * 0.1,
//                                     stiffness: 50,
//                                     damping: 10,
//                                 }}
//                                 whileHover={{
//                                     scale: 1.1,
//                                     zIndex: 10,
//                                     transition: { duration: 0.3 },
//                                 }}
//                             >
//                                 <div className="bg-white/95 backdrop-blur-md border border-stone-200 rounded-full rounded-xl p-5 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//                                     <div className={`text-4xl mb-3 ${product.color}`}>{product.icon}</div>
//                                     <h3 className="text-lg font-bold mb-1 text-stone-800">{product.title}</h3>
//                                     <p className="text-stone-600 text-xs">{product.desc}</p>
//                                 </div>
//                             </motion.div>
//                         );
//                     })}
//                 </div>
//             </div>


//         </>
//     )
// }

// export default Login

import { useState } from 'react';
import { Eye, EyeOff, Lock, User, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { BASE_URL } from '../../constants/apiUrl';
import { generateSessionId } from '../../utils/hleper';

axios.defaults.baseURL = BASE_URL;

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Bricolage+Grotesque:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --white: #ffffff; --ink: #1e1b4b; --sub: #6366f1;
    --muted: #64748b; --light: #94a3b8; --red: #ef4444;
  }
  body { font-family: 'Bricolage Grotesque', sans-serif; }

  .pg {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(160deg, #f0f4ff 0%, #e8f0fe 55%, #f0fdf4 100%);
    position: relative; overflow: hidden;
    font-family: 'Bricolage Grotesque', sans-serif;
  }
  .bg-layer {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background:
      radial-gradient(ellipse 55% 50% at 15% 20%, rgba(99,102,241,0.11) 0%, transparent 65%),
      radial-gradient(ellipse 45% 55% at 85% 75%, rgba(6,182,212,0.09) 0%, transparent 65%);
  }
  .dot-grid {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: radial-gradient(circle, rgba(99,102,241,0.14) 1px, transparent 1px);
    background-size: 32px 32px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
  }

  .layout {
    position: relative;
    z-index: 20;
    width: min(1060px, 88vw);
    min-height: min(610px, 86vh);
    display: grid;
    grid-template-columns: 1fr 430px;
    background: var(--white);
    border-radius: 24px;
    box-shadow:
      0 0 0 1px rgba(99,102,241,0.09),
      0 28px 70px rgba(99,102,241,0.13),
      0 6px 20px rgba(0,0,0,0.06);
    overflow: hidden;
  }

  .left-panel {
    background: linear-gradient(148deg, #4f46e5 0%, #6366f1 45%, #06b6d4 100%);
    position: relative; overflow: hidden;
    padding: 46px 40px;
    display: flex; flex-direction: column; justify-content: space-between; gap: 0;
  }
  .left-panel::before {
    content: ''; position: absolute; inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
    background-size: 26px 26px;
  }
  .brand-block { position: relative; z-index: 2; }
  .brand-logo {
    display: inline-flex; align-items: center; justify-content: center;
    width: 48px; height: 48px; border-radius: 13px;
    background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.3);
    margin-bottom: 16px;
  }
  .brand-headline {
    font-family: 'Clash Display', sans-serif;
    font-size: 34px; font-weight: 700; color: #fff;
    line-height: 1.1; letter-spacing: -0.02em;
  }
  .brand-headline em { font-style: normal; color: #fde68a; }
  .brand-sub {
    font-size: 11.5px; color: rgba(255,255,255,0.6);
    margin-top: 9px; letter-spacing: 0.13em; text-transform: uppercase;
  }
  .stat-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 20px; position: relative; z-index: 2; }
  .stat-pill {
    background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.22);
    border-radius: 20px; padding: 5px 12px;
    font-size: 11.5px; color: rgba(255,255,255,0.88);
    display: flex; align-items: center; gap: 6px;
  }
  .stat-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #6ee7b7;
    box-shadow: 0 0 6px #6ee7b7; animation: blink 1.8s ease infinite;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.35} }
  .left-footer { position: relative; z-index: 2; }
  .left-footer p { font-size: 11px; color: rgba(255,255,255,0.38); }

  .float-cards {
    position: relative; z-index: 2;
    display: flex; flex-direction: column; gap: 12px;
    margin-top: 28px;
  }
  .fcard {
    background: rgba(255,255,255,0.13); border: 1px solid rgba(255,255,255,0.22);
    border-radius: 13px; padding: 11px 15px;
    backdrop-filter: blur(6px);
    display: flex; align-items: center; gap: 12px;
  }
  .fcard-name { font-family:'Clash Display',sans-serif; font-size:13px; font-weight:600; color:#fff; }
  .fcard-desc { font-size:11px; color:rgba(255,255,255,0.56); }

  .right-panel {
    background: #fff; padding: 50px 40px;
    display: flex; flex-direction: column; justify-content: center;
  }
  .form-eyebrow {
    font-size: 11px; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--sub); font-weight: 600; margin-bottom: 7px;
  }
  .form-title {
    font-family: 'Clash Display', sans-serif;
    font-size: 26px; font-weight: 700; color: var(--ink);
    line-height: 1.15; letter-spacing: -0.02em; margin-bottom: 24px;
  }
  .field-row { margin-bottom: 16px; }
  .field-label { display:block; font-size:11px; font-weight:600; letter-spacing:.05em; text-transform:uppercase; color:var(--muted); margin-bottom:6px; }
  .field-wrap { position:relative; }
  .field-icon { position:absolute; top:50%; left:13px; transform:translateY(-50%); pointer-events:none; color:var(--sub); display:flex; }
  .field-input {
    width:100%; padding:12px 13px 12px 40px;
    background:#f8faff; border:1.5px solid #e0e7ff;
    border-radius:11px; color:var(--ink);
    font-family:'Bricolage Grotesque',sans-serif; font-size:14px; outline:none;
    transition:border-color .22s, background .22s, box-shadow .22s;
  }
  .field-input::placeholder { color:#c7d0ee; }
  .field-input:focus { border-color:var(--sub); background:#fff; box-shadow:0 0 0 3px rgba(99,102,241,0.10); }
  .field-input.err { border-color:var(--red); }
  .field-error { font-size:11px; color:var(--red); margin-top:4px; }
  .eye-btn { position:absolute; top:50%; right:12px; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:var(--light); display:flex; padding:0; transition:color .2s; }
  .eye-btn:hover { color:var(--sub); }
  .submit-btn {
    width:100%; padding:13px; border-radius:11px; border:none; cursor:pointer;
    font-family:'Clash Display',sans-serif; font-weight:600; font-size:15px;
    color:#fff;
    background: linear-gradient(135deg,#4f46e5,#6366f1,#06b6d4);
    background-size:200% 200%; animation:gradShift 4s ease infinite;
    transition:box-shadow .3s,transform .2s;
    box-shadow:0 5px 22px rgba(99,102,241,0.35);
    margin-top:6px; display:flex; align-items:center; justify-content:center; gap:8px;
    position:relative; overflow:hidden;
  }
  .submit-btn::after {
    content:''; position:absolute; inset:0;
    background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.22) 50%,transparent 65%);
    background-size:200% 100%; animation:shimmer 2.2s infinite;
  }
  @keyframes gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  .submit-btn:hover:not(:disabled) { box-shadow:0 8px 30px rgba(99,102,241,0.46); transform:translateY(-1px); }
  .submit-btn:disabled { opacity:.65; cursor:not-allowed; }
  .form-footer { display:flex; align-items:center; justify-content:center; gap:14px; margin-top:18px; }
  .form-footer a { font-size:12px; color:var(--muted); text-decoration:none; transition:color .2s; cursor:pointer; }
  .form-footer a:hover { color:var(--sub); }
  .dot-sep { width:3px; height:3px; border-radius:50%; background:#dde3f5; }
  .spin { width:15px; height:15px; border:2px solid rgba(255,255,255,0.35); border-top-color:#fff; border-radius:50%; animation:rot .7s linear infinite; }
  @keyframes rot { to{transform:rotate(360deg)} }

  @media(max-width:760px){
    .layout { grid-template-columns:1fr; }
    .left-panel { display:none; }
    .right-panel { padding:36px 24px; }
  }
`;

const bgBlobs = [
    { size: 300, top: '-5%', left: '-4%', color: 'rgba(99,102,241,0.08)', dur: 20, dx: 34, dy: 24 },
    { size: 240, top: '62%', left: '67%', color: 'rgba(6,182,212,0.09)', dur: 25, dx: -24, dy: -34 },
    { size: 160, top: '28%', left: '76%', color: 'rgba(245,158,11,0.07)', dur: 18, dx: 18, dy: 20 },
    { size: 180, top: '70%', left: '-3%', color: 'rgba(236,72,153,0.06)', dur: 22, dx: -18, dy: 24 },
];

const innerCards = [
    { icon: '📊', label: 'Live Reports', sub: 'Real-time analytics' },
    { icon: '🔐', label: 'Secure Access', sub: 'Role-based control' },
    { icon: '⚡', label: '99.9% Uptime', sub: 'Always available' },
];

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        const e = {};
        if (!username) e.username = 'Username is required';
        if (!password) e.password = 'Password is required';
        return e;
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        const ve = validate();
        setErrors(ve);
        if (Object.keys(ve).length > 0) return;
        setIsSubmitting(true);
        try {
            const result = await axios.post('users/login', { username, password });
            if (result.status === 200 && result.data.statusCode === 0) {
                secureLocalStorage.clear(); sessionStorage.clear();
                sessionStorage.setItem('sessionId', generateSessionId());
                const sid = sessionStorage.getItem('sessionId');
                const ui = result.data.userInfo;
                if (!ui.roleId) {
                    secureLocalStorage.setItem(sid + 'userId', false);
                    secureLocalStorage.setItem(sid + 'username', ui.username);
                    secureLocalStorage.setItem(sid + 'superAdmin', true);
                } else {
                    secureLocalStorage.setItem(sid + 'employeeId', ui.employeeId);
                    secureLocalStorage.setItem(sid + 'userId', ui.id);
                    secureLocalStorage.setItem(sid + 'username', ui.username);
                    secureLocalStorage.setItem(sid + 'userCompanycode', ui.COMPCODE);
                    secureLocalStorage.setItem(sid + 'roleId', ui.roleId);
                    secureLocalStorage.setItem(sid + 'superAdmin', false);
                }
                navigate('/dashboard');
            } else {
                Swal.fire({ icon: 'error', title: 'Login Failed', text: result.data.message || 'Something went wrong!' });
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Login Failed', text: err?.response?.data?.message || 'Something went wrong!' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <style>{css}</style>
            <div className="pg">
                <div className="bg-layer" />
                <div className="dot-grid" />

                {bgBlobs.map((b, i) => (
                    <motion.div key={i} style={{
                        position: 'fixed', zIndex: 1, borderRadius: '50%',
                        width: b.size, height: b.size, top: b.top, left: b.left,
                        background: b.color, filter: 'blur(55px)', pointerEvents: 'none',
                    }}
                        animate={{ x: [0, b.dx, 0], y: [0, b.dy, 0] }}
                        transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
                    />
                ))}

                <motion.div
                    className="layout"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 90, damping: 18, delay: 0.1 }}
                >
                    {/* LEFT */}
                    <div className="left-panel">
                        <div className="float-cards">
                            {innerCards.map((c) => (
                                <div key={c.label} className="fcard">
                                    <span style={{ fontSize: 20 }}>{c.icon}</span>
                                    <div>
                                        <div className="fcard-name">{c.label}</div>
                                        <div className="fcard-desc">{c.sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <motion.div className="brand-block"
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .3 }}>
                            <motion.div className="brand-logo"
                                animate={{ rotate: [0, 7, -7, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                                <Zap size={22} color="#fde68a" strokeWidth={2.5} />
                            </motion.div>
                            <h1 className="brand-headline"><em>Pinnacle</em><br />Systems</h1>
                            <p className="brand-sub">Enterprise Resource Platform</p>
                            <div className="stat-row">
                                {['6 Modules', '99.9% Uptime', 'Multi-Branch'].map((s, i) => (
                                    <motion.div key={s} className="stat-pill"
                                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .6 + i * .1 }}>
                                        <span className="stat-dot" />{s}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <div className="left-footer">
                            <p>© {new Date().getFullYear()} Pinnacle Systems. All rights reserved.</p>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="right-panel">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .28 }}>
                            <p className="form-eyebrow">Welcome back</p>
                            <h2 className="form-title">Sign in to your<br />account</h2>
                        </motion.div>

                        <form onSubmit={handleSubmit} noValidate>
                            <motion.div className="field-row"
                                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4 }}>
                                <label htmlFor="username" className="field-label">Username</label>
                                <div className="field-wrap">
                                    <span className="field-icon"><User size={15} /></span>
                                    <input id="username" type="text" value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        placeholder="Enter your username"
                                        className={`field-input${errors.username ? ' err' : ''}`}
                                        autoComplete="username"
                                    />
                                </div>
                                <AnimatePresence>
                                    {errors.username && (
                                        <motion.p className="field-error"
                                            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                            {errors.username}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            <motion.div className="field-row"
                                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .48 }}>
                                <label htmlFor="password" className="field-label">Password</label>
                                <div className="field-wrap">
                                    <span className="field-icon"><Lock size={15} /></span>
                                    <input id="password" type={showPassword ? 'text' : 'password'} value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className={`field-input${errors.password ? ' err' : ''}`}
                                        style={{ paddingRight: 40 }}
                                        autoComplete="current-password"
                                    />
                                    <button type="button" className="eye-btn" onClick={() => setShowPassword(v => !v)}>
                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                                <AnimatePresence>
                                    {errors.password && (
                                        <motion.p className="field-error"
                                            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                            {errors.password}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .56 }}>
                                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                                    {isSubmitting
                                        ? <><div className="spin" />Authenticating…</>
                                        : <><span>Sign In to Pinnacle</span><ArrowRight size={16} /></>
                                    }
                                </button>
                            </motion.div>
                        </form>

                        <motion.div className="form-footer"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .70 }}>
                            <a href="#">Forgot password?</a>
                            <span className="dot-sep" />
                            <a href="#">Create account</a>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default Login;
