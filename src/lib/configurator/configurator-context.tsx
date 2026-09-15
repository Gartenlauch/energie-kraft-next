"use client";

import {
  createContext,
  type Dispatch,
  type ReactNode,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

import {
  clearConfiguratorState,
  readConfiguratorState,
  writeConfiguratorState,
} from "@/lib/configurator/storage";
import {
  applyCalculatorHandoff,
  clearCalculatorHandoff,
  readCalculatorHandoff,
} from "@/lib/configurator/calculator-handoff";
import { configuratorReducer, createInitialConfiguratorState } from "@/lib/configurator/state";
import type { ConfiguratorAction, ConfiguratorState } from "@/types/configurator";

interface ConfiguratorContextValue {
  state: ConfiguratorState;
  dispatch: Dispatch<ConfiguratorAction>;
  reset: () => void;
  isHydrated: boolean;
}

const ConfiguratorContext = createContext<ConfiguratorContextValue | null>(null);

interface ConfiguratorProviderProps {
  children: ReactNode;
}

export function ConfiguratorProvider({ children }: ConfiguratorProviderProps) {
  const [state, dispatch] = useReducer(configuratorReducer, createInitialConfiguratorState());

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const persistedState = readConfiguratorState(window.sessionStorage);
    const calculatorHandoff = readCalculatorHandoff(window.sessionStorage);

    queueMicrotask(() => {
      if (cancelled) {
        return;
      }

      if (persistedState || calculatorHandoff) {
        if (calculatorHandoff) {
          clearCalculatorHandoff(window.sessionStorage);
        }

        dispatch({
          type: "REPLACE_STATE",
          payload: calculatorHandoff
            ? applyCalculatorHandoff(
                persistedState ?? createInitialConfiguratorState(),
                calculatorHandoff,
              )
            : (persistedState ?? createInitialConfiguratorState()),
        });
      }

      setIsHydrated(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    writeConfiguratorState(window.sessionStorage, state);
  }, [isHydrated, state]);

  function reset() {
    clearConfiguratorState(window.sessionStorage);

    dispatch({
      type: "RESET",
    });
  }

  return (
    <ConfiguratorContext.Provider
      value={{
        state,
        dispatch,
        reset,
        isHydrated,
      }}
    >
      {children}
    </ConfiguratorContext.Provider>
  );
}

export function useConfigurator() {
  const context = useContext(ConfiguratorContext);

  if (!context) {
    throw new Error("useConfigurator must be used inside a ConfiguratorProvider.");
  }

  return context;
}