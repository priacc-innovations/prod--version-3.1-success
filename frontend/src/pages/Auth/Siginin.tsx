import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Eye, EyeOff } from "lucide-react";
import logo from "../../assests/Login.png";
import logoteam from "../../assests/teamhub-logo.png"

const LoginV1: React.FC = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [dark, setDark] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX - window.innerWidth / 2) / 25,
                y: (e.clientY - window.innerHeight / 2) / 25,
            });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div
            className={`min-h-screen flex items-center justify-center p-6 transition-all duration-500 ${dark ? "bg-black" : "bg-white"
                }`}
        >
            {/* Login Box */}
            <div
                className={`
                    relative rounded-2xl w-full max-w-5xl flex items-center 
                    p-16 overflow-hidden h-[580px] transition-all duration-500
                    border-4 ${dark ? "border-blue-500" : "border-blue-300"}
                    ${dark ? "bg-[#0a1a2a]" : "bg-white"}
                `}
                style={{
                    boxShadow: dark
                        ? "0 0 120px rgba(0, 150, 255, 0.25)"
                        : "0 0 200px rgba(0, 200, 255, 0.4)",
                }}
            >
                {/* Toggle inside box */}
                <button
                    onClick={() => setDark(!dark)}
                    className="absolute top-6 right-6 bg-white/40 backdrop-blur-md p-3 rounded-full shadow-lg"
                >
                    {dark ? <Sun className="text-yellow-300" /> : <Moon />}
                </button>

                {/* Floating Shapes */}
                <motion.div
                    className="absolute left-20 top-40 w-4 h-4 bg-blue-400 rounded-full"
                    animate={{ x: mousePosition.x * 2, y: mousePosition.y * 2 }}
                />
                <motion.div
                    className="absolute left-40 bottom-32 w-4 h-4 border-2 border-green-500 rotate-45"
                    animate={{ x: mousePosition.x * -2, y: mousePosition.y * -2 }}
                />
                <motion.div
                    className="absolute left-10 bottom-20 w-3 h-3 bg-yellow-300"
                    animate={{ x: mousePosition.x * 3, y: mousePosition.y * 3 }}
                />

                {/* Left Side Image */}
                <motion.div
                    className="w-1/2 flex justify-center"
                    animate={{ x: mousePosition.x * 4, y: mousePosition.y * 4 }}
                >
                    <img src={logo} alt="login" className="w-96 drop-shadow-2xl" />
                </motion.div>

                {/* Right Side Form */}
                <div className="w-1/2 pl-14">

                    {/* Center Logo */}
                    <div className="flex justify-center mb-5">
                        <img src={logoteam} alt="top-logo" className="w-24 drop-shadow-md" />
                    </div>

                    <h2
                        className={`text-3xl font-semibold mb-8 text-center ${dark ? "text-white" : "text-gray-700"
                            }`}
                    >
                        Member Login
                    </h2>

                    {/* Email (White + Blue Outline) */}
                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="Email"
                            className="
                                w-full px-4 py-3 rounded-full outline-none
                                border-2 border-blue-400 bg-white
                                text-gray-700 
                                shadow-[0_0_12px_rgba(0,150,255,0.2)]
                                focus:border-blue-600 transition
                            "
                        />
                    </div>

                    {/* Password (White + Blue Outline + Eye Toggle) */}
                    <div className="mb-6 relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="
                                w-full px-4 py-3 rounded-full outline-none
                                border-2 border-blue-400 bg-white
                                text-gray-700
                                shadow-[0_0_12px_rgba(0,150,255,0.2)]
                                focus:border-blue-600 transition
                            "
                        />

                        <div
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-5 top-3 cursor-pointer text-blue-500"
                        >
                            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                        </div>
                    </div>

                    {/* Blue LOGIN Button */}
                    <button
                        className="
                            w-full bg-blue-500 text-white py-3 rounded-full 
                            font-semibold hover:bg-blue-600 transition
                        "
                    >
                        LOGIN
                    </button>

                    <p
                        className={`text-sm mt-3 text-center cursor-pointer ${dark ? "text-white" : "text-gray-600"
                            }`}
                    >
                        Password?
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginV1;
