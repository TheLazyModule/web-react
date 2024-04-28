"use client";
import {motion} from "framer-motion";
import {LampContainer} from "./ui/lamp-header";

function LampSection() {
    return (
        <>
            <LampContainer className=''>
                <motion.h1
                    initial={{opacity: 0.5, y: 300}}
                    whileInView={{opacity: 1, y: 90}}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: "easeInOut",
                    }}
                    className="mt-44 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"

                >
                    Find My Classroom

                </motion.h1>
                <motion.button
                    initial={{opacity: 0.5, y: 220}}
                    whileInView={{opacity: 1, y: 90}}
                    transition={{
                        delay: 0.3,
                        duration: 1,
                        ease: "easeInOut",
                    }}
                    className=" w-48 h-10 mt-8 bg-white rounded-xl text-cyan-500 text-lg font-bold hover:bg-cyan-500 hover:text-white"
                >

                    Go to App


                </motion.button>
            </LampContainer>
        </>
    )
        ;
}


export default LampSection;
