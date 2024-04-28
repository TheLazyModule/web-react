import {FaRoute} from "react-icons/fa6";
import {SiGoogleclassroom} from "react-icons/si";
import {BsBuilding} from "react-icons/bs";

const Features = () => {
    return (

        <section className='bg-cyan-100'>
            <div className='flex justify-center'>
                <h1 className='text-6xl mt-6 text-[#093860]'>Features</h1>
            </div>
            <div className='flex flex-col justify-between sm:flex-row items-center px-20 py-20'>
                <div className='flex flex-col items-center '>
                    <h3 className='text-[#093850] text-2xl'>Find Building</h3>
                    <BsBuilding size={120} color='#093850'
                                className="my-6 hover:opacity-50 hover:scale-110 transition duration-300 ease-in-out"/>
                </div>

                <div className='flex flex-col items-center my-10 sm:my-0'>
                    <h3 className='text-[#093850] text-2xl'>Find Classroom</h3>
                    <SiGoogleclassroom size={120} color='#093850'
                                       className="my-6 hover:opacity-50 hover:scale-110 transition duration-300 ease-in-out"/>
                </div>

                <div className='flex flex-col items-center'>
                    <h3 className='text-[#093850] text-2xl'>Find Place</h3>
                    <FaRoute size={120} color='#093850'
                             className="my-6 hover:opacity-50 hover:scale-110 transition duration-300 ease-in-out"/>
                </div>
            </div>
        </section>
    );
};

export default Features;