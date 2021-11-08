import React, { createContext, useState } from 'react';

const initialState = {
  content: null,
};

export const ToastContext = createContext(initialState);

export const ToastProvider = ({ children }) => {
  const [toastContent, setToastContent] = useState(initialState);

  return (
    <ToastContext.Provider
      value={{
        ...toastContent,
        clear: () => setToastContent(initialState),
        setError: (summary, detail) =>
          setToastContent({ content: { summary, detail, severity: 'error' } }),
        setInfo: (summary, detail) =>
          setToastContent({ content: { summary, detail, severity: 'info' } }),
        setWarn: (summary, detail) =>
          setToastContent({ content: { summary, detail, severity: 'warn' } }),
        setSuccess: (summary, detail) =>
          setToastContent({
            content: { summary, detail, severity: 'success' },
          }),
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};
