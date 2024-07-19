export const routes = {
    index: '/',
    auth: '/auth',
    login: '/login',
    questManagement: '/quest-management',
    questDetails: (questId = ':questId') => `/quest/${questId}`,
    selectLocation: (photoId = ':photoId') => `/select-location/${photoId}`,
  };
