import { createContext, useState } from "react";

const VibecarContext = createContext();
VibecarContext.value = {
  usuarioActual: null
}

export function useForceUpdate() {
  const [value, setValue] = useState(0);
  return () => setValue(value => ++value);
}

export default VibecarContext;