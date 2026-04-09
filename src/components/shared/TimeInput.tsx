"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeInputProps {
  value: string; // HH:mm
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export function TimeInput({ value, onChange, label, className }: TimeInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  // Sincroniza o estado interno com o valor externo quando ele muda (ex: reset ou carga inicial)
  useEffect(() => {
    if (!isFocused) {
      setInputValue(value);
    }
  }, [value, isFocused]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ""); // Remove tudo que não é dígito
    
    // Limita a 4 dígitos (HHMM)
    if (val.length > 4) val = val.slice(0, 4);

    // Aplica a máscara visual HH:mm conforme digita
    let formatted = val;
    if (val.length >= 3) {
      formatted = `${val.slice(0, 2)}:${val.slice(2)}`;
    } else if (val.length > 0) {
      formatted = val;
    }

    setInputValue(formatted);

    // Se tiver 4 dígitos completos, valida e envia para o componente pai
    if (val.length === 4) {
      const h = parseInt(val.slice(0, 2));
      const m = parseInt(val.slice(2));
      
      const validH = Math.min(Math.max(h, 0), 23);
      const validM = Math.min(Math.max(m, 0), 59);
      
      const result = `${validH.toString().padStart(2, "0")}:${validM.toString().padStart(2, "0")}`;
      setInputValue(result);
      onChange(result);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    
    // Ao sair, garante que o valor seja válido e formatado
    let clean = inputValue.replace(/\D/g, "");
    
    if (clean.length === 0) {
      setInputValue(value); // Se apagou tudo, volta para o valor anterior
      return;
    }

    // Preenchimento parcial (ex: "7" -> "07:00", "15" -> "15:00", "153" -> "15:03")
    let h = 0;
    let m = 0;

    if (clean.length <= 2) {
      h = parseInt(clean);
    } else {
      h = parseInt(clean.slice(0, 2));
      m = parseInt(clean.slice(2));
    }

    const validH = Math.min(Math.max(h, 0), 23);
    const validM = Math.min(Math.max(m, 0), 59);
    
    const finalValue = `${validH.toString().padStart(2, "0")}:${validM.toString().padStart(2, "0")}`;
    setInputValue(finalValue);
    onChange(finalValue);
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
          "flex items-center gap-3 bg-background border-2 rounded-2xl px-4 py-3 transition-all",
          isFocused ? "border-primary ring-4 ring-primary/10 shadow-sm" : "border-secondary hover:border-primary/30"
        )}
      >
        <Clock className={cn("w-5 h-5 shrink-0 transition-colors", isFocused ? "text-primary" : "text-muted-foreground")} />
        
        <input
          type="text"
          inputMode="numeric"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholder="00:00"
          className="w-full bg-transparent outline-none font-mono text-lg font-bold text-foreground placeholder:text-muted-foreground/30"
        />
      </div>
    </div>
  );
}
