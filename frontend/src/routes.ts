export const routes = {
    auth: '/auth',
    login: '/login',
    questManagement: '/quest-management',
    debugger: '/debugger-cmp',
    questDetails: (questId = ':questId') => `/quest/${questId}`,
  };
