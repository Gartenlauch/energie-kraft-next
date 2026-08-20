"use client";

import {
  createContext,
  type Dispatch,
  type ReactNode,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";

import {
  clearConfiguratorState,
  readConfiguratorState,
  writeConfiguratorState,
} from "@/lib/configurator/storage";
import {
  configuratorReducer,
  createInitialConfiguratorState,
} from "@/lib/configurator/state";
import type {
  ConfiguratorAction,
  ConfiguratorState,
} from "@/types/configurator";

interface ConfiguratorContextValue {
  state: ConfiguratorState;
  dispatch: Dispatch<ConfiguratorAction>;
  reset: () => void;
}

const ConfiguratorContext =
  createContext<ConfiguratorContextValue | null>(null);

interface ConfiguratorProviderProps {
  children: ReactNode;
}

export function ConfiguratorProvider({
  children,
}: ConfiguratorProviderProps) {
  const [state, dispatch] = useReducer(
    configuratorReducer,
    createInitialConfiguratorState(),
  );

  const hydratedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const persistedState = readConfiguratorState(window.sessionStorage);

    queueMicrotask(() => {
      if (cancelled) {
        return;
      }

      if (persistedState) {
        dispatch({
          type: "REPLACE_STATE",
          payload: persistedState,
        });
      }

      hydratedRef.current = true;
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) {
      return;
    }

    writeConfiguratorState(window.sessionStorage, state);
  }, [state]);

  function reset() {
    clearConfiguratorState(window.sessionStorage);
    dispatch({ type: "RESET" });
  }

  return (
    <ConfiguratorContext.Provider
      value={{
        state,
        dispatch,
        reset,
      }}
    >
      {children}
    </ConfiguratorContext.Provider>
  );
}

export function useConfigurator() {
  const context = useContext(ConfiguratorContext);

  if (!context) {
    throw new Error(
      "useConfigurator must be used inside a ConfiguratorProvider.",
    );
  }

  return context;
}