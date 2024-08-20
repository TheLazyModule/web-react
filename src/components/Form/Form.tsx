"use client";
import React from "react";
import {MdMyLocation} from "react-icons/md";
import {cn} from "@/lib/utils.ts";
import {IoAccessibility, IoEllipsisVertical, IoLocationOutline} from "react-icons/io5";
import {SubmitHandler, useForm} from "react-hook-form";
import ComboBox from "./select";
import useLocationQueryStore from "@/hooks/useLocationStore";
import ButtonGroup from "@/components/ButtonGroup";
import {Button} from "@/components/ui/button.tsx";
import toast from "react-hot-toast";
import useLiveLocation from "@/hooks/useLiveLocation.ts";
import {LatLngExpression} from "leaflet";

interface IFormInput {
    from: string;
    to: string;
}

function Form() {
    const setFrom = useLocationQueryStore(s => s.setFrom);
    const setTo = useLocationQueryStore(s => s.setTo);

    const {register, handleSubmit, formState: {errors}} = useForm<IFormInput>();
    const locationQueryFrom = useLocationQueryStore((s) => s.locationQuery.from);
    const locationQueryTo = useLocationQueryStore((s) => s.locationQuery.to);
    const setFromLocation = useLocationQueryStore((s) => s.setFromLocation);
    const setUserMarkerLocation = useLocationQueryStore((s) => s.setUserMarkerLocation);
    const setLocationGeom = useLocationQueryStore((s) => s.setSingleLocationGeom);
    const setLiveLocationWkt = useLocationQueryStore(s => s.setLiveLocationWkt);
    const setLiveLocationLatLng = useLocationQueryStore(s => s.setLiveLocationLatLng);


    const {isGeolocationEnabled, geolocatedCoords} = useLiveLocation();

    const onSubmit: SubmitHandler<IFormInput> = (data) => {
        if (data.from && data.to) {
            setFrom({
                ...locationQueryFrom,
                category_id: 0,
                geom: "",
                id: "",
                name: data.from
            });
            setTo({
                ...locationQueryTo,
                category_id: 0,
                geom: "",
                id: "",
                name: data.to
            });
        }
    };

    const handleGeolocationClick = () => {
        if (!isGeolocationEnabled) {
            toast.error("Live location not enabled")
            return
        }
        try {
            if (geolocatedCoords) {
                const latlng: LatLngExpression = geolocatedCoords;
                const newLiveLocation = `POINT(${latlng[1]} ${latlng[0]})`;
                setLiveLocationLatLng(latlng);
                setLiveLocationWkt(newLiveLocation);
                setLocationGeom('')
                setUserMarkerLocation(null)
                setFromLocation(newLiveLocation);
                setFrom({
                    ...locationQueryFrom,
                    category_id: 0,
                    geom: "",
                    id: "",
                    name: "My Location"
                });
            }
        } catch (e) {
            toast.error("Failed to get location")
        }
    };

    return (
        <div
            className="max-w-md w-full mx-auto font-bai rounded-none md:rounded-2xl  md:p-10 shadow-input bg-white dark:bg-black">
            <h2 className="font-bold text-neutral-800 text-2xl dark:text-neutral-200">
                Welcome <br/>to Find My classroom
            </h2>
            <p className="text-neutral-600 text-lg max-w-sm mt-2 dark:text-neutral-300">
                Where do you want to go?
            </p>

            <form className="my-8  flex flex-col justify-center items-center" onSubmit={handleSubmit(onSubmit)}>
                <ButtonGroup/>
                <div className="flex flex-row space-y-2 md:space-y-0 mb-4">
                    <div className='items-center'>
                        <IoAccessibility size={25} color='green'/>
                        <IoEllipsisVertical size={18} className='ml-1 mt-3'/>
                        <IoEllipsisVertical size={18} className='ml-1'/>
                        <IoEllipsisVertical size={18} className='ml-1 mb-3'/>
                        <IoLocationOutline size={25} color='red'/>
                    </div>
                    <div>
                        <LabelInputContainer className='flex flex-row mb-12 ml-3 w-full'>
                            <div className='flex flex-col'>
                                <ComboBox type='from'  {...register("from", {required: true})} />
                                {errors.from && <h5 className='text-red-700/20'><span>You missed this field</span></h5>}
                            </div>
                            <div className='flex flex-col justify-center items-center  mx-2'>
                                <Button type='button'
                                        className=' bg-white p-0 border-0 hover:bg-muted hover:rounded-3xl'
                                        variant='outline' onClick={handleGeolocationClick}>
                                    <MdMyLocation size={26} className='text-blue-700 mx-2  cursor-pointer'/>
                                </Button>
                            </div>
                        </LabelInputContainer>
                        <LabelInputContainer className='flex flex-row mt-6 ml-3'>
                            <div className='flex flex-col'>
                                <ComboBox type='to'  {...register("to", {required: true})} />
                                {errors.to && <h5 className='text-red-700/50'><span>You missed this field</span></h5>}
                            </div>
                            <div className='flex flex-col justify-center items-center'>
                                <div className='mx-2'></div>

                            </div>
                        </LabelInputContainer>
                    </div>
                </div>
                <BottomGradient/>
                <div
                    className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full"/>
            </form>
        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span
                className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"/>
            <span
                className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"/>
        </>
    );
};

const LabelInputContainer = ({
                                 children,
                                 className,
                             }: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};

export default Form;
