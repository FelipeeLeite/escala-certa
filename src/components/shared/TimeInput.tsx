"use client";

import React, { useState, useRef, useEffect } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeInputProps {
  value: string; // HH:mm
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export function TimeInput({ value, onChange, label, className }: TimeInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Divide o valor HH:mm
  const [hours, minutes] = value.split(":");

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) val = val.slice(-2);
    
    const h = parseInt(val);
    if (h > 23) val = "23";
    
    onChange(`${val.padStart(2, "0")}:${minutes}`);
    
    // Auto-focus para minutos se preencheu 2 dígitos
    if (val.length === 2 && val !== "0") {
      const nextInput = inputRef.current?.parentElement?.querySelectorAll("input")[1];
      nextInput?.focus();
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 2) val = val.slice(-2);
    
    const m = parseInt(val);
    if (m > 59) val = "59";
    
    onChange(`${hours}:${val.padStart(2, "0")}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, part: "h" | "m") => {
    if (e.key === "Backspace" && part === "m" && (e.currentTarget.value === "" || e.currentTarget.value === "00")) {
      inputRef.current?.focus();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Validação final ao sair: garante HH:mm com 2 dígitos
    const h = (hours || "00").padStart(2, "0");
    const m = (minutes || "00").padStart(2, "0");
    onChange(`${h}:${m}`);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
          {label}
        </label>
      )}
      <div 
        className={cn(
          "flex items-center gap-2 bg-background border-2 rounded-2xl px-4 py-3 transition-all group",
          isFocused ? "border-primary ring-4 ring-primary/10" : "border-secondary hover:border-primary/30"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        <Clock className={cn("w-5 h-5 transition-colors", isFocused ? "text-primary" : "text-muted-foreground")} />
        
        <div className="flex items-center flex-1 font-mono text-lg font-bold">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={hours}
            onChange={handleHoursChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            onKeyDown={(e) => handleKeyDown(e, "h")}
            className="w-8 bg-transparent outline-none text-center focus:text-primary"
            placeholder="00"
          />
          <span className="text-muted-foreground/50 mx-1">:</span>
          <input
            type="text"
            inputMode="numeric"
            value={minutes}
            onChange={handleMinutesChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            onKeyDown={(e) => handleKeyDown(e, "m")}
            className="w-8 bg-transparent outline-none text-center focus:text-primary"
            placeholder="00"
          />
        </div>

        {/* Picker Nativo escondido para acionar o teclado de tempo no Mobile */}
        <input
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute opacity-0 pointer-events-none w-0 h-0"
        />
      </div>
    </div>
  );
}
