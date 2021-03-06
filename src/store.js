import { extendObservable, action } from 'mobx';
import ComputedWallet from './computed/wallet';
import ComputedTransactions from './computed/transactions';
import ComputedChannels from './computed/channels';
import { DEFAULT_ROUTE } from './config';
import * as log from './actions/logs';

export class Store {
  constructor() {
    extendObservable(this, {
      loaded: false, // Is persistent data loaded
      unlockerReady: false, // Is wallet unlocker running
      walletUnlocked: false, // Is the wallet unlocked
      lndReady: false, // Is lnd process running
      syncedToChain: false, // Is lnd synced to blockchain
      route: DEFAULT_ROUTE,
      blockHeight: null,
      balanceSatoshis: null,
      confirmedBalanceSatoshis: null,
      unconfirmedBalanceSatoshis: null,
      channelBalanceSatoshis: null,
      pubKey: null,
      walletAddress: null,
      ipAddress: null,
      transactions: null,
      invoices: null,
      payments: null,
      peers: null,
      channels: null,
      pendingChannels: null,
      paymentRequest: null,
      seedMnemonic: null,
      notifications: [],
      logs: [],

      // Persistent data
      settings: {},
    });

    ComputedWallet(this);
    ComputedTransactions(this);
    ComputedChannels(this);
  }

  init(AsyncStorage) {
    this._AsyncStorage = AsyncStorage;
    try {
      this._AsyncStorage.getItem('settings').then(
        action(stateString => {
          const state = JSON.parse(stateString);
          state &&
            Object.keys(state).forEach(key => {
              if (typeof this.settings[key] !== 'undefined') {
                this.settings[key] = state[key];
              }
            });
          log.info('Loaded initial state');
          this.loaded = true;
        })
      );
    } catch (err) {
      log.info('Store load error', err);
      this.loaded = true;
    }
  }

  save() {
    try {
      const state = JSON.stringify(this.settings);
      this._AsyncStorage.setItem('settings', state);
      log.info('Saved state');
    } catch (error) {
      log.info('Store Error', error);
    }
  }

  clear() {
    log.info('!!!!!!!!!CLEARING ALL PERSISTENT DATA!!!!!!');
    Object.keys(this.settings).map(key => (this.settings[key] = null));
    this.save();
  }
}

export default new Store();
