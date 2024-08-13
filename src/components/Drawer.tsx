import React, { ReactNode } from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

interface CustomDrawerProps {
    anchor: 'top' | 'left' | 'bottom' | 'right';
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: ReactNode;
}

const Drawer: React.FC<CustomDrawerProps> = ({ anchor, open, onOpenChange, children }) => {
    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event && event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
            return;
        }
        onOpenChange(open);
    };

    return (
        <SwipeableDrawer
            // swipeAreaWidth={30}
            className='z-[1000000]'
            anchor={anchor}
            open={open}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
        >
            <Box
                className='bg-background border-t-2 border-border'
                sx={{ width: anchor === 'top' || anchor === 'bottom' ? '100%' : 250 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
            >
                {children}
            </Box>
        </SwipeableDrawer>
    );
};

export default Drawer;
