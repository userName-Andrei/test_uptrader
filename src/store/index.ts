import {applyMiddleware, createStore, compose} from 'redux';
import thunk from 'redux-thunk'
import { rootReducer } from './reducers';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
    rootReducer, 
    composeEnhancers(
        applyMiddleware(thunk)
    )
)

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
