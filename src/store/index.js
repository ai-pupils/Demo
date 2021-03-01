import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import initState from './initState';
import {getProfile, signout} from './api/auth';
import {LOAD_PROFILE, SIGN_OUT} from './mutationTypes';
import {generateAsyncAction, generateAsyncMutation} from './generateAsync';

import logModule from './log';
import transactionModule from './transaction';
import customerModule from './customer';
import cabinetModule from './cabinet';
import skuModule from './sku';
import skuBundleModule from './sku-bundle';
import app from '@/store/module/app';
import user from '@/store/module/user';
import cabinetGroupModule from './cabinet-group';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  state: initState,
  strict: true,
  plugins: debug ? [createLogger()] : [],
  modules: {
    app,
    user,
    log: logModule,
    transaction: transactionModule,
    customer: customerModule,
    cabinet: cabinetModule,
    sku: skuModule,
    skuBundle: skuBundleModule,
    cabinetGroup: cabinetGroupModule
  },
  actions: {
    getProfile: generateAsyncAction(getProfile, {mutateType: LOAD_PROFILE}),
    signout: generateAsyncAction(signout, {mutateType: SIGN_OUT})
  },
  mutations: {
    ...generateAsyncMutation(undefined, {mutateType: LOAD_PROFILE, statePath: 'profile'}),
    ...generateAsyncMutation(initState, {mutateType: SIGN_OUT})
  }
});
