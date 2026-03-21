import { useState } from 'react'
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import { motion } from 'framer-motion';
// import { LOGIN_API } from '../../../Api';
import { generateSessionId } from '../../utils/hleper';
// import Modal from '../../../UiComponents/Modal';
// import BranchAndFinYearForm from '../../components/BranchAndFinyear';
// import { PRODUCT_ADMIN_HOME_PATH } from '../../../Route/urlPaths';
import Swal from 'sweetalert2';
import { BASE_URL } from '../../constants/apiUrl';


axios.defaults.baseURL = BASE_URL;

// // Then call
// axios.post("users/login", { username, password });

// const BASE_URL = process.env.REACT_APP_SERVER_URL

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false)
    // const [formData, setFormData] = useState({ email: email, password: password })
    const [errors, setErrors] = useState({});
    const [isGlobalOpen, setIsGlobalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [planExpirationDate, setPlanExpirationDate] = useState("");
    const navigate = useNavigate();

    // Validation function to check email and password
    const validate = () => {
        const errors = {};


        if (!username) {
            errors.email = "Email is required";
        }
        //  else if (
        // ) {
        //     errors.email = "Invalid email address";
        // }

        // Password validation
        if (!password) {
            errors.password = "Password is required";
        }
        //  else if (password.length < 6) {
        //     errors.password = "Password must be at least 6 characters";
        // }

        return errors;
    };

    const data = { username, password }
    const products = [
        { title: 'GMS', desc: 'Garment ERP', icon: '👔', color: 'text-amber-500' },
        { title: 'PMS', desc: 'Payroll System', icon: '💰', color: 'text-orange-500' },
        { title: 'PCS', desc: 'Production Control', icon: '🏭', color: 'text-orange-600' },
        { title: 'POS', desc: 'Retail POS', icon: '🛒', color: 'text-amber-600' },
        { title: 'Costing', desc: 'Textile Costing', icon: '🧮', color: 'text-orange-700' },
        { title: 'Lab Testing', desc: 'LIMS', icon: '🔬', color: 'text-amber-700' },
    ];
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault()

        const validateErrors = validate()
        setErrors(validateErrors)

        if (Object.keys(validateErrors).length === 0) {


            try {
                const result = await axios.post("users/login", { username, password });



                if (result.status === 200) {
                    if (result.data.statusCode === 0) {
                        secureLocalStorage.clear();
                        sessionStorage.clear();
                        sessionStorage.setItem("sessionId", generateSessionId());
                        if (!result.data.userInfo.roleId) {

                            secureLocalStorage.setItem(
                                sessionStorage.getItem("sessionId") + "userId",
                                false
                            );
                            secureLocalStorage.setItem(
                                sessionStorage.getItem("sessionId") + "username",
                                result.data.userInfo.username
                            );
                            secureLocalStorage.setItem(
                                sessionStorage.getItem("sessionId") + "superAdmin",
                                true
                            );
                            navigate('/dashboard');
                            // navigate(PRODUCT_ADMIN_HOME_PATH);
                        } else {

                            // const currentPlanActive =
                            //     result.data.userInfo.role.company.Subscription.some(
                            //         (sub) => sub.planStatus
                            //     );
                            // if (currentPlanActive) {
                            secureLocalStorage.setItem(
                                sessionStorage.getItem("sessionId") + "employeeId",
                                result.data.userInfo.employeeId
                            );
                            secureLocalStorage.setItem(
                                sessionStorage.getItem("sessionId") + "userId",
                                result.data.userInfo.id
                            );
                            secureLocalStorage.setItem(
                                sessionStorage.getItem("sessionId") + "username",
                                result.data.userInfo.username
                            );

                            secureLocalStorage.setItem(
                                sessionStorage.getItem("sessionId") + "userCompanycode",
                                result.data.userInfo.COMPCODE
                            );
                            secureLocalStorage.setItem(
                                sessionStorage.getItem("sessionId") + "roleId",
                                result.data.userInfo.roleId
                            );
                            secureLocalStorage.setItem(
                                sessionStorage.getItem("sessionId") + "superAdmin",
                                false
                            );




                            navigate('/dashboard');

                        }
                    } else {

                        Swal.fire({
                            icon: 'error',
                            title: 'Submission error',
                            text: result.data.message || 'Something went wrong!',
                        });
                        setLoading(false);
                    }
                }

            }
            catch (error) {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Submission error',
                    text: error.response.data.message || 'Something went wrong!'
                });

                setLoading(false);
            }

        };

    }



    return (
        <>
            {/* <Modal
        isOpen={isGlobalOpen}
        onClose={() => {
          setIsGlobalOpen(false);
        }}
        widthClass={""}
      >
        <BranchAndFinYearForm setIsGlobalOpen={setIsGlobalOpen} />
      </Modal> */}
            <div
                style={{
                    backgroundImage: "url('https://png.pngtree.com/thumb_back/fh260/background/20220428/pngtree-attractive-advertise-blank-banner-copyspace-vector-image_1102577.jpg')",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center"
                }}
                className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 font-sans overflow-hidden"
            >

                {/* Background Elements */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-100/40 to-transparent" />
                    <div className="absolute inset-0 bg-grid-stone-900/5 opacity-15" />
                </div>

                {/* Floating Blobs */}
                <motion.div
                    animate={{
                        x: [0, 20, 0],
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-teal-400/15 blur-3xl -z-10"
                />
                <motion.div
                    animate={{
                        x: [0, -30, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-rose-400/10 blur-3xl -z-10"
                />

                {/* Main Card */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 120 }}
                    className="relative z-10 w-full max-w-md px-8 py-10 bg-white/95 backdrop-blur-lg rounded-2xl border border-stone-200 shadow-xl overflow-hidden"
                >
                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-teal-400/10 blur-md" />
                    <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-rose-500/10 blur-md" />

                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-400 to-transparent" />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-1"
                        >
                            <label htmlFor="username" className="text-sm font-medium text-stone-700">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-teal-600" />
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 bg-white/80 border border-stone-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-stone-400 text-stone-700 transition-all duration-200"
                                    placeholder="Enter your username"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="space-y-1"
                        >
                            <label htmlFor="password" className="text-sm font-medium text-stone-700">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-teal-600" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-3 bg-white/80 border border-stone-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-stone-400 text-stone-700 transition-all duration-200"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-stone-400 hover:text-stone-600 transition-colors" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-stone-400 hover:text-stone-600 transition-colors" />
                                    )}
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="pt-2"
                        >
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-3.5 px-4 rounded-lg font-medium text-white transition-all duration-300 ${isSubmitting
                                    ? 'bg-teal-600 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-md hover:shadow-teal-400/30'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </motion.div>
                    </form>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-6 text-center text-sm text-stone-600"
                    >
                        <a href="#" className="font-medium text-teal-600 hover:text-teal-700 transition-colors">
                            Forgot password?
                        </a>
                        <span className="mx-2 text-stone-400">•</span>
                        <a href="#" className="font-medium text-rose-500 hover:text-rose-600 transition-colors">
                            Create account
                        </a>
                    </motion.div>
                </motion.div>

                {/* Floating Product Cards */}
                <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
                    {products.map((product, i) => {
                        const angle = (Math.PI * 2 * i) / products.length;
                        const radius = 320;
                        return (
                            <motion.div
                                key={i}
                                className="absolute w-48 h-48 flex items-center justify-center"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                    x: Math.cos(angle) * radius,
                                    y: Math.sin(angle) * radius,
                                }}
                                transition={{
                                    type: 'spring',
                                    delay: i * 0.1,
                                    stiffness: 50,
                                    damping: 10,
                                }}
                                whileHover={{
                                    scale: 1.1,
                                    zIndex: 10,
                                    transition: { duration: 0.3 },
                                }}
                            >
                                <div className="bg-white/95 backdrop-blur-md border border-stone-200 rounded-full rounded-xl p-5 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                    <div className={`text-4xl mb-3 ${product.color}`}>{product.icon}</div>
                                    <h3 className="text-lg font-bold mb-1 text-stone-800">{product.title}</h3>
                                    <p className="text-stone-600 text-xs">{product.desc}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>


        </>
    )
}

export default Login




// import { useState } from "react";
// import { Eye, EyeOff, Lock, User, ArrowRight } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import secureLocalStorage from "react-secure-storage";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import Swal from "sweetalert2";
// import { BASE_URL } from "../../constants/apiUrl";
// import { generateSessionId } from "../../utils/hleper";
// import logoImg from "../../assets/pinnacle_logo.png";

// axios.defaults.baseURL = BASE_URL;

// const css = `
//   @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//   :root {
//     --bg: #f5f6fa;
//     --white: #ffffff;
//     --orange: #f07020;
//     --orange-light: rgba(240,112,32,0.10);
//     --orange-mid: rgba(240,112,32,0.18);
//     --ink: #1a1a2e;
//     --sub: #4a4a6a;
//     --muted: #8888a4;
//     --border: #e4e4f0;
//     --border-focus: rgba(240,112,32,0.45);
//     --red: #e53935;
//   }

//   body { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg); }

//   .pg {
//     min-height: 100vh;
//     display: grid;
//     grid-template-columns: 1fr 1fr;
//     font-family: 'Plus Jakarta Sans', sans-serif;
//   }

//   /* LEFT PANEL */
//   .left {
//     background: linear-gradient(150deg, #1a1a2e 0%, #252545 55%, #1e1e38 100%);
//     position: relative; overflow: hidden;
//     display: flex; flex-direction: column;
//     justify-content: space-between;
//     padding: 44px 48px;
//   }
//   .left::before {
//     content: '';
//     position: absolute; width: 500px; height: 500px;
//     top: -100px; right: -120px; border-radius: 50%;
//     background: radial-gradient(circle, rgba(240,112,32,0.12) 0%, transparent 65%);
//     pointer-events: none;
//   }
//   .left::after {
//     content: '';
//     position: absolute; width: 380px; height: 380px;
//     bottom: -60px; left: -80px; border-radius: 50%;
//     background: radial-gradient(circle, rgba(240,112,32,0.07) 0%, transparent 65%);
//     pointer-events: none;
//   }
//   .left-grid {
//     position: absolute; inset: 0; pointer-events: none;
//     background-image:
//       linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
//       linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
//     background-size: 48px 48px;
//   }
//   .left-top { position: relative; z-index: 2; }

//   .logo-wrap {
//     display: inline-flex; align-items: center;
//     background: rgba(255,255,255,0.06);
//     border: 1px solid rgba(255,255,255,0.10);
//     border-radius: 14px; padding: 10px 18px;
//     margin-bottom: 52px;
//   }
//   .logo-wrap img { height: 38px; width: auto; }

//   .left-headline {
//     font-size: 38px; font-weight: 800;
//     color: #fff; line-height: 1.15;
//     letter-spacing: -0.03em; margin-bottom: 14px;
//   }
//   .left-headline em { font-style: normal; color: var(--orange); }
//   .left-desc {
//     font-size: 14px; color: rgba(255,255,255,0.45);
//     line-height: 1.7; max-width: 340px;
//   }

//   .feature-list {
//     position: relative; z-index: 2;
//     display: flex; flex-direction: column; gap: 14px; margin-top: 40px;
//   }
//   .feature-item {
//     display: flex; align-items: center; gap: 14px;
//     padding: 14px 18px;
//     background: rgba(255,255,255,0.05);
//     border: 1px solid rgba(255,255,255,0.08);
//     border-radius: 12px; backdrop-filter: blur(8px);
//   }
//   .feature-icon {
//     width: 36px; height: 36px; border-radius: 10px;
//     background: rgba(240,112,32,0.18);
//     border: 1px solid rgba(240,112,32,0.28);
//     display: flex; align-items: center; justify-content: center;
//     font-size: 16px; flex-shrink: 0;
//   }
//   .feature-name { font-size: 13px; font-weight: 600; color: #fff; }
//   .feature-sub { font-size: 11.5px; color: rgba(255,255,255,0.4); }

//   .left-bottom {
//     position: relative; z-index: 2;
//     font-size: 11px; color: rgba(255,255,255,0.25);
//     letter-spacing: 0.05em;
//   }

//   /* RIGHT PANEL */
//   .right {
//     background: var(--bg);
//     display: flex; flex-direction: column;
//     align-items: center; justify-content: center;
//     padding: 48px 40px; position: relative;
//   }
//   .right::before {
//     content: '';
//     position: absolute; width: 400px; height: 400px;
//     top: -80px; right: -80px; border-radius: 50%;
//     background: radial-gradient(circle, rgba(240,112,32,0.05) 0%, transparent 65%);
//     pointer-events: none;
//   }

//   .form-wrap { position: relative; z-index: 2; width: min(400px, 100%); }

//   .form-header { margin-bottom: 28px; }
//   .form-tag {
//     display: inline-flex; align-items: center; gap: 7px;
//     font-size: 11px; font-weight: 700; letter-spacing: 0.14em;
//     text-transform: uppercase; color: var(--orange); margin-bottom: 12px;
//   }
//   .form-tag-dot {
//     width: 6px; height: 6px; border-radius: 50%;
//     background: var(--orange); box-shadow: 0 0 8px var(--orange);
//     animation: blink 2s ease infinite;
//   }
//   @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.25} }
//   .form-title {
//     font-size: 30px; font-weight: 800; color: var(--ink);
//     line-height: 1.15; letter-spacing: -0.03em; margin-bottom: 6px;
//   }
//   .form-sub { font-size: 13.5px; color: var(--muted); line-height: 1.6; }

//   .form-card {
//     background: var(--white); border: 1px solid var(--border);
//     border-radius: 18px; padding: 30px 28px;
//     box-shadow: 0 2px 6px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.08);
//   }

//   .field-row { margin-bottom: 18px; }
//   .field-label {
//     display: block; font-size: 11.5px; font-weight: 600;
//     color: var(--sub); margin-bottom: 7px;
//   }
//   .field-wrap { position: relative; }
//   .field-icon {
//     position: absolute; top: 50%; left: 13px;
//     transform: translateY(-50%); pointer-events: none;
//     color: var(--muted); display: flex; transition: color .2s;
//   }
//   .field-input {
//     width: 100%; padding: 12px 13px 12px 40px;
//     background: var(--bg); border: 1.5px solid var(--border);
//     border-radius: 11px; color: var(--ink);
//     font-family: 'Plus Jakarta Sans', sans-serif;
//     font-size: 14px; outline: none;
//     transition: border-color .22s, background .22s, box-shadow .22s;
//   }
//   .field-input::placeholder { color: #c0c0d4; }
//   .field-input:focus {
//     border-color: var(--border-focus); background: #fff;
//     box-shadow: 0 0 0 3.5px rgba(240,112,32,0.10);
//   }
//   .field-wrap:focus-within .field-icon { color: var(--orange); }
//   .field-input.err { border-color: var(--red); }
//   .field-error { font-size: 11.5px; color: var(--red); margin-top: 5px; }

//   .eye-btn {
//     position: absolute; top: 50%; right: 12px;
//     transform: translateY(-50%); background: none;
//     border: none; cursor: pointer; color: var(--muted);
//     display: flex; padding: 4px; border-radius: 6px;
//     transition: color .2s, background .2s;
//   }
//   .eye-btn:hover { color: var(--orange); background: var(--orange-light); }

//   .row-between {
//     display: flex; justify-content: flex-end;
//     margin-bottom: 20px; margin-top: -4px;
//   }
//   .forgot-link {
//     font-size: 12px; color: var(--muted); text-decoration: none;
//     cursor: pointer; transition: color .2s; font-weight: 500;
//   }
//   .forgot-link:hover { color: var(--orange); }

//   .submit-btn {
//     width: 100%; padding: 13.5px;
//     border-radius: 11px; border: none; cursor: pointer;
//     font-family: 'Plus Jakarta Sans', sans-serif;
//     font-weight: 700; font-size: 15px; color: #fff;
//     background: linear-gradient(135deg, #e06010, #f07020 50%, #f88832);
//     background-size: 200% 200%;
//     transition: transform .18s, box-shadow .25s;
//     box-shadow: 0 5px 20px rgba(240,100,20,0.32), 0 2px 6px rgba(0,0,0,0.08);
//     display: flex; align-items: center; justify-content: center; gap: 8px;
//     position: relative; overflow: hidden;
//   }
//   .submit-btn::after {
//     content: ''; position: absolute; inset: 0;
//     background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%);
//     background-size: 200% 100%;
//     animation: shimmer 2.4s infinite;
//   }
//   @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
//   .submit-btn:hover:not(:disabled) {
//     transform: translateY(-2px);
//     box-shadow: 0 9px 28px rgba(240,100,20,0.42), 0 3px 10px rgba(0,0,0,0.1);
//   }
//   .submit-btn:active:not(:disabled) { transform: translateY(0); }
//   .submit-btn:disabled { opacity: .55; cursor: not-allowed; }

//   .spin {
//     width: 15px; height: 15px;
//     border: 2px solid rgba(255,255,255,0.35);
//     border-top-color: #fff; border-radius: 50%;
//     animation: rot .7s linear infinite;
//   }
//   @keyframes rot { to { transform: rotate(360deg) } }

//   .form-footer {
//     display: flex; align-items: center; justify-content: center;
//     gap: 10px; margin-top: 18px;
//     font-size: 12.5px; color: var(--muted);
//   }
//   .form-footer a { color: var(--orange); text-decoration: none; font-weight: 600; transition: opacity .2s; }
//   .form-footer a:hover { opacity: .75; }
//   .sep { width: 3px; height: 3px; border-radius: 50%; background: var(--border); }

//   .badges {
//     display: flex; align-items: center; justify-content: center;
//     gap: 20px; margin-top: 26px; flex-wrap: wrap;
//   }
//   .badge {
//     display: flex; align-items: center; gap: 6px;
//     font-size: 11px; color: var(--muted); font-weight: 500;
//   }
//   .badge-icon {
//     width: 18px; height: 18px; border-radius: 5px;
//     background: var(--orange-light); border: 1px solid var(--orange-mid);
//     display: flex; align-items: center; justify-content: center; font-size: 9px;
//   }

//   @media (max-width: 820px) {
//     .pg { grid-template-columns: 1fr; }
//     .left { display: none; }
//     .right { padding: 36px 20px; }
//   }
// `;

// const features = [
//   { icon: "📊", name: "Live Analytics", sub: "Real-time business insights" },
//   { icon: "🔐", name: "Role-Based Access", sub: "Granular permissions control" },
//   { icon: "🏢", name: "Multi-Branch", sub: "Unified across all locations" },
// ];

// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const navigate = useNavigate();

//   const validate = () => {
//     const e = {};
//     if (!username) e.username = "Username is required";
//     if (!password) e.password = "Password is required";
//     return e;
//   };

//   const handleSubmit = async (ev) => {
//     ev.preventDefault();
//     const ve = validate();
//     setErrors(ve);
//     if (Object.keys(ve).length > 0) return;
//     setIsSubmitting(true);
//     try {
//       const result = await axios.post("users/login", { username, password });
//       if (result.status === 200 && result.data.statusCode === 0) {
//         secureLocalStorage.clear();
//         sessionStorage.clear();
//         sessionStorage.setItem("sessionId", generateSessionId());
//         const sid = sessionStorage.getItem("sessionId");
//         const ui = result.data.userInfo;
//         if (!ui.roleId) {
//           secureLocalStorage.setItem(sid + "userId", false);
//           secureLocalStorage.setItem(sid + "username", ui.username);
//           secureLocalStorage.setItem(sid + "superAdmin", true);
//         } else {
//           secureLocalStorage.setItem(sid + "employeeId", ui.employeeId);
//           secureLocalStorage.setItem(sid + "userId", ui.id);
//           secureLocalStorage.setItem(sid + "username", ui.username);
//           secureLocalStorage.setItem(sid + "userCompanycode", ui.COMPCODE);
//           secureLocalStorage.setItem(sid + "roleId", ui.roleId);
//           secureLocalStorage.setItem(sid + "superAdmin", false);
//         }
//         navigate("/dashboard");
//       } else {
//         Swal.fire({ icon: "error", title: "Login Failed", text: result.data.message || "Something went wrong!" });
//       }
//     } catch (err) {
//       Swal.fire({ icon: "error", title: "Login Failed", text: err?.response?.data?.message || "Something went wrong!" });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <style>{css}</style>
//       <div className="pg">

//         {/* LEFT */}
//         <div className="left">
//           <div className="left-grid" />
//           <div className="left-top">
//             <motion.div className="logo-wrap"
//               initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
//               <img src={logoImg} alt="Pinnacle Systems" />
//             </motion.div>
//             <motion.h2 className="left-headline"
//               initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
//               Your enterprise,<br /><em>one platform.</em>
//             </motion.h2>
//             <motion.p className="left-desc"
//               initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
//               Manage operations, track performance, and collaborate across teams — all in a single, secure workspace.
//             </motion.p>
//             <div className="feature-list">
//               {features.map((f, i) => (
//                 <motion.div key={f.name} className="feature-item"
//                   initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.1 }}>
//                   <div className="feature-icon">{f.icon}</div>
//                   <div>
//                     <div className="feature-name">{f.name}</div>
//                     <div className="feature-sub">{f.sub}</div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//           <motion.div className="left-bottom"
//             initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
//             © {new Date().getFullYear()} Pinnacle Systems. All rights reserved.
//           </motion.div>
//         </div>

//         {/* RIGHT */}
//         <div className="right">
//           <div className="form-wrap">
//             <motion.div className="form-header"
//               initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
//               <div className="form-tag"><span className="form-tag-dot" />Secure Login</div>
//               <h1 className="form-title">Welcome back 👋</h1>
//               <p className="form-sub">Sign in to access your Pinnacle workspace</p>
//             </motion.div>

//             <motion.div className="form-card"
//               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
//               <form onSubmit={handleSubmit} noValidate>

//                 <div className="field-row">
//                   <label htmlFor="username" className="field-label">Username</label>
//                   <div className="field-wrap">
//                     <span className="field-icon"><User size={15} /></span>
//                     <input id="username" type="text" value={username}
//                       onChange={(e) => setUsername(e.target.value)}
//                       placeholder="Enter your username"
//                       className={`field-input${errors.username ? " err" : ""}`}
//                       autoComplete="username" />
//                   </div>
//                   <AnimatePresence>
//                     {errors.username && (
//                       <motion.p className="field-error"
//                         initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
//                         {errors.username}
//                       </motion.p>
//                     )}
//                   </AnimatePresence>
//                 </div>

//                 <div className="field-row">
//                   <label htmlFor="password" className="field-label">Password</label>
//                   <div className="field-wrap">
//                     <span className="field-icon"><Lock size={15} /></span>
//                     <input id="password" type={showPassword ? "text" : "password"} value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       placeholder="Enter your password"
//                       className={`field-input${errors.password ? " err" : ""}`}
//                       style={{ paddingRight: 44 }}
//                       autoComplete="current-password" />
//                     <button type="button" className="eye-btn" onClick={() => setShowPassword((v) => !v)}>
//                       {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
//                     </button>
//                   </div>
//                   <AnimatePresence>
//                     {errors.password && (
//                       <motion.p className="field-error"
//                         initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
//                         {errors.password}
//                       </motion.p>
//                     )}
//                   </AnimatePresence>
//                 </div>

//                 <div className="row-between">
//                   <a href="#" className="forgot-link">Forgot password?</a>
//                 </div>

//                 <button type="submit" className="submit-btn" disabled={isSubmitting}>
//                   {isSubmitting
//                     ? <><div className="spin" /> Authenticating…</>
//                     : <><span>Sign In</span><ArrowRight size={16} /></>}
//                 </button>
//               </form>
//             </motion.div>

//             <motion.div className="form-footer"
//               initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
//               <a href="#">Create account</a>
//               <span className="sep" />
//               <a href="#">Need help?</a>
//             </motion.div>

//             <motion.div className="badges"
//               initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
//               {[["🔒", "SSL Secured"], ["✅", "Role-Based"], ["🌐", "Multi-Branch"]].map(([icon, label]) => (
//                 <div key={label} className="badge">
//                   <div className="badge-icon">{icon}</div>{label}
//                 </div>
//               ))}
//             </motion.div>
//           </div>
//         </div>

//       </div>
//     </>
//   );
// };

// export default Login;

