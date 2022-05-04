import React from 'react';
import 'react-app-polyfill/ie11';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { HashRouter } from 'react-router-dom';

import AppWrapper from './AppWrapper';
import './utilities/i18n-next';

const queryClient = new QueryClient();
queryClient.setDefaultOptions({
  queries: {
    retry: (_failureCount, error) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return true;
    },
  },
});

ReactDOM.render(
  <HashRouter>
    <QueryClientProvider client={queryClient}>
      <AppWrapper />
    </QueryClientProvider>
  </HashRouter>,
  document.getElementById('root')
);
