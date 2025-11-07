import React, { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  // Mobile menu state
  isMobileMenuOpen: false,

  // Theme settings
  isDarkMode: false,

  // Loading states
  isGlobalLoading: false,

  // Modal states
  activeModal: null, // 'create-listing', 'filters', 'profile-edit', etc.

  // UI preferences
  sidebarOpen: false,

  // Notifications
  notifications: [],

  // Search state
  searchQuery: '',
  searchActive: false,

  // Filter states
  activeFilters: {
    category: '',
    priceRange: [0, 1000],
    location: '',
    radius: 10,
  },
};

// Action types
const UI_ACTIONS = {
  TOGGLE_MOBILE_MENU: 'TOGGLE_MOBILE_MENU',
  CLOSE_MOBILE_MENU: 'CLOSE_MOBILE_MENU',
  TOGGLE_THEME: 'TOGGLE_THEME',
  SET_GLOBAL_LOADING: 'SET_GLOBAL_LOADING',
  OPEN_MODAL: 'OPEN_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  TOGGLE_SEARCH: 'TOGGLE_SEARCH',
  UPDATE_FILTERS: 'UPDATE_FILTERS',
  CLEAR_FILTERS: 'CLEAR_FILTERS',
};

// Reducer
const uiReducer = (state, action) => {
  switch (action.type) {
    case UI_ACTIONS.TOGGLE_MOBILE_MENU:
      return {
        ...state,
        isMobileMenuOpen: !state.isMobileMenuOpen,
      };

    case UI_ACTIONS.CLOSE_MOBILE_MENU:
      return {
        ...state,
        isMobileMenuOpen: false,
      };

    case UI_ACTIONS.TOGGLE_THEME:
      return {
        ...state,
        isDarkMode: !state.isDarkMode,
      };

    case UI_ACTIONS.SET_GLOBAL_LOADING:
      return {
        ...state,
        isGlobalLoading: action.payload,
      };

    case UI_ACTIONS.OPEN_MODAL:
      return {
        ...state,
        activeModal: action.payload,
      };

    case UI_ACTIONS.CLOSE_MODAL:
      return {
        ...state,
        activeModal: null,
      };

    case UI_ACTIONS.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };

    case UI_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case UI_ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== action.payload
        ),
      };

    case UI_ACTIONS.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
      };

    case UI_ACTIONS.TOGGLE_SEARCH:
      return {
        ...state,
        searchActive: !state.searchActive,
        searchQuery: !state.searchActive ? '' : state.searchQuery,
      };

    case UI_ACTIONS.UPDATE_FILTERS:
      return {
        ...state,
        activeFilters: {
          ...state.activeFilters,
          ...action.payload,
        },
      };

    case UI_ACTIONS.CLEAR_FILTERS:
      return {
        ...state,
        activeFilters: initialState.activeFilters,
      };

    default:
      return state;
  }
};

// Create context
const UIContext = createContext();

// Provider component
export const UIProvider = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  // Actions
  const toggleMobileMenu = () => {
    dispatch({ type: UI_ACTIONS.TOGGLE_MOBILE_MENU });
  };

  const closeMobileMenu = () => {
    dispatch({ type: UI_ACTIONS.CLOSE_MOBILE_MENU });
  };

  const toggleTheme = () => {
    dispatch({ type: UI_ACTIONS.TOGGLE_THEME });
  };

  const setGlobalLoading = (isLoading) => {
    dispatch({ type: UI_ACTIONS.SET_GLOBAL_LOADING, payload: isLoading });
  };

  const openModal = (modalType) => {
    dispatch({ type: UI_ACTIONS.OPEN_MODAL, payload: modalType });
  };

  const closeModal = () => {
    dispatch({ type: UI_ACTIONS.CLOSE_MODAL });
  };

  const toggleSidebar = () => {
    dispatch({ type: UI_ACTIONS.TOGGLE_SIDEBAR });
  };

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      timestamp: new Date(),
      ...notification,
    };
    dispatch({ type: UI_ACTIONS.ADD_NOTIFICATION, payload: newNotification });

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id) => {
    dispatch({ type: UI_ACTIONS.REMOVE_NOTIFICATION, payload: id });
  };

  const setSearchQuery = (query) => {
    dispatch({ type: UI_ACTIONS.SET_SEARCH_QUERY, payload: query });
  };

  const toggleSearch = () => {
    dispatch({ type: UI_ACTIONS.TOGGLE_SEARCH });
  };

  const updateFilters = (filters) => {
    dispatch({ type: UI_ACTIONS.UPDATE_FILTERS, payload: filters });
  };

  const clearFilters = () => {
    dispatch({ type: UI_ACTIONS.CLEAR_FILTERS });
  };

  const value = {
    ...state,
    // Actions
    toggleMobileMenu,
    closeMobileMenu,
    toggleTheme,
    setGlobalLoading,
    openModal,
    closeModal,
    toggleSidebar,
    addNotification,
    removeNotification,
    setSearchQuery,
    toggleSearch,
    updateFilters,
    clearFilters,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

// Hook to use UI context
export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};

export default UIContext;