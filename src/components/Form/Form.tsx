"use client";
import React, {useRef} from "react";
import {cn} from "@/lib/utils.ts";
import {Input} from "./input";
import {IoAccessibility} from "react-icons/io5";
import {IoEllipsisVertical} from "react-icons/io5";
import {IoLocationOutline} from "react-icons/io5";

function Form() {
    const fromRef = useRef<HTMLInputElement>(null);
    const toRef = useRef<HTMLInputElement>(null);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form submitted");
    };
    return (
        <div
            className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
            <h2 className="font-bold text-neutral-800 text-2xl  dark:text-neutral-200">
                Welcome <br/>to Find My classroom
            </h2>
            <p className="text-neutral-600 text-lg max-w-sm mt-2 dark:text-neutral-300">
                Where do you want to go?
            </p>

            <form className="my-8" onSubmit={handleSubmit}>
                <div className="flex flex-row space-y-2 md:space-y-0 mb-4">
                    <div className='items-center'>
                        <IoAccessibility size={25} color='green'/>
                        <IoEllipsisVertical size={18} className='ml-1 mt-3'/>
                        <IoEllipsisVertical size={18} className='ml-1 mb-3'/>
                        <IoLocationOutline size={25} color='red'/>
                    </div>
                    <div>
                        <LabelInputContainer className='mb-6 ml-3'>
                            {/*<Label htmlFor="from">From</Label>*/}
                            <Input ref={fromRef} id="from" placeholder="Choose Starting point or Click on the map"
                                   type="text" />
                        </LabelInputContainer>
                        <LabelInputContainer className='mt-6 ml-3'>
                            {/*<Label htmlFor="to">To</Label>*/}
                            <Input ref={toRef} id="to" placeholder="Choose Destination" type="text"/>
                        </LabelInputContainer>
                    </div>
                </div>
                <button
                    className={`${fromRef.current?.value === '' || toRef.current?.value === '' ? 'disabled' : ''} bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]`}
                    type="submit"
                >
                    Find &rarr;
                    <BottomGradient/>
                </button>

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