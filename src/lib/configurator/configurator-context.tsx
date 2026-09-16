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

import { readConfiguratorState, writeConfiguratorState } from "@/lib/configurator/storage";
import {
  applyCalculatorHandoff,
  clearCalculatorHandoff,
  readCalculatorHandoff,
} from "@/lib/configurator/calculator-handoff";
import { configuratorReducer, createInitialConfiguratorState } from "@/lib/configurator/state";
import { clearSubmittedConfiguratorProject } from "@/lib/configurator/project-reset";
import type { ConfiguratorAction, ConfiguratorState } from "@/types/configurator";
import type { ConfiguratorSettings } from "@/lib/configurator/settings-model";

interface ConfiguratorContextValue {
  state: ConfiguratorState;
  dispatch: Dispatch<ConfiguratorAction>;
  reset: () => void;
  isHydrated: boolean;
}

const ConfiguratorContext = createContext<ConfiguratorContextValue | null>(null);

interface ConfiguratorProviderProps {
  children: ReactNode;
  settings: ConfiguratorSettings;
}

export function ConfiguratorProvider({ children, settings }: ConfiguratorProviderProps) {
  const [initialSettings] = useState(() => settings);
  const [state, dispatch] = useReducer(configuratorReducer, initialSettings, createInitialConfiguratorState);

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
                persistedState ?? createInitialConfiguratorState(initialSettings),
                calculatorHandoff,
              )
            : (persistedState ?? createInitialConfiguratorState(initialSettings)),
        });
      }

      setIsHydrated(true);
    });

    return () => {
      cancelled = true;
    };
  }, [initialSettings]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    writeConfiguratorState(window.sessionStorage, state);
  }, [isHydrated, state]);

  function reset() {
    clearSubmittedConfiguratorProject(window.sessionStorage);

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
