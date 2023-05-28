import React from 'react'
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@heroicons/react/outline"

const Button = () => {
    const { systemTheme, theme, setTheme } = useTheme();
    const currentTheme = theme === 'system' ? systemTheme : theme;

    return (
        <button
            onClick={() => theme == "dark"? setTheme('light'): setTheme("dark")}
            className='
            
              transition-all duration-100
            '>
           { theme == "dark" ? (<MoonIcon className='h-6 w-12' />) : (<SunIcon className='h-6 w-12' />)}
           
        </button>
    )
}

export default Button;